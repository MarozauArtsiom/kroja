// components/configurator/EngravingConfirmModal.tsx
'use client';

import type { EngravingFont } from '@/types/config';
import { useI18n } from '@/components/i18n/I18nProvider';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  open: boolean;
  text: string;
  font: EngravingFont;
  onEdit: () => void;
  onConfirm: () => void;
}

export default function EngravingConfirmModal({
  open,
  text,
  font,
  onEdit,
  onConfirm,
}: Props) {
  const { dict } = useI18n();

  return (
    <Modal
      open={open}
      title={dict.configurator.engravingConfirmTitle}
      onClose={onEdit}
      footer={
        <>
          <Button variant="secondary" onClick={onEdit}>
            {dict.configurator.engravingConfirmEdit}
          </Button>
          <Button onClick={onConfirm}>{dict.configurator.engravingConfirmOk}</Button>
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
      <p>{dict.configurator.engravingConfirmBody}</p>
    </Modal>
  );
}
