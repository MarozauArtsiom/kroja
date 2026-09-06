// components/configurator/change-message.ts
// Turns a ConfigChange (codes) into a sentence in the current language.
// Lives here and not in lib/, because lib/ knows nothing about locales.
import type { ConfigChange } from '@/lib/availability';
import type { Dictionary } from '@/types/i18n';
import { fill } from '@/lib/format';

export function changeMessage(change: ConfigChange, dict: Dictionary): string {
  switch (change.kind) {
    case 'leather':
      return fill(dict.conflicts.leatherChanged, {
        to: dict.leatherNames[change.to],
        from: dict.leatherNames[change.from],
      });
    case 'color':
      return fill(dict.conflicts.colorChanged, {
        to: dict.colors[change.to],
        from: dict.colors[change.from],
        leather: dict.leatherNames[change.leather],
      });
    case 'inserts':
      return fill(dict.conflicts.insertsReduced, {
        max: change.max,
        size: dict.sizes.names[change.size],
      });
    case 'cardSlots':
      return fill(dict.conflicts.cardSlotsReduced, {
        max: change.max,
        size: dict.sizes.names[change.size],
      });
  }
}
