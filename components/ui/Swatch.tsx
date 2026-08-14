// components/ui/Swatch.tsx
'use client';

import clsx from 'clsx';

export interface SwatchProps {
  value: string;
  label: string;
  hex: string;
  selected: boolean;
  /** 'available' | 'made-to-order' | 'disabled' */
  state: 'available' | 'made-to-order' | 'disabled';
  /** Shown under the label when state is 'disabled' or 'made-to-order' */
  note?: string;
  onSelect: (value: string) => void;
}

export default function Swatch({
  value, label, hex, selected, state, note, onSelect,
}: SwatchProps) {
  const disabled = state === 'disabled';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      // Disabled swatches stay focusable so screen readers can announce the reason.
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(value)}
      className={clsx(
        'group flex w-[72px] flex-col items-center gap-1.5 rounded-sm p-1',
        'transition-opacity duration-150',
        disabled && 'opacity-40',
      )}
      title={note ?? label}
    >
      <span
        className={clsx(
          'relative block h-11 w-11 rounded-full border transition-all duration-150',
          selected ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'border-line',
          !disabled && !selected && 'group-hover:border-ink',
        )}
        style={{ backgroundColor: hex }}
      >
        {disabled && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(250,247,242,.85) 3px, rgba(250,247,242,.85) 5px)',
            }}
          />
        )}
      </span>

      <span className="text-center text-[11px] leading-tight text-ink-soft">{label}</span>

      {state === 'made-to-order' && (
        <span className="text-center text-[10px] leading-tight text-muted">Made to order</span>
      )}
      {disabled && note && (
        <span className="text-center text-[10px] leading-tight text-muted">{note}</span>
      )}
    </button>
  );
}
