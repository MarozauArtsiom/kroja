// components/landing/FinalCta.tsx
'use client';

import Link from 'next/link';
import { useI18n } from '@/components/i18n/I18nProvider';

export default function FinalCta() {
  const { dict, getLocalizedPath } = useI18n();

  return (
    <section className="section bg-paper-2">
      <div className="container-content max-w-2xl text-center">
        <h2 className="mb-4">{dict.finalCta.title}</h2>
        <p className="mb-8 text-lg text-ink-soft">{dict.finalCta.body}</p>
        <Link
          href={getLocalizedPath('/configurator')}
          className="inline-flex h-14 items-center rounded-sm bg-accent px-8 text-base font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          {dict.finalCta.cta}
        </Link>
      </div>
    </section>
  );
}
