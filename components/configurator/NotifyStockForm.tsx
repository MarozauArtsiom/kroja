// components/configurator/NotifyStockForm.tsx
'use client';

import { useState } from 'react';
import type { LeatherCode, ColorCode } from '@/types/config';
import { leathers, colors } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  leather: LeatherCode;
  color: ColorCode;
  onClose: () => void;
}

export default function NotifyStockForm({ leather, color, onClose }: Props) {
  const { dict } = useI18n();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const colorName = dict.colors[color] || colors[color].name;
  const leatherName = dict.leatherNames[leather] || leathers[leather].name;

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
      title={`${colorName} (${leatherName})`}
      onClose={onClose}
      footer={
        sent ? (
          <Button onClick={onClose}>✕</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              ✕
            </Button>
            <Button onClick={submit}>{dict.configurator.notifySubmit}</Button>
          </>
        )
      }
    >
      {sent ? (
        <p>{dict.configurator.notifySuccess}</p>
      ) : (
        <>
          <p className="mb-3">{dict.configurator.notifySubtitle}</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.configurator.notifyPlaceholder}
            className="h-11 w-full rounded-sm border border-line bg-paper px-3 text-base"
          />
        </>
      )}
    </Modal>
  );
}
