// components/configurator/StickyBar.tsx
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { PricedConfiguration } from '@/types/config';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatPrice } from '@/lib/format';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';
import EmbossingConfirmModal from './EmbossingConfirmModal';

export default function StickyBar({ priced }: { priced: PricedConfiguration }) {
  const { dict } = useI18n();
  const [highlight, setHighlight] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    setHighlight(true);
    const timer = setTimeout(() => setHighlight(false), 600);
    return () => clearTimeout(timer);
  }, [priced.totalMinor]);

  const hasEmbossing = !!priced.embossing && priced.embossing.text.trim().length > 0;

  function handleAdd() {
    if (hasEmbossing) {
      setConfirmOpen(true);
      return;
    }
    addItem(priced);
    openCart();
  }

  function confirmAdd() {
    setConfirmOpen(false);
    addItem(priced);
    openCart();
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur">
        <div className="container-content flex h-[72px] items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)]">
          <div className="min-w-0">
            <p
              className={clsx(
                'text-lg font-medium transition-colors duration-300',
                highlight ? 'text-accent' : 'text-ink',
              )}
              aria-live="polite"
            >
              {formatPrice(priced.totalMinor)}
            </p>
            <p className="text-xs text-muted">
              {priced.stock === 'made_to_order' && `${dict.configurator.madeToOrder} · `}
              {dict.options.readyIn} {priced.productionDays} {dict.options.workingDays}
            </p>
          </div>

          <Button size="lg" onClick={handleAdd} className="shrink-0 !px-5 sm:!px-8">
            {dict.configurator.addToCart}
          </Button>
        </div>
      </div>

      <EmbossingConfirmModal
        open={confirmOpen}
        text={priced.embossing?.text ?? ''}
        font={priced.embossing?.font ?? 'serif'}
        onEdit={() => setConfirmOpen(false)}
        onConfirm={confirmAdd}
      />
    </>
  );
}
