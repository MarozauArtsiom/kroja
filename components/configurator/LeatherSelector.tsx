// components/configurator/LeatherSelector.tsx
'use client';

import type { Configuration, LeatherCode } from '@/types/config';
import { leatherList } from '@/content/leathers';
import { copy } from '@/content/copy';
import { formatDelta, formatThickness } from '@/lib/format';
import { getLeatherState } from '@/lib/availability';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import HatchDefs, { hatchUrl } from '@/components/schematic/HatchDefs';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

/** Small hatch preview so the leather cards are visually distinct */
function HatchChip({ pattern }: { pattern: Parameters<typeof hatchUrl>[0] }) {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-full">
      <HatchDefs />
      <rect x="0" y="0" width="60" height="24" fill={hatchUrl(pattern)} stroke="#DED5C7" strokeWidth="0.8" />
    </svg>
  );
}

export default function LeatherSelector({ config, onChange }: Props) {
  return (
    <section>
      <h2 className="label mb-3">{copy.configurator.steps.leather}</h2>
      <OptionCardGroup
        label="Leather"
        columns="grid-cols-1 sm:grid-cols-3"
        value={config.leather}
        onChange={(v) => onChange({ leather: v as LeatherCode })}
        items={leatherList.map((l) => {
          const state = getLeatherState(l.code, config.size);
          const disabled = state.kind !== 'available';
          return {
            value: l.code,
            title: l.name,
            meta: `${formatThickness(l.thicknessMm)} · ${l.character}`,
            delta: formatDelta(l.priceDeltaMinor),
            visual: <HatchChip pattern={l.schematicHatch} />,
            disabled,
            disabledReason: disabled ? state.reason : undefined,
          };
        })}
      />
    </section>
  );
}
