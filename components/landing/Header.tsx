// components/landing/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useI18n } from '@/components/i18n/I18nProvider';
import CartButton from '@/components/cart/CartButton';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const { dict, getLocalizedPath } = useI18n();
  const pathname = usePathname();
  // The configurator has its own pinned preview below lg and its own add-to-cart bar,
  // so the header scrolls away there and drops the "build" call to action.
  const onConfigurator = pathname.endsWith('/configurator');

  return (
    <header
      className={clsx(
        'top-0 z-30 border-b border-line bg-paper/95 backdrop-blur',
        onConfigurator ? 'relative lg:sticky' : 'sticky',
      )}
    >
      <div className="container-content flex h-16 items-center justify-between gap-2 sm:gap-4">
        <Link href={getLocalizedPath('/')} className="whitespace-nowrap font-display text-lg text-ink sm:text-xl sm:tracking-wide">
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

        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageSwitcher />
          <CartButton />
          {!onConfigurator && (
            <Link
              href={getLocalizedPath('/configurator')}
              className="inline-flex h-10 items-center rounded-sm bg-accent px-3 text-center text-xs font-medium leading-tight text-paper transition-colors hover:bg-accent-dark sm:whitespace-nowrap sm:px-4 sm:text-sm"
            >
              {dict.nav.build}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
