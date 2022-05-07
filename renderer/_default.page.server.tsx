import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject } from 'vite-plugin-ssr'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { defaultLocale, dynamicActivate } from '@/helper/i18n'
import { Layout } from './Layout'
import { getSeo } from './getSeo'
import type { PageContext } from './types'

const passToClient = ['pageProps', 'documentProps', 'someAsyncProps', 'locale']
async function render(pageContext: PageContextBuiltIn & PageContext) {
  await dynamicActivate(pageContext?.locale || defaultLocale)
  const { Page, pageProps } = pageContext
  // TODO: vite-plugin-ssr 待支持 renderToPipeableStream
  const stream = ReactDOMServer.renderToStaticNodeStream(
    <Layout pageContext={pageContext}>
      <Page {...pageProps} />
    </Layout>
  )

  const { title, description } = getSeo(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta name="description" content="${description}">
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>` as any

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
export { render }
export { passToClient }
