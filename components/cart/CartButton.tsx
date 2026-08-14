// components/cart/CartButton.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useI18n } from '@/components/i18n/I18nProvider';

export default function CartButton() {
  const { dict } = useI18n();
  const [mounted, setMounted] = useState(false);
  const open = useCartStore((s) => s.open);
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  // Avoid hydration mismatch: localStorage is only available on the client.
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`${dict.nav.cart}${mounted && count > 0 ? `, ${count}` : ''}`}
      className="flex h-11 items-center gap-1.5 px-2 text-sm text-ink"
    >
      {dict.nav.cart}
      {mounted && count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] text-paper">
          {count}
        </span>
      )}
    </button>
  );
}
