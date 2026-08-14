// components/cart/CartDrawer.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { CartItem } from '@/types/config';
import { sizes } from '@/content/sizes';
import { leathers } from '@/content/leathers';
import { colors } from '@/content/colors';
import { threads } from '@/content/threads';
import { cords } from '@/content/cords';
import { insertNames } from '@/content/pricing';
import { copy } from '@/content/copy';
import { formatPrice } from '@/lib/format';
import { configToQueryString } from '@/lib/config-url';
import { useCartStore } from '@/store/cart';
import SchematicCover from '@/components/schematic/SchematicCover';
import ReserveBlock from './ReserveBlock';

function ItemRow({ item }: { item: CartItem }) {
  const c = item.config;
  const removeItem = useCartStore((s) => s.removeItem);

  const lines = [
    `${sizes[c.size].name} · ${leathers[c.leather].name} · ${colors[c.color].name}`,
    `Thread: ${threads[c.thread].name} · Cord: ${cords[c.cord].name}`,
    c.engraving ? `Engraving: “${c.engraving.text}” (${c.engraving.position})` : null,
    c.inserts.filter((i) => i.qty > 0).length > 0
      ? `Inserts: ${c.inserts.filter((i) => i.qty > 0).map((i) => `${i.qty} × ${insertNames[i.type]}`).join(', ')}`
      : null,
    c.giftBox ? 'Gift box included' : null,
    `Ready in ${c.productionDays} working days`,
  ].filter(Boolean) as string[];

  return (
    <li className="flex gap-4 border-b border-line py-5">
      <div className="w-20 shrink-0">
        <SchematicCover config={c} angle="front" compact />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-ink">
            {sizes[c.size].name}
            {item.qty > 1 && <span className="ml-2 text-muted">× {item.qty}</span>}
          </p>
          <p className="shrink-0 text-sm text-ink">{formatPrice(c.totalMinor * item.qty)}</p>
        </div>

        <ul className="space-y-0.5 text-xs text-muted">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <div className="mt-2 flex gap-3 text-xs">
          <Link
            href={`/configurator${configToQueryString(c)}`}
            className="text-accent underline underline-offset-2"
          >
            {copy.cart.edit}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-muted underline underline-offset-2"
          >
            {copy.cart.remove}
          </button>
        </div>
      </div>
    </li>
  );
}

export default function CartDrawer() {
  const { items, isOpen, close, totalMinor } = useCartStore();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={close} aria-hidden />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={copy.cart.title}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-xl">{copy.cart.title}</h2>
          <button type="button" onClick={close} aria-label="Close" className="h-11 w-11 text-2xl leading-none">
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="py-10 text-sm text-muted">{copy.cart.empty}</p>
          ) : (
            <ul>
              {items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-line px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted">{copy.cart.total}</span>
              <span className="text-lg font-medium text-ink">{formatPrice(totalMinor())}</span>
            </div>
            <ReserveBlock />
          </footer>
        )}
      </aside>
    </div>
  );
}
