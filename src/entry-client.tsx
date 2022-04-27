import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { SSRProvider } from './context'

// hydrate 初始化时需要与服务端 renderToString 渲染是需要的数据一致
const text = document.getElementById('ssr-data')!.innerText
const props = JSON.parse(text)
const renderMethod = import.meta.env.SSR ? ReactDOM.render : ReactDOM.hydrate

renderMethod(
  <SSRProvider value={props}>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  </SSRProvider>,
  document.getElementById('app'),
)
