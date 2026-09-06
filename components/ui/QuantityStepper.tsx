// components/ui/QuantityStepper.tsx
'use client';

import { useI18n } from '@/components/i18n/I18nProvider';
import { fill } from '@/lib/format';

interface Props {
  value: number;
  /** Highest value the plus button may reach. */
  max: number;
  /** Lowest value the minus button may reach. Defaults to 0. */
  min?: number;
  /** Localised name of what is being counted. Goes into the button labels. */
  name: string;
  onChange: (next: number) => void;
}

export default function QuantityStepper({ value, max, min = 0, name, onChange }: Props) {
  const { dict } = useI18n();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={fill(dict.configurator.removeOne, { name })}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
      >
        −
      </button>
      <span className="w-8 text-center font-mono text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={fill(dict.configurator.addOne, { name })}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
