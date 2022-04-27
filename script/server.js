const http = require('http')
const path = require('path')
const createViteHandle = require('./vite-handle')

const isProd = process.env.NODE_ENV === 'production'
const port = +process.env.PORT || 3000
const resolve = (p) => path.resolve(__dirname, p)
const getCwd = () => {
  return resolve(process.cwd(), process.env.APP_ROOT ?? '')
}
const rootUrl = getCwd()
createViteHandle({
  index: isProd
    ? path.join(rootUrl, 'dist/client/index.html')
    : path.join(rootUrl, 'index.html'),
  dist: path.join(rootUrl, 'dist'),
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
