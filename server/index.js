import express from 'express'
import { renderPage } from 'vite-plugin-ssr'
import { extractLocale } from './utils/locales.mjs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createServer } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

    //  const pageContext = await renderPage(pageContextInit)
    //  const { httpResponse } = pageContext
    //  if (!httpResponse) return next()
    //  const { body, statusCode, contentType } = httpResponse
    //  res.status(statusCode).type(contentType).send(body)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

startServer()
