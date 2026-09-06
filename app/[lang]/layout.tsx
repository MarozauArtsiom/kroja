// app/[lang]/layout.tsx
import type { Metadata } from 'next';
import { I18nProvider } from '@/components/i18n/I18nProvider';
import { SUPPORTED_LOCALES, isValidLocale, getDictionary } from '@/content/i18n';
import type { SupportedLocale } from '@/types/i18n';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    description: dict.meta.siteDescription,
    openGraph: {
      description: dict.meta.ogDescription,
      locale: lang,
    },
  };
}

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
