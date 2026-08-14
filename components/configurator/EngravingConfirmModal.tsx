// components/configurator/EngravingConfirmModal.tsx
'use client';

import type { EngravingFont } from '@/types/config';
import { copy } from '@/content/copy';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  open: boolean;
  text: string;
  font: EngravingFont;
  onEdit: () => void;
  onConfirm: () => void;
}

export default function EngravingConfirmModal({ open, text, font, onEdit, onConfirm }: Props) {
  return (
    <Modal
      open={open}
      title={copy.cart.engravingConfirmTitle}
      onClose={onEdit}
      footer={
        <>
          <Button variant="secondary" onClick={onEdit}>
            {copy.cart.engravingConfirmEdit}
          </Button>
          <Button onClick={onConfirm}>{copy.cart.engravingConfirmOk}</Button>
        </>
      }
    >
      <p
        className={`mb-4 border border-line bg-paper-2 p-6 text-center text-2xl text-ink ${
          font === 'serif' ? 'font-display' : 'font-sans'
        }`}
      >
        {text}
      </p>
      <p>{copy.cart.engravingConfirmBody}</p>
    </Modal>
  );
}
