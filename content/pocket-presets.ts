// content/pocket-presets.ts
// Ready-made layouts shown before the manual pocket editor. Each fits the smallest size
// (A6, 142 mm budget): 'cards' takes 135 mm, the front flap of 'travel' 140 mm.
import type { Pocket, PocketLayout, PocketPresetCode } from '@/types/config';
import { DEFAULT_POCKETS } from './pockets';

export interface PocketPresetDef {
  code: PocketPresetCode;
  layout: PocketLayout;
  order: number;
}

const card: Pocket = { kind: 'card', divided: false };

export const pocketPresets: Record<PocketPresetCode, PocketPresetDef> = {
  none: { code: 'none', order: 1, layout: { front: [], back: [] } },
  classic: { code: 'classic', order: 2, layout: DEFAULT_POCKETS },
  cards: { code: 'cards', order: 3, layout: { front: [card, card, card], back: [] } },
  travel: {
    code: 'travel',
    order: 4,
    layout: {
      front: [{ kind: 'deep', divided: false }, card],
      back: [{ kind: 'medium', divided: false }],
    },
  },
};

export const pocketPresetList: PocketPresetDef[] = Object.values(pocketPresets).sort(
  (a, b) => a.order - b.order,
);
