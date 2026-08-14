// lib/data.ts
// Single import point for all content data.
// Components and lib functions import from here, never from content/* directly.

export { sizes, sizeList, DEFAULT_SIZE } from '@/content/sizes';
export type { SizeDef } from '@/content/sizes';

export { leathers, leatherList, DEFAULT_LEATHER } from '@/content/leathers';
export type { LeatherDef, HatchPattern } from '@/content/leathers';

export { colors, colorList, DEFAULT_COLOR } from '@/content/colors';
export type { ColorDef } from '@/content/colors';

export { threads, threadList, DEFAULT_THREAD } from '@/content/threads';
export type { ThreadDef } from '@/content/threads';

export { cords, cordList, DEFAULT_CORD } from '@/content/cords';
export type { CordDef } from '@/content/cords';

export { stock, stockKey, productionDays } from '@/content/availability';

export {
  CURRENCY,
  ENGRAVING_MINOR,
  GIFT_BOX_MINOR,
  insertPriceMinor,
  insertNames,
  MAX_INSERTS_PER_TYPE,
  MAX_ENGRAVING_LENGTH,
} from '@/content/pricing';

export { angleSpecs, angleList, globalShotRules, NOT_IN_FRAME } from '@/content/shots';
export type { AngleSpec } from '@/content/shots';

export { sections } from '@/content/sections';
export { copy } from '@/content/copy';
