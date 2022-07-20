import React from 'react'
import ReactDOMClient from 'react-dom/client'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'
import { defaultLocale, dynamicActivate } from '@/helper/i18n'
import { Layout } from './Layout'
import { getSeo } from './getSeo'
import type { PageContext } from './types'

export const clientRouting = true
export { render, onHydrationEnd }
export const prefetchStaticAssets = { when: 'VIEWPORT' }

let root: ReactDOMClient.Root

async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const { Page, pageProps } = pageContext

  const container = document.getElementById('page-view')!
  if (pageContext.isHydration) {
    await dynamicActivate(pageContext?.locale || defaultLocale)
    root = ReactDOMClient.hydrateRoot(
      container,
      <Layout pageContext={pageContext}>
        <Page {...pageProps} />
      </Layout>
    )
  } else {
    if (!root) {
      root = ReactDOMClient.createRoot(container)
    }

    const app = (
      <Layout pageContext={pageContext}>
        <Page {...pageProps} />
      </Layout>
    )
    root.render(app)
    const { title, description } = getSeo(pageContext)
    document.title = title
    document?.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }
}
function onHydrationEnd() {
  console.log('Hydration finished; page is now interactive.')
}
