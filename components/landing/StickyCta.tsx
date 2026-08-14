// components/landing/StickyCta.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useI18n } from '@/components/i18n/I18nProvider';

export default function StickyCta() {
  const { dict, getLocalizedPath } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={clsx(
        'fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 p-3 backdrop-blur transition-transform duration-200 md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <Link
        href={getLocalizedPath('/configurator')}
        className="flex h-12 w-full items-center justify-center rounded-sm bg-accent text-sm font-medium text-paper"
      >
        {dict.hero.cta}
      </Link>
    </div>
  );
}
