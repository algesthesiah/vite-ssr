// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
  Page: React.ReactNode
  pageExports: {
    documentProps?: {
      title: string
      description: string
    }
  }
  urlPathname: string
  pageProps: Record<string, unknown>
  documentProps?: {
    title: string
    description: string
  }
}
