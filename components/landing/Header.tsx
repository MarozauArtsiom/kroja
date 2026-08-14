// components/landing/Header.tsx
'use client';

import Link from 'next/link';
import { useI18n } from '@/components/i18n/I18nProvider';
import CartButton from '@/components/cart/CartButton';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const { dict, getLocalizedPath } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <Link href={getLocalizedPath('/')} className="font-display text-xl tracking-wide text-ink">
          {dict.brand.name}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
          <Link href={getLocalizedPath('/#leather')} className="hover:text-ink">
            {dict.nav.materials}
          </Link>
          <Link href={getLocalizedPath('/#craft')} className="hover:text-ink">
            {dict.nav.craft}
          </Link>
          <Link href={getLocalizedPath('/#faq')} className="hover:text-ink">
            {dict.nav.faq}
          </Link>
          <Link href={getLocalizedPath('/shotlist')} className="hover:text-ink">
            {dict.nav.shotlist}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <CartButton />
          <Link
            href={getLocalizedPath('/configurator')}
            className="inline-flex h-10 items-center rounded-sm bg-accent px-4 text-xs sm:text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
          >
            {dict.nav.build}
          </Link>
        </div>
      </div>
    </header>
  );
}
