// components/i18n/I18nProvider.tsx
'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { SupportedLocale, Dictionary } from '@/types/i18n';
import { getDictionary, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/content/i18n';

interface I18nContextValue {
  locale: SupportedLocale;
  dict: Dictionary;
  switchLocale: (newLocale: SupportedLocale) => void;
  getLocalizedPath: (path: string, targetLocale?: SupportedLocale) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: SupportedLocale;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() || `/${locale}`;

  const dict = useMemo(() => getDictionary(locale), [locale]);

  const getLocalizedPath = (targetPath: string, targetLocale: SupportedLocale = locale): string => {
    // Clean targetPath of any existing locale prefix
    let cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
    for (const l of SUPPORTED_LOCALES) {
      if (cleanPath === `/${l}` || cleanPath.startsWith(`/${l}/`)) {
        cleanPath = cleanPath.slice(l.length + 1) || '/';
        break;
      }
    }
    if (cleanPath === '/') {
      return `/${targetLocale}`;
    }
    return `/${targetLocale}${cleanPath}`;
  };

  const switchLocale = (newLocale: SupportedLocale) => {
    if (newLocale === locale) return;

    // Save preference cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Compute new pathname with replaced locale prefix
    let pathWithoutLocale = pathname;
    for (const l of SUPPORTED_LOCALES) {
      if (pathWithoutLocale === `/${l}` || pathWithoutLocale.startsWith(`/${l}/`)) {
        pathWithoutLocale = pathWithoutLocale.slice(l.length + 1) || '/';
        break;
      }
    }

    const newPath = pathWithoutLocale === '/' ? `/${newLocale}` : `/${newLocale}${pathWithoutLocale}`;
    const query = typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '';
    const fullUrl = query ? `${newPath}?${query}` : newPath;

    router.push(fullUrl);
  };

  return (
    <I18nContext.Provider value={{ locale, dict, switchLocale, getLocalizedPath }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      locale: DEFAULT_LOCALE,
      dict: getDictionary(DEFAULT_LOCALE),
      switchLocale: () => {},
      getLocalizedPath: (p) => p,
    };
  }
  return ctx;
}
