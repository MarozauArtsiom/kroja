// components/configurator/SizeSelector.tsx
'use client';

import type { Configuration, SizeCode } from '@/types/config';
import { sizeList } from '@/content/sizes';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDimensions, formatPrice } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function SizeSelector({ config, onChange }: Props) {
  const { dict } = useI18n();

  return (
    <section>
      <h2 className="label mb-3">{dict.configurator.steps.size}</h2>
      <OptionCardGroup
        label="Size"
        columns="grid-cols-2"
        value={config.size}
        onChange={(v) => onChange({ size: v as SizeCode })}
        items={sizeList.map((s) => ({
          value: s.code,
          title: s.name,
          meta: `${formatDimensions(s.coverMm)} · ${s.insertCapacity} ${dict.sizes.inserts}`,
          delta: formatPrice(s.basePriceMinor),
        }))}
      />
    </section>
  );
}
