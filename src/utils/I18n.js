// Small i18n helpers shared by the components.

/**
 * Fills {placeholders} in a translated string:
 *   interpolate(t('validation.amount_min'), { min: '0.01' })  ->  "Amount must be at least 0.01 DZD."
 * Works whether or not t() already supports parameters (unknown placeholders are left untouched).
 */
export const interpolate = (text, vars = {}) =>
  String(text ?? '').replace(/\{(\w+)\}/g, (match, key) => (vars[key] ?? match));

/** BCP-47 locale used for dates/times for each UI language. */
export const localeFor = (language) =>
  ({ en: 'en-GB', fr: 'fr-DZ', ar: 'ar-DZ' }[language] || undefined);