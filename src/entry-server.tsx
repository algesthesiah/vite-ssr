import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import router from './router'
import { SSRProvider } from './context'

import axios from 'axios'
import { IncomingMessage } from 'http'
import Package from '../package.json'

async function loadData(url, context) {
  const routes = router.match(url.replace(/\?.*$/, ''))
  const paths = [] as string[]
  const promises = routes.map((e) => {
    paths.push(e.route.path as string)
    return (e.route.component as any).loadData
      ? (e.route.component as any).loadData({
          ...context,
          params: e.match.params,
        })
      : null
  })

  try {
    const arr = await Promise.all(promises)
    const dict = {} as Record<string, { url: string; data: any }>

    for (const i in arr) {
      dict[paths[i]] = {
        url: url,
        data: arr[i],
      }
    }

    return {
      ...dict,
      initialData: {
        data: {
          username: 'innei',
        },
      },
    }
  } catch (e: any) {
    if (e.response) {
      const message = e.response?.data.message
      return {
        message: Array.isArray(message) ? message[0] : message,
        status: e.response.statusCode || e.statusCode,
        code: e.code,
        error: true,
      }
    }
    return {
      message: Array.isArray(e.data?.message)
        ? e.data?.message[0]
        : e.data?.message,
      error: true,
      status: e.statusCode || 500,
    }
  }
}

export async function render(url: string, context: any) {
  let data: any = null

  try {
    // forward real ip to front side
    const req = context.req as IncomingMessage
    if (req) {
      let ip =
        ((req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress) as string) || undefined
      if (ip && ip.split(',').length > 0) {
        ip = ip.split(',')[0]
      }
      axios.defaults.headers.common['x-forwarded-for'] = ip

      axios.defaults.headers.common['User-Agent'] =
        req.headers['user-agent'] +
        ' kami-v2 SSR server' +
        `/${Package.version}`
    }

    data = await loadData(url, context)
  } catch (err: any) {
    data = { $ssrErrorMsg: __DEV__ ? err.stack : err.message }
  }

  if (data.error) {
    data = { ...data, $ssrErrorMsg: data.message }
  } else {
    for (const i in data) {
      if (data[i].data && data[i].data.redirect) {
        return { redirect: data[i].data.redirect }
      }
    }
  }

  const html = ReactDOMServer.renderToString(
    <SSRProvider value={data}>
      <StaticRouter location={url} context={context}>
        <App></App>
      </StaticRouter>
    </SSRProvider>,
  )

  return { appHtml: html, propsData: data }
}
