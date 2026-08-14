// components/cart/ReserveBlock.tsx
'use client';

import { useState } from 'react';
import { copy } from '@/content/copy';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/Button';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function ReserveBlock() {
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
        {copy.reserve.success}
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-paper-2 p-4">
      <p className="mb-1 text-sm font-medium text-ink">{copy.reserve.title}</p>
      <p className="mb-3 text-xs leading-relaxed text-ink-soft">{copy.reserve.body}</p>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.reserve.placeholder}
          aria-label="Email"
          className="h-11 min-w-0 flex-1 rounded-sm border border-line bg-paper px-3 text-base"
        />
        <Button onClick={submit} disabled={status === 'sending'}>
          {copy.reserve.button}
        </Button>
      </div>

      {status === 'error' && <p className="mt-2 text-xs text-alert">{copy.reserve.error}</p>}
    </div>
  );
}
