import React, { useEffect } from 'react'
import { defaultLocale, dynamicActivate } from '@/helper/i18n'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import { PageContextProvider } from './usePageContext'
import '../style/layout.css'
import type { PageContext } from './types'
import { Link } from './Link'

export { Layout }

function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.8em',
        borderRight: '2px solid #eee',
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="page-content"
      style={{
        padding: 20,
        paddingBottom: 50,
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    ></div>
  )
}

function Layout({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
  useEffect(() => {
    // With this method we dynamically load the catalogs
    dynamicActivate(pageContext?.locale || defaultLocale)
  }, [pageContext?.locale])
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <I18nProvider i18n={i18n}>
          <Navbar>
            <Sidebar>
              <Logo />
              <Link href="/">Welcome</Link>
              <Link href="/star-wars/movie">movie</Link>
              <Link href="/star-wars">Data Fetching</Link>
              <Link href="/hello/alice">Routing</Link>
            </Sidebar>
            <Content>{children}</Content>
          </Navbar>
        </I18nProvider>
      </PageContextProvider>
    </React.StrictMode>
  )
}
