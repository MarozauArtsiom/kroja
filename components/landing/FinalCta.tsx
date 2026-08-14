// components/landing/FinalCta.tsx
import Link from 'next/link';
import { copy } from '@/content/copy';

export default function FinalCta() {
  return (
    <section className="section bg-paper-2">
      <div className="container-content max-w-2xl text-center">
        <h2 className="mb-4">{copy.finalCta.title}</h2>
        <p className="mb-8 text-lg text-ink-soft">{copy.finalCta.body}</p>
        <Link
          href="/configurator"
          className="inline-flex h-14 items-center rounded-sm bg-accent px-8 text-base font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          {copy.finalCta.cta}
        </Link>
      </div>
    </section>
  );
}
