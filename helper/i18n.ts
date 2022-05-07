import { i18n } from '@lingui/core'
import { en, zh } from 'make-plural/plurals'

export const locales = {
  en: 'English',
  zh: '中文',
}
export const defaultLocale = 'en'
// i18n.load(defaultLocale, {})
// i18n.activate(defaultLocale)
i18n.loadLocaleData({
  en: { plurals: en },
  zh: { plurals: zh },
})

/**
 * We do a dynamic import of just the catalog that we need
 * @param locale any locale string
 */
export async function dynamicActivate(locale: string) {
  const { messages } = await import(`../locales/${locale}/messages.ts`)
  i18n.load(locale, messages)
  i18n.activate(locale)
}
