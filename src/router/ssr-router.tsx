import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import {
  matchRoutes,
  renderRoutes,
  RouteConfig,
  RouteConfigComponentProps,
} from 'react-router-config'
import { queryStringToObject } from '../utils'

function ssrWrapper(
  Component: React.ComponentType<RouteConfigComponentProps<{}>> & {
    loadData?: any
  },
) {
  function SSRPage(props: RouteConfig & { ssr: any }) {
    const exit = useRef(false)
    const ssr = props.ssr[props.match.path]
    const ssrData = ssr ? ssr.data : null
    const url = props.location!.pathname + props.location!.search
    const data = {
      ...ssrData,
      ssrCurrent: props.ssr.hasOwnProperty(props.match.path) && ssr.url === url,
    }
    data.loaded = data.ssrCurrent
    const firstRender = useRef(data.ssrCurrent)
    const [injectData, setInjectData] = useState(data)

    const frontendLoadData = () => {
      Promise.all([
        Component.loadData({
          isSSR: false,
          query: queryStringToObject(props.location!.search),
          params: props.match.params,
          url: props.match.url + props.location!.search,
        }),
      ])
        .then(([result]) => {
          if (result.redirect) {
            if (/^http/.test(result.redirect)) {
              location.href = result.redirect
            } else {
              props.history.push(result.redirect)
            }
          } else {
            const newData = { ...result }
            newData.loaded = true

            // 避免 unmounted 还设置
            !exit.current && setInjectData(newData)
          }
        })
        .catch((err) => {
          const newData = { ...injectData, err }
          newData.loaded = true
          !exit.current && setInjectData(newData)
        })
    }

    const { pathname } = useLocation()
    useEffect(() => {
      // 切换路由，如果服务端渲染的不是当前路由时渲染
      if (!data.ssrCurrent && Component.loadData) {
        frontendLoadData()
        firstRender.current = false
      } else if (!firstRender.current && Component.loadData) {
        frontendLoadData()
      }
    }, [pathname])

    useEffect(() => {
      return () => {
        exit.current = true
      }
    }, [])

    return (
      <Component
        match={props.match}
        history={props.history}
        location={props.location}
        route={props.route}
        view={props.view}
        ssr={props.ssr}
        {...injectData}
      />
    )
  }

  SSRPage.loadData = Component.loadData
  SSRPage.$raw = Component

  return SSRPage
}

export interface IRouteConfig {
  key?: React.Key
  location?: Location
  component?: React.ReactElement | SSRPage<any>
  routes?: IRouteConfig[]
  path?: string | string[]
  exact?: boolean
  strict?: boolean
  render?: (props: RouteConfigComponentProps<any>) => React.ReactNode
  label?: string
}

export default class Router {
  private routes: IRouteConfig[]
  constructor({ routes }: IRouteConfig) {
    function loop(arr: IRouteConfig[]) {
      return arr.map((e) => {
        const route = {
          ...e,
          path: e.path,
          exact: e.exact === undefined ? true : e.exact,
        }

        if (e.routes) {
          route.component = (props) => {
            const comp = e.component! as any
            const Component = ssrWrapper(comp)
            return (
              <Component
                {...props}
                view={(props) =>
                  props.route.routes
                    ? renderRoutes(props.route.routes, { ssr: props.ssr })
                    : null
                }
              />
            )
          }

          route.component.loadData = (e.component as SSRPage).loadData
          route.exact = false
          route.routes = loop(e.routes)
        } else {
          route.component = ssrWrapper(e.component! as any) as any
        }

        return route
      })
    }

    this.routes = loop(routes!)
  }

  view(props: any) {
    return renderRoutes(this.routes as RouteConfig[], props)
  }

  match(url: string) {
    return matchRoutes(this.routes as RouteConfig[], url)
  }
}
