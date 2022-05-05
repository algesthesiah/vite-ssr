export { extractLocale }
export { locales }
export { localeDefault }

const locales = ['en-US', 'de-DE', 'fr-FR']
const localeDefault = locales[0]

function extractLocale(url) {
  const urlPaths = url.split('/')

  let locale
  let urlWithoutLocale
  // We remove the URL locale, for example `/de-DE/about` => `/about`
  const firstPath = urlPaths[1]
  // eslint-disable-next-line @typescript-eslint/no-shadow
  if (locales.filter(locale => locale !== localeDefault).includes(firstPath)) {
    locale = firstPath
    urlWithoutLocale = `/${urlPaths.slice(2).join('/')}`
  } else {
    locale = localeDefault
    urlWithoutLocale = url
  }

  return { locale, urlWithoutLocale }
}
