// components/configurator/ColorSelector.tsx
'use client';

import { useState } from 'react';
import type { Configuration, ColorCode } from '@/types/config';
import { colorList } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { getColorState } from '@/lib/availability';
import { fill } from '@/lib/format';
import SwatchGroup from '@/components/ui/SwatchGroup';
import NotifyStockForm from './NotifyStockForm';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function ColorSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const [notifyColor, setNotifyColor] = useState<ColorCode | null>(null);

  const items = colorList.map((c) => {
    const state = getColorState(config.leather, c.code);
    const localizedColorName = dict.colors[c.code] || c.name;
    if (state.kind === 'available') {
      return {
        value: c.code,
        label: localizedColorName,
        hex: c.hex,
        state: state.status === 'made_to_order' ? ('made-to-order' as const) : ('available' as const),
        madeToOrderLabel: dict.configurator.madeToOrder,
      };
    }
    return {
      value: c.code,
      label: localizedColorName,
      hex: c.hex,
      state: 'disabled' as const,
      note:
        state.kind === 'not-in-leather'
          ? fill(dict.conflicts.colorNotInLeather, { leather: dict.leatherNames[config.leather] })
          : dict.conflicts.colorOutOfStock,
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
    <div>
      <SwatchGroup label={dict.a11y.colorGroup} items={items} value={config.color} onChange={handleChange} />
      {notifyColor && (
        <NotifyStockForm
          leather={config.leather}
          color={notifyColor}
          onClose={() => setNotifyColor(null)}
        />
      )}
    </div>
  );
}
