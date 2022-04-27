import fs from 'fs';
import path from 'path'
import { IncomingMessage } from 'http'
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
const { Helmet } = require('react-helmet')
function queryStringToObject(query) {
  const result = query.match(/\?(.*)/)
  if (!result) return {}
  return Object.fromEntries(new URLSearchParams(result[1]))
}

async function createViteHandle({
  root = process.cwd(),
  dev = true,
  index,
  dist,
}) {
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite = null
  let staticServe = null
  const indexHTML = fs.readFileSync(index, 'utf-8')

  if (dev) {
    vite = await require('vite').createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: 'ssr',
      },
    })
  } else {
    staticServe = require('serve-static')(path.resolve(dist, 'client'), {
      index: false,
    })
  }

  return async (req, res) => {
    if (dev) {
      vite.middlewares(req, res, () => {
        handleRender(req, res, {
          template: indexHTML,
          dev,
          vite,
          dist,
        })
      })
    } else {
      staticServe(req, res, () => {
        handleRender(req, res, {
          template: indexHTML,
          dev,
          vite,
          dist,
        })
      })
    }
  }
}

/**
 *
 * @param {IncomingMessage} req
 * @param {*} res
 * @param {{template: any; dev: boolean; vite: import('vite').ViteDevServer;dist?: string}} param2
 * @returns
 */

async function handleRender(req, res, { template, dev, vite, dist }) {
  try {
    const url = req.url

    let render
    if (dev) {
      // always read fresh template in dev
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      render = require(path.resolve(dist, 'server/entry-server.js')).render
    }

    const context = {
      isSSR: true,
      query: req.query || queryStringToObject(req.url),
      url: req.originalUrl,
      req,
    }

    const { appHtml, propsData, redirect } = await render(url, context)

    if (redirect) {
      res.statusCode = 302
      res.setHeader('Location', redirect)
      res.end(`Location:${redirect}`)
      return
    }

    const ssrDataText = JSON.stringify(propsData).replace(/\//g, '\\/')
    const helmet = Helmet.renderStatic()
    const html = template
      .replace(
        '<!--init-props-->',
        `<script id="ssr-data" type="text/json">${ssrDataText}</script>`,
      )
      .replace(`<!--app-html-->`, appHtml)
      .replace(
        `<!--init-header-->`,
        `${helmet.meta.toString()}${helmet.title.toString()}${helmet.script.toString()}`,
      )

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; utf-8')
    res.end(html)
  } catch (err) {
    dev && vite.ssrFixStacktrace(err)
    res.statusCode = 500
    if (dev) {
      console.error(err)
      res.end(
        `
        <style>
        html {
          font-size: 14px;
        }
        main {
          max-width: 800px;
          margin: 5rem auto;
          border: 3px solid red;
          border-radius: 12px;
          padding: 12px;
        }
        pre {
          white-space: pre-line;
        }
        code {
          display: block;
          margin: 6px auto;
        }
        </style>
        <main>
        <p>${err.message}</p>
        <p style="color: red;">Error at file: ${err.id}</p>

        <div>
        <p>
          Frame at:
        </p>
        <pre>
        ${err.frame
          ?.split('\n')
          .map((line) => `<code>${line}</code>`)
          .join('')}
        </pre>
        </div>

        <div>
        <p>Output: </p>
        <pre>
        ${err.pluginCode
          ?.split('\n')
          .map((line) => `<code>${line}</code>`)
          .join('')}
        </pre>
        </div>
        </main>
        `,
      )
    } else {
      res.end('Server Error', err)
    }
  }
}

module.exports = createViteHandle
