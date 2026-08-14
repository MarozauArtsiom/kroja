// components/ui/OptionCard.tsx
'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface OptionCardProps {
  value: string;
  title: string;
  /** Second line, e.g. "148 × 210 mm" */
  meta?: string;
  /** Third line, e.g. "+30 zł" */
  delta?: string;
  /** Optional visual: hatch preview, small diagram */
  visual?: ReactNode;
  selected: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onSelect: (value: string) => void;
}

export default function OptionCard({
  value, title, meta, delta, visual, selected, disabled, disabledReason, onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={selected ? 0 : -1}
      onClick={() => !disabled && onSelect(value)}
      className={clsx(
        'flex min-h-[44px] flex-col items-start gap-1 rounded-sm border p-3 text-left',
        'transition-colors duration-150',
        selected ? 'border-ink bg-paper-2' : 'border-line hover:border-ink-soft',
        disabled && 'cursor-not-allowed opacity-40 hover:border-line',
      )}
    >
      {visual && <span className="mb-1 block w-full">{visual}</span>}
      <span className="text-sm font-medium text-ink">{title}</span>
      {meta && <span className="text-xs text-muted">{meta}</span>}
      {delta && <span className="text-xs text-accent">{delta}</span>}
      {disabled && disabledReason && (
        <span className="text-xs text-muted">{disabledReason}</span>
      )}
    </button>
  );
}
