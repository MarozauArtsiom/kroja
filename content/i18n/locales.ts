// content/i18n/locales.ts
import type { SupportedLocale, LocaleInfo } from '@/types/i18n';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'pl', 'de', 'by', 'uk'];
export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const LOCALE_INFOS: Record<SupportedLocale, LocaleInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flagId: 'en',
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flagId: 'pl',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flagId: 'de',
  },
  by: {
    code: 'by',
    name: 'Belarusian',
    nativeName: 'Беларуская',
    flagId: 'by',
  },
  uk: {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flagId: 'uk',
  },
};

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function normalizeLocale(locale?: string | null): SupportedLocale {
  if (!locale) return DEFAULT_LOCALE;
  const lower = locale.toLowerCase().trim();
  if (lower.startsWith('pl')) return 'pl';
  if (lower.startsWith('de')) return 'de';
  if (lower.startsWith('be') || lower.startsWith('by')) return 'by';
  if (lower.startsWith('uk') || lower.startsWith('ua')) return 'uk';
  if (lower.startsWith('en')) return 'en';
  return DEFAULT_LOCALE;
}
