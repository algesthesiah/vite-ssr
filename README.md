# Vite React SSR

Server Side Rendering project template base on `Vite` + `React`.

Fully type declaration with TypeScript.

Support:

- fetch InitialData in `client-server.ts`
- `client-only` component support with `@loadable/component`
- SEO, `react-helmet`

## fetch InitialData

```ts
// client-server.ts
async loadData() {
  // ...

  // fetch initial data thisway.
  const apiUrl = env.APIURL
  const $http = axios.create({ baseURL: apiUrl })
  const { data } = await $http.get('aggregate')
  // dict is page's fetched data
  return { ...dict, ...{ initialData: data } }
}

```

And, you can add other hook to use Initial data.

```ts
// use-initial-data.ts

export const useInitialData = () => {
  return useContext(SSRContext).initialData as YourResponseType
}
```

## Client only component

load component with `@loadable/component`, and you can do this with dynamic import, vite will split page view into chunk.

```tsx
import loadable from '@loadable/component'
const OnlyClient: FC = () => {
  return <span>{location.href}</span>
}

const OT = loadable(() => Promise.resolve(OnlyClient), { ssr: false })

const Test: SSRPage = (props) => {
  return (
    <>
      <h1>Test</h1>
      <OT />
    </>
  )
}
```

## loadData

Define component loadData function:

```tsx
// pages/demo.tsx
function Demo(props) {
  // must type guard first
  if (!props.loaded) {
    return <span>Loading..</span>
  }
  // if loaded, then can access `data`, either you will get `undefined`
  return <>{JSON.stringify(props.data.list)}</>
}

// ssr data load
Demo.loadData = async (ctx) => {
  const [list, count] = await doRequest()
  return {
    // redirect: '/user/1234', // Switch to route
    // redirect: 'https://other.com?w=123', // Redirect to site

    // props.list
    list: [],
    // props.count
    count: 10,
  }
}

export default Demo
```

**ctx**:

- `ctx.isSSR` `boolean` whether is SSR.
- `ctx.url` `string` Url for request.
- `ctx.query` `object` Query params for request.
- `ctx.params` `object` route params for request.
- `ctx.req` When server rendering.

## Router

```js
// src/router.jsx
import Router from './components/router'
import Home from './pages/Home'
import User from './pages/User'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Layout from './pages/Layout'
import Page1 from './pages/Layout/Page-1'
import Page2 from './pages/Layout/Page-2'

export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/user/:userId', component: User },
    {
      path: '/layout',
      component: Layout,
      routes: [
        { path: '/layout/page-1', component: Page1 },
        { path: '/layout/page-2', component: Page2 },
      ],
    },
    { path: '/about', component: About },
    { label: '404', component: NotFound },
  ],
})
```

## Start

**dev**

```sh
npm run dev
```

**build**

```sh
npm run build
```

**serve**

```sh
npm run serve
```

## Deploy

1、build

```sh
npm run build
```

2、serve

```sh
cross-env NODE_ENV=production node server
```

# Shot

![Z9fSfV4](https://i.imgur.com/Z9fSfV4.png)