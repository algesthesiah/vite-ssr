import http from 'http'
import { resolve, join } from 'path'
import createViteHandle from './vite-handle'

const isProd = process.env.NODE_ENV === 'production'
const port = +process.env.PORT || 3000

const getCwd = () => {
  return resolve(process.cwd())
}

const rootUrl = getCwd()

createViteHandle({
  index: isProd
    ? join(rootUrl, 'dist/client/index.html')
    : join(rootUrl, 'index.html'),
  dist: join(rootUrl, 'dist'),
  dev: !isProd,
}).then((handle) => {
  const app = http.createServer((req, res) => {
    if (isProd) {
      require('compression')()(req, res, () => {
        handle(req, res)
      })
    } else {
      handle(req, res)
    }
  })

  app.listen(port, () => {
    console.log(`StartAt: http://localhost:${port}`)
  })
})
