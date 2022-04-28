import React from 'react'
import ReactDOMClient from 'react-dom/client'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'
import { PageShell } from './PageShell'
import getSeo from './getSeo'
import type { PageContext } from './types'

let root: ReactDOMClient.Root
function onTransitionStart() {
  // console.log('Page transition start')
  // document.querySelector('#page-content')!.classList.add('page-transition')
}
function onTransitionEnd() {
  // console.log('Page transition end')
  // document.querySelector('#page-content')!.classList.remove('page-transition')
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const { hydrationPromise } = useClientRouter({
  render(pageContext: PageContextBuiltInClient & PageContext) {
    const { Page, pageProps } = pageContext
    const page = (
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} />
      </PageShell>
    )
    const container = document.getElementById('page-view')!
    if (pageContext.isHydration) {
      root = ReactDOMClient.hydrateRoot(container, page)
    } else {
      if (!root) {
        root = ReactDOMClient.createRoot(container)
      }
      root.render(page)
    }
    const { title, description } = getSeo(pageContext)
    document.title = title
    document
      .querySelector('meta[name="description"]')
      .setAttribute('content', description)
  },
  // onTransitionStart,
  // onTransitionEnd,
})

hydrationPromise.then(() => {
  console.log('Hydration finished; page is now interactive.')
})
