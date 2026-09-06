// app/[lang]/not-found.tsx
'use client';

import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { useI18n } from '@/components/i18n/I18nProvider';

export default function LocalizedNotFound() {
  const { dict, getLocalizedPath } = useI18n();

  return (
    <>
      <Header />
      <main className="container-content flex min-h-[50vh] flex-col items-start justify-center py-16">
        <h1 className="mb-4">{dict.notFound.title}</h1>
        <p className="mb-8 text-ink-soft">{dict.notFound.body}</p>
        <Link
          href={getLocalizedPath('/')}
          className="inline-flex h-11 items-center rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          {dict.notFound.back}
        </Link>
      </main>
      <Footer />
    </>
  );
}
