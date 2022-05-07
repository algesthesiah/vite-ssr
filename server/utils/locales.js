const locales = ['en-US', 'zh-CN']
const localeDefault = locales[0]
const regUrl = /-.*/g
function extractLocale(url) {
  const urlPaths = url.split('/')

  let locale
  let urlWithoutLocale
  // We remove the URL locale, for example `/en-US/about` => `/about`
  const firstPath = urlPaths[1]
  // eslint-disable-next-line @typescript-eslint/no-shadow
  if (locales.filter(locale => locale !== localeDefault).includes(firstPath)) {
    locale = firstPath
    urlWithoutLocale = `/${urlPaths.slice(2).join('/')}`
  } else {
    locale = localeDefault
    urlWithoutLocale = url
  }
  locale = locale.replace(regUrl, '')

  return { locale, urlWithoutLocale }
}
module.exports = {
  extractLocale,
}
