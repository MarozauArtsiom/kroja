// components/configurator/CardSlotsSelector.tsx
'use client';

import type { Configuration } from '@/types/config';
import { sizes, CARD_SLOTS_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill, formatDelta } from '@/lib/format';
import QuantityStepper from '@/components/ui/QuantityStepper';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function CardSlotsSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const max = sizes[config.size].cardSlotsMax;
  const count = config.cardSlots;
  const name = dict.configurator.steps.cardSlots;

  return (
    <section>
      <h2 className="label mb-1">
        {name}
        <span className="ml-2 normal-case tracking-normal text-accent">
          {formatDelta(CARD_SLOTS_MINOR)}
        </span>
      </h2>
      <p className="text-xs text-muted">{fill(dict.configurator.cardSlotsHint, { max, count })}</p>
      <p className="mb-3 text-xs text-muted">{dict.configurator.cardSlotsMeta}</p>

      <div className="flex items-center justify-between rounded-sm border border-line p-3">
        <span className="text-sm text-ink">{dict.configurator.cardSlotsInside}</span>
        <QuantityStepper
          value={count}
          max={max}
          name={name}
          onChange={(next) => onChange({ cardSlots: next })}
        />
      </div>
    </section>
  );
}
