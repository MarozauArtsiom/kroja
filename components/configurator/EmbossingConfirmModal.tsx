// components/configurator/EmbossingConfirmModal.tsx
'use client';

import type { EmbossingFont } from '@/types/config';
import { useI18n } from '@/components/i18n/I18nProvider';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  open: boolean;
  text: string;
  font: EmbossingFont;
  onEdit: () => void;
  onConfirm: () => void;
}

export default function EmbossingConfirmModal({ open, text, font, onEdit, onConfirm }: Props) {
  const { dict } = useI18n();

  return (
    <Modal
      open={open}
      title={dict.configurator.embossingConfirmTitle}
      onClose={onEdit}
      footer={
        <>
          <Button variant="secondary" onClick={onEdit}>
            {dict.configurator.embossingConfirmEdit}
          </Button>
          <Button onClick={onConfirm}>{dict.configurator.embossingConfirmOk}</Button>
        </>
      }
    >
      <p
        className={`mb-4 border border-line bg-paper-2 p-6 text-center text-4xl tracking-[0.3em] text-ink ${
          font === 'serif' ? 'font-display' : 'font-sans'
        }`}
      >
        {text}
      </p>
      <p>{dict.configurator.embossingConfirmBody}</p>
    </Modal>
  );
}
