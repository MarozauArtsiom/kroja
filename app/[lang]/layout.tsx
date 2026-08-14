// app/[lang]/layout.tsx
import { I18nProvider } from '@/components/i18n/I18nProvider';
import { SUPPORTED_LOCALES, isValidLocale } from '@/content/i18n';
import type { SupportedLocale } from '@/types/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    notFound();
  }

  return <I18nProvider locale={lang as SupportedLocale}>{children}</I18nProvider>;
}
