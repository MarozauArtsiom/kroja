// components/cart/ReserveBlock.tsx
'use client';

import { useState } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/Button';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function ReserveBlock() {
  const { dict } = useI18n();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const items = useCartStore((s) => s.items);
  const totalMinor = useCartStore((s) => s.totalMinor);

  async function submit() {
    if (!email.includes('@') || email.length < 5) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'reservation',
          email,
          cart: items.map((i) => ({ config: i.config, qty: i.qty })),
          cartTotalMinor: totalMinor(),
          ts: Date.now(),
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-sm border border-line bg-paper-2 p-4 text-sm text-ink">
        <p className="font-medium text-ink">{dict.cart.reserveSuccess}</p>
        <p className="mt-1 text-xs text-ink-soft">{dict.cart.reserveSuccessBody}</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-paper-2 p-4">
      <p className="mb-1 text-sm font-medium text-ink">{dict.cart.reserveTitle}</p>
      <p className="mb-3 text-xs leading-relaxed text-ink-soft">{dict.cart.reserveBody}</p>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.cart.reserveEmailPlaceholder}
          aria-label={dict.a11y.emailField}
          className="h-11 min-w-0 flex-1 rounded-sm border border-line bg-paper px-3 text-base"
        />
        <Button onClick={submit} disabled={status === 'sending'}>
          {dict.cart.reserveSubmit}
        </Button>
      </div>

      {status === 'error' && (
        <p className="mt-2 text-xs text-alert">{dict.cart.reserveError}</p>
      )}
    </div>
  );
}
