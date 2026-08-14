// components/configurator/ColorSelector.tsx
'use client';

import { useState } from 'react';
import type { Configuration, ColorCode } from '@/types/config';
import { colorList } from '@/content/colors';
import { copy } from '@/content/copy';
import { getColorState } from '@/lib/availability';
import SwatchGroup from '@/components/ui/SwatchGroup';
import NotifyStockForm from './NotifyStockForm';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function ColorSelector({ config, onChange }: Props) {
  const [notifyColor, setNotifyColor] = useState<ColorCode | null>(null);

  const items = colorList.map((c) => {
    const state = getColorState(config.leather, c.code);
    if (state.kind === 'available') {
      return {
        value: c.code,
        label: c.name,
        hex: c.hex,
        state: state.status === 'made_to_order' ? ('made-to-order' as const) : ('available' as const),
      };
    }
    return {
      value: c.code,
      label: c.name,
      hex: c.hex,
      state: 'disabled' as const,
      note: state.reason,
    };
  });

  function handleChange(value: string) {
    const code = value as ColorCode;
    const state = getColorState(config.leather, code);
    if (state.kind === 'available') {
      onChange({ color: code });
    } else if (state.kind === 'unavailable') {
      // Out of stock, but the colour does exist in this leather — offer to be notified.
      setNotifyColor(code);
    }
    // 'not-in-leather' → do nothing at all
  }

  return (
    <section>
      <h2 className="label mb-3">{copy.configurator.steps.color}</h2>
      <SwatchGroup label="Colour" items={items} value={config.color} onChange={handleChange} />
      {notifyColor && (
        <NotifyStockForm
          leather={config.leather}
          color={notifyColor}
          onClose={() => setNotifyColor(null)}
        />
      )}
    </section>
  );
}
