import { Seo } from 'components/SEO'
import { Link } from 'react-router-dom'
import './App.css'
import { SSRConsumer } from './context'
import ErrorPage from './pages/Error'
import router from './router'

export function App() {
  return (
    <>
      <SSRConsumer>
        {(ctx) => {
          if (ctx.$ssrErrorMsg) {
            return <ErrorPage message={ctx.$ssrErrorMsg} status={ctx.status!} />
          }

          return (
            <>
              <Seo
                title="Vite React SSR"
                description={'React SSR base on Vite'}
              ></Seo>
              <h1 className="text-center text-4xl my-[40px]">
                React SSR base on Vite
              </h1>
              <nav className="text-center main-nav">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                </ul>
              </nav>
              <div className="text-center">{router.view({ ssr: ctx })}</div>
            </>
          )
        }}
      </SSRConsumer>
    </>
  )
}
