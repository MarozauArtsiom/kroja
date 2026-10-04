// content/pockets.ts
// Pockets inside the cover. Heights are a leatherworker's rule of thumb and wait
// for the maker to confirm — see kroja-spec/18-configurator-fixes.md.
import type { PocketKind, PocketLayout } from '@/types/config';

export interface PocketDef {
  code: PocketKind;
  /** How high the fold goes, mm. */
  heightMm: number;
  /** One-letter code used in the shareable URL. */
  letter: string;
  /** A corner holds a sheet by its corner: it is a triangle and cannot be split. */
  canDivide: boolean;
  order: number;
}

export const pockets: Record<PocketKind, PocketDef> = {
  deep:   { code: 'deep',   heightMm: 100, letter: 'd', canDivide: true,  order: 1 },
  medium: { code: 'medium', heightMm: 70,  letter: 'm', canDivide: true,  order: 2 },
  card:   { code: 'card',   heightMm: 55,  letter: 'c', canDivide: true,  order: 3 },
  corner: { code: 'corner', heightMm: 45,  letter: 'k', canDivide: false, order: 4 },
};

export const pocketList: PocketDef[] = Object.values(pockets).sort((a, b) => a.order - b.order);

/** Each pocket overlaps the one below by this much, so its contents can be reached. */
export const POCKET_OVERLAP_MM = 15;

/** Beyond four the cover stops closing flat. */
export const MAX_POCKETS_PER_FLAP = 4;

/** Seam and edge allowance at the top and at the bottom of a flap. */
export const FLAP_MARGIN_MM = 8;

/** Pockets are free and present by default: one deep pocket on the front flap. */
export const DEFAULT_POCKETS: PocketLayout = {
  front: [{ kind: 'deep', divided: false }],
  back: [],
};
