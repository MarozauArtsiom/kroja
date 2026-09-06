// app/not-found.tsx
// Fallback 404 for paths outside a locale, where no dictionary is available yet.
// Localised 404 lives in app/[lang]/not-found.tsx.
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { en } from '@/content/i18n/dict/en';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-content flex min-h-[50vh] flex-col items-start justify-center py-16">
        <h1 className="mb-4">{en.notFound.title}</h1>
        <p className="mb-8 text-ink-soft">
          {en.notFound.body}
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          {en.notFound.back}
        </Link>
      </main>
      <Footer />
    </>
  );
}
