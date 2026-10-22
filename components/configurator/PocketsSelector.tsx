// components/configurator/PocketsSelector.tsx
'use client';

import clsx from 'clsx';
import type { Configuration, Flap, Pocket, PocketKind } from '@/types/config';
import { pockets as pocketDefs, pocketList } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill } from '@/lib/format';
import {
  FLAPS,
  canAddPocket,
  canMovePocket,
  pocketBudgetMm,
  stackHeightMm,
} from '@/lib/pockets';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const ICON_BUTTON =
  'h-11 w-11 shrink-0 rounded-sm border border-line text-sm text-ink transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line';

/** One flap: a budget bar, the stack drawn top to bottom as on the cover, and add buttons. */
function FlapEditor({
  flap,
  config,
  onStackChange,
}: {
  flap: Flap;
  config: Configuration;
  onStackChange: (stack: Pocket[]) => void;
}) {
  const { dict } = useI18n();
  const stack = config.pockets[flap];
  const used = stackHeightMm(stack);
  const budget = pocketBudgetMm(config.size);
  const mm = dict.units.mm;

  function move(index: number, direction: 'up' | 'down') {
    const target = direction === 'up' ? index + 1 : index - 1;
    const next = [...stack];
    [next[index], next[target]] = [next[target], next[index]];
    onStackChange(next);
  }

  function toggleDivided(index: number) {
    onStackChange(stack.map((p, i) => (i === index ? { ...p, divided: !p.divided } : p)));
  }

  function remove(index: number) {
    onStackChange(stack.filter((_, i) => i !== index));
  }

  function add(kind: PocketKind) {
    onStackChange([...stack, { kind, divided: false }]);
  }

  // The list reads like the cover: the topmost pocket first.
  const rows = stack.map((pocket, index) => ({ pocket, index })).reverse();

  return (
    <div className="rounded-sm border border-line p-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-medium text-ink">{dict.options.flaps[flap]}</h4>
        <span className="font-mono text-[11px] text-muted">
          {fill(dict.configurator.pocketsBudget, { used, budget })}
        </span>
      </div>
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full bg-ink transition-[width] duration-150"
          style={{ width: `${Math.min(100, (used / budget) * 100)}%` }}
        />
      </div>

      {rows.length === 0 ? (
        <p className="mb-4 text-xs text-muted">{dict.configurator.pocketsEmpty}</p>
      ) : (
        <div className="mb-4">
          <p className="label mb-1">{dict.configurator.pocketsTop}</p>
          <ul className="space-y-2">
            {rows.map(({ pocket, index }) => {
              const def = pocketDefs[pocket.kind];
              const copy = dict.options.pockets[pocket.kind];
              return (
                <li key={`${index}-${pocket.kind}`} className="rounded-sm bg-paper-2 p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm text-ink">{copy.title}</p>
                    <span className="shrink-0 font-mono text-[11px] text-muted">
                      {def.heightMm} {mm}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{copy.meta}</p>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    {def.canDivide ? (
                      <label className="flex min-h-11 cursor-pointer items-center gap-2 pr-2 text-xs text-ink-soft">
                        <input
                          type="checkbox"
                          checked={pocket.divided}
                          onChange={() => toggleDivided(index)}
                          className="h-5 w-5 accent-[#8B4A2B]"
                        />
                        {dict.configurator.pocketsDivide}
                      </label>
                    ) : (
                      <span />
                    )}

                    <div className="flex gap-1">
                      <button
                        type="button"
                        className={ICON_BUTTON}
                        disabled={!canMovePocket(stack, index, 'up')}
                        onClick={() => move(index, 'up')}
                        aria-label={fill(dict.configurator.pocketsMoveUp, { name: copy.title })}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={ICON_BUTTON}
                        disabled={!canMovePocket(stack, index, 'down')}
                        onClick={() => move(index, 'down')}
                        aria-label={fill(dict.configurator.pocketsMoveDown, { name: copy.title })}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className={ICON_BUTTON}
                        onClick={() => remove(index)}
                        aria-label={fill(dict.configurator.pocketsRemove, { name: copy.title })}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="label mt-1">{dict.configurator.pocketsBottom}</p>
        </div>
      )}

      <p className="label mb-2">{dict.configurator.pocketsAdd}</p>
      <div className="grid grid-cols-2 gap-2">
        {pocketList.map((def) => {
          const allowed = canAddPocket(stack, def.code, config.size);
          return (
            <button
              key={def.code}
              type="button"
              disabled={!allowed}
              onClick={() => add(def.code)}
              className={clsx(
                'flex min-h-[44px] flex-col items-start rounded-sm border px-3 py-2 text-left transition-colors',
                'border-line hover:border-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line',
              )}
            >
              <span className="text-sm leading-snug text-ink">+ {dict.options.pockets[def.code].title}</span>
              <span className="font-mono text-[11px] text-muted">
                {def.heightMm} {mm}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PocketsSelector({ config, onChange }: Props) {
  const { dict } = useI18n();

  return (
    <div>
      <p className="mb-4 text-xs leading-relaxed text-muted">{dict.configurator.pocketsHint}</p>

      <div className="space-y-4">
        {FLAPS.map((flap) => (
          <FlapEditor
            key={flap}
            flap={flap}
            config={config}
            onStackChange={(stack) => onChange({ pockets: { ...config.pockets, [flap]: stack } })}
          />
        ))}
      </div>
    </div>
  );
}
