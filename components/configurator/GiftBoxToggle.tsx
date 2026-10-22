// components/configurator/GiftBoxToggle.tsx
'use client';

import clsx from 'clsx';
import type { Configuration } from '@/types/config';
import { GIFT_BOX_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

/** Packaging, not an insert: its own line at the very end, right before the price bar. */
export default function GiftBoxToggle({ config, onChange }: Props) {
  const { dict } = useI18n();
  const on = config.giftBox;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange({ giftBox: !on })}
      className={clsx(
        'flex min-h-14 w-full items-center gap-3 rounded-sm border p-3 text-left transition-colors duration-150',
        on ? 'border-ink bg-paper-2' : 'border-line hover:border-ink-soft',
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-ink">{dict.configurator.giftBoxLabel}</span>
        <span className="block text-xs text-accent">{formatDelta(GIFT_BOX_MINOR)}</span>
      </span>
      <span
        aria-hidden
        className={clsx(
          'relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-150',
          on ? 'border-accent bg-accent' : 'border-line bg-paper',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-4 w-4 rounded-full bg-paper shadow transition-[left] duration-150',
            on ? 'left-5' : 'left-0.5',
          )}
        />
      </span>
    </button>
  );
}
