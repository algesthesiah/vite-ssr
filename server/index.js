const express = require('express')
const cookieParser = require('cookie-parser')
const { createServer } = require('vite')
const { renderPage } = require('vite-plugin-ssr')
const { extractLocale } = require('./utils/locales')

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`
const outDir = `dist`

async function startServer() {
  const app = express()

  let viteDevServer
  if (isProduction) {
    app.use(express.static(`${root}/${outDir}/client`))
  } else {
    viteDevServer = await createServer({
      root,
      server: { middlewareMode: true },
    })
    app.use(viteDevServer.middlewares)
  }

  app.get('*', async (req, res, next) => {
    let url = req.originalUrl
    const { urlWithoutLocale, locale } = extractLocale(url)
    url = urlWithoutLocale
    const pageContextInit = { url, locale }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse, errorWhileRendering } = pageContext
    if (errorWhileRendering) {
      console.error(errorWhileRendering)
    }
    if (!httpResponse) return next()
    const { statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType)
    httpResponse.pipe(res)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

startServer()
