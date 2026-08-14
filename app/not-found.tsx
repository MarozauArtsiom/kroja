import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-content flex min-h-[50vh] flex-col items-start justify-center py-16">
        <h1 className="mb-4">This page does not exist</h1>
        <p className="mb-8 text-ink-soft">
          It may have moved, or the link may be wrong.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          Back to the start
        </Link>
      </main>
      <Footer />
    </>
  );
}
