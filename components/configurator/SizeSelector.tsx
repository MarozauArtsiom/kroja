// components/configurator/SizeSelector.tsx
'use client';

import { useId, useState } from 'react';
import type { Configuration, SizeCode } from '@/types/config';
import { sizeList } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDimensions, formatPrice } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import SizeDiagram from '@/components/schematic/SizeDiagram';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function SizeSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const [compare, setCompare] = useState(false);
  const panelId = useId();

  return (
    <div>
      <OptionCardGroup
        label={dict.a11y.sizeGroup}
        columns="grid-cols-2"
        value={config.size}
        onChange={(v) => onChange({ size: v as SizeCode })}
        items={sizeList.map((s) => ({
          value: s.code,
          title: dict.sizes.names[s.code],
          meta: `${formatDimensions(s.coverMm, dict.units.mm)} · ${s.insertCapacity} ${dict.sizes.inserts}`,
          delta: formatPrice(s.basePriceMinor),
        }))}
      />

      {/* Below lg the preview no longer carries the size diagram: it is here, on request. */}
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={compare}
          aria-controls={panelId}
          onClick={() => setCompare((v) => !v)}
          className="mt-2 min-h-11 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
        >
          {compare ? dict.configurator.sizeCompareHide : dict.configurator.sizeCompareShow}
        </button>
        <div id={panelId} hidden={!compare} className="mt-2 rounded-sm border border-line p-4">
          <SizeDiagram
            active={config.size}
            mode="single"
            names={dict.sizes.names}
            mmUnit={dict.units.mm}
            aria={{ single: dict.schematic.sizeDiagramSingle, compare: dict.schematic.sizeDiagramCompare }}
            phoneLabel={dict.schematic.phone}
          />
        </div>
      </div>
    </div>
  );
}
