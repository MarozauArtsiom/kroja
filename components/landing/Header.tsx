// components/landing/Header.tsx
'use client';

import Link from 'next/link';
import { copy } from '@/content/copy';
import CartButton from '@/components/cart/CartButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl tracking-wide text-ink">
          {copy.brand.name}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
          <a href="#leather" className="hover:text-ink">{copy.nav.materials}</a>
          <a href="#craft" className="hover:text-ink">{copy.nav.craft}</a>
          <a href="#faq" className="hover:text-ink">{copy.nav.faq}</a>
          <Link href="/shotlist" className="hover:text-ink">{copy.nav.shotlist}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <CartButton />
          <Link
            href="/configurator"
            className="inline-flex h-11 items-center rounded-sm bg-accent px-5 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
          >
            {copy.nav.build}
          </Link>
        </div>
      </div>
    </header>
  );
}
