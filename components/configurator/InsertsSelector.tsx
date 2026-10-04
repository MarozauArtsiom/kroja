// components/configurator/InsertsSelector.tsx
'use client';

import type { Configuration, InsertType } from '@/types/config';
import { sizes, insertPriceMinor, GIFT_BOX_MINOR, INCLUDED_INSERTS } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill, formatDelta, formatPrice } from '@/lib/format';
import QuantityStepper from '@/components/ui/QuantityStepper';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const TYPES: InsertType[] = ['plain', 'ruled', 'dot'];

export default function InsertsSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const capacity = sizes[config.size].insertCapacity;
  const totalQty = config.inserts.reduce((s, i) => s + i.qty, 0);
  // Every extra insert costs the same; the included one is free whatever its type.
  const extraPrice = Math.min(...TYPES.map((t) => insertPriceMinor[t]));

  function setQty(type: InsertType, qty: number) {
    const others = config.inserts.filter((i) => i.type !== type);
    const othersTotal = others.reduce((s, i) => s + i.qty, 0);
    const clamped = Math.max(0, Math.min(qty, capacity - othersTotal));
    const next = clamped > 0 ? [...others, { type, qty: clamped }] : others;
    onChange({ inserts: next });
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="label mb-1">{dict.configurator.steps.inserts}</h2>
        <p className="text-xs text-muted">
          {fill(dict.configurator.insertsHint, { max: capacity, count: totalQty })}
        </p>
        <p className="mb-3 text-xs text-ink-soft">
          {fill(dict.configurator.insertsIncluded, { price: formatPrice(extraPrice) })}
        </p>

        <div className="space-y-2">
          {TYPES.map((type) => {
            const current = config.inserts.find((i) => i.type === type)?.qty ?? 0;
            const name = dict.insertTypes[type];
            // This type may grow by whatever the other types have left unused,
            // and may not take the total below the included insert.
            const maxForType = current + (capacity - totalQty);
            const minForType = Math.max(0, INCLUDED_INSERTS - (totalQty - current));
            return (
              <div
                key={type}
                className="flex items-center justify-between rounded-sm border border-line p-3"
              >
                <span className="text-sm text-ink">{name}</span>
                <QuantityStepper
                  value={current}
                  min={minForType}
                  max={maxForType}
                  name={name}
                  onChange={(next) => setQty(type, next)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-sm border border-line p-3">
        <span className="text-sm text-ink">
          {dict.configurator.giftBoxLabel}
          <span className="ml-2 text-xs text-accent">{formatDelta(GIFT_BOX_MINOR)}</span>
        </span>
        <input
          type="checkbox"
          checked={config.giftBox}
          onChange={(e) => onChange({ giftBox: e.target.checked })}
          className="h-5 w-5 accent-[#8B4A2B]"
        />
      </label>
    </section>
  );
}
