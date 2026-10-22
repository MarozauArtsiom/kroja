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
  /** Below sm: visual on the left, text on the right. From sm up: the usual column. */
  rowOnMobile?: boolean;
  onSelect: (value: string) => void;
}

/** Where the visual sits: a 56px column on the left in a row, a full-width band in a column. */
const VISUAL_ROW = 'w-14 shrink-0 sm:mb-1 sm:w-full';
const VISUAL_COLUMN = 'mb-1 w-full';

export default function OptionCard({
  value, title, meta, delta, visual, selected, disabled, disabledReason, rowOnMobile, onSelect,
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
        'flex min-h-[44px] rounded-sm border text-left',
        rowOnMobile
          ? 'flex-row items-center gap-3 px-3 py-2 sm:flex-col sm:items-start sm:gap-1 sm:p-3'
          : 'flex-col items-start gap-1 p-3',
        'transition-colors duration-150',
        selected ? 'border-ink bg-paper-2' : 'border-line hover:border-ink-soft',
        disabled && 'cursor-not-allowed opacity-40 hover:border-line',
      )}
    >
      {visual && (
        <span className={clsx('block', rowOnMobile ? VISUAL_ROW : VISUAL_COLUMN)}>
          {visual}
        </span>
      )}
      <span className={clsx('flex min-w-0 flex-col', rowOnMobile ? 'sm:gap-1' : 'gap-1')}>
        <span className="text-sm font-medium text-ink">{title}</span>
        {meta && <span className="text-xs text-muted">{meta}</span>}
        {delta && <span className="text-xs text-accent">{delta}</span>}
        {disabled && disabledReason && (
          <span className="text-xs text-muted">{disabledReason}</span>
        )}
      </span>
    </button>
  );
}
