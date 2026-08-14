// components/landing/Hero.tsx
import Link from 'next/link';
import { copy } from '@/lib/data';
import Illustration from './Illustration';

export default function Hero() {
  return (
    <section className="container-content pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="mb-5">{copy.hero.title}</h1>
          <p className="mb-8 max-w-prose text-lg text-ink-soft">{copy.hero.subtitle}</p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/configurator"
              className="inline-flex h-14 items-center rounded-sm bg-accent px-8 text-base font-medium text-paper transition-colors hover:bg-accent-dark"
            >
              {copy.hero.cta}
            </Link>
            <a
              href="#leather"
              className="inline-flex h-14 items-center px-4 text-base text-ink underline underline-offset-4"
            >
              {copy.hero.ctaSecondary}
            </a>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.1em] text-muted">{copy.hero.trust}</p>
        </div>

        <div className="rounded-sm border border-line bg-paper-2 p-6 md:p-8">
          <Illustration name="hero" priority />
        </div>
      </div>
    </section>
  );
}
