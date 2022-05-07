const express = require('express')
const { createPageRenderer } = require('vite-plugin-ssr')
const { extractLocale } = require('./utils/locales')

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`
const base = '/'
const baseAssets = '/'
const outDir = `dist`

async function startServer() {
  const app = express()

  let viteDevServer
  if (isProduction) {
    app.use(express.static(`${root}/${outDir}/client`))
  } else {
    const vite = require('vite')
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: 'ssr' },
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRenderer({
    viteDevServer,
    isProduction,
    root,
    outDir,
    base,
    baseAssets,
  })
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
    const stream = await httpResponse.getNodeStream()
    const { statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType)
    stream.pipe(res)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

startServer()
