// content/i18n/index.ts
import type { SupportedLocale, Dictionary } from '@/types/i18n';
import { en } from './dict/en';
import { pl } from './dict/pl';
import { de } from './dict/de';
import { by } from './dict/by';
import { uk } from './dict/uk';
import { DEFAULT_LOCALE, isValidLocale } from './locales';

const dictionaries: Record<SupportedLocale, Dictionary> = {
  en,
  pl,
  de,
  by,
  uk,
};

export function getDictionary(locale?: string): Dictionary {
  if (locale && isValidLocale(locale)) {
    return dictionaries[locale];
  }
  return dictionaries[DEFAULT_LOCALE];
}

export * from './locales';
