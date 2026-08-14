// components/configurator/InsertsSelector.tsx
'use client';

import type { Configuration, InsertType } from '@/types/config';
import { sizes } from '@/content/sizes';
import { copy } from '@/content/copy';
import { insertNames, insertPriceMinor, GIFT_BOX_MINOR } from '@/content/pricing';
import { formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const TYPES: InsertType[] = ['plain', 'ruled', 'dot'];

export default function InsertsSelector({ config, onChange }: Props) {
  const capacity = sizes[config.size].insertCapacity;
  const totalQty = config.inserts.reduce((s, i) => s + i.qty, 0);

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
        <h2 className="label mb-1">{copy.configurator.steps.inserts}</h2>
        <p className="mb-3 text-xs text-muted">
          Up to {capacity} in this size. {totalQty} selected.
        </p>

        <div className="space-y-2">
          {TYPES.map((type) => {
            const current = config.inserts.find((i) => i.type === type)?.qty ?? 0;
            const canAdd = totalQty < capacity;
            return (
              <div
                key={type}
                className="flex items-center justify-between rounded-sm border border-line p-3"
              >
                <div>
                  <span className="text-sm text-ink">{insertNames[type]}</span>
                  <span className="ml-2 text-xs text-accent">
                    {formatDelta(insertPriceMinor[type])} each
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Remove one ${insertNames[type]} insert`}
                    disabled={current === 0}
                    onClick={() => setQty(type, current - 1)}
                    className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-sm" aria-live="polite">
                    {current}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add one ${insertNames[type]} insert`}
                    disabled={!canAdd}
                    onClick={() => setQty(type, current + 1)}
                    className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-sm border border-line p-3">
        <span className="text-sm text-ink">
          {copy.configurator.giftBoxLabel}
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
