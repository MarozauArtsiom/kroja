// components/configurator/NotifyStockForm.tsx
'use client';

import { useState } from 'react';
import type { LeatherCode, ColorCode } from '@/types/config';
import { leathers } from '@/content/leathers';
import { colors } from '@/content/colors';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  leather: LeatherCode;
  color: ColorCode;
  onClose: () => void;
}

export default function NotifyStockForm({ leather, color, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!email.includes('@')) return;
    await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'stock-notify', email, leather, color }),
    }).catch(() => {});
    setSent(true);
  }

  return (
    <Modal
      open
      title={`${colors[color].name} in ${leathers[leather].name}`}
      onClose={onClose}
      footer={
        sent ? (
          <Button onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={submit}>Notify me</Button>
          </>
        )
      }
    >
      {sent ? (
        <p>We will write to you as soon as this combination is back.</p>
      ) : (
        <>
          <p className="mb-3">
            This combination is out of stock. Leave your email and we will tell you when it is
            back.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="h-11 w-full rounded-sm border border-line bg-paper px-3 text-base"
          />
        </>
      )}
    </Modal>
  );
}
