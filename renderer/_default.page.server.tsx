import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject } from 'vite-plugin-ssr'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { Layout } from './Layout'
import { getSeo } from './getSeo'
import type { PageContext } from './types'

export { render }
export { passToClient }

const passToClient = ['pageProps', 'documentProps', 'someAsyncProps']

function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, pageProps } = pageContext
  // TODO: vite-plugin-ssr 待支持 renderToPipeableStream
  const stream = ReactDOMServer.renderToStaticNodeStream(
    <Layout pageContext={pageContext}>
      <Page {...pageProps} />
    </Layout>,
  )

  const { title, description } = getSeo(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <title>${description}</title>
        <meta name="description" content="We deliver payload to space.">
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    // We can return a `pageContext` promise
    pageContext: (async () => {
      return {
        someAsyncProps: 42,
      }
    })(),
  }
}
