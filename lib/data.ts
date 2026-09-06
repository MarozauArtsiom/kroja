// lib/data.ts
// Single import point for all content data.
// Components import from here, never from content/* directly.

export { sizes, sizeList, DEFAULT_SIZE } from '@/content/sizes';
export type { SizeDef } from '@/content/sizes';

export { leathers, leatherList, DEFAULT_LEATHER } from '@/content/leathers';
export type { LeatherDef, HatchPattern } from '@/content/leathers';

export { colors, colorList, DEFAULT_COLOR } from '@/content/colors';
export type { ColorDef } from '@/content/colors';

export { threads, threadList, DEFAULT_THREAD, THREAD_THICKNESS_MM, threadHex } from '@/content/threads';
export type { ThreadDef } from '@/content/threads';

export { elasticColors, elasticColorList, DEFAULT_ELASTIC_COLOR } from '@/content/elastic';
export type { ElasticColorDef } from '@/content/elastic';

export { closures, closureList, DEFAULT_CLOSURE, BRASS_HEX } from '@/content/closures';
export type { ClosureDef } from '@/content/closures';

export { penHolders, penHolderList, DEFAULT_PEN_HOLDER } from '@/content/pen-holders';
export type { PenHolderDef } from '@/content/pen-holders';

export { stock, stockKey, productionDays } from '@/content/availability';

export {
  CURRENCY,
  EMBOSSING_MINOR,
  GIFT_BOX_MINOR,
  CARD_SLOTS_MINOR,
  PEN_HOLDER_MINOR,
  BUCKLE_MINOR,
  insertPriceMinor,
  insertNames,
  MAX_INSERTS_PER_TYPE,
  MAX_EMBOSSING_LENGTH,
  MAX_CARD_SLOTS,
  cardSlotsPriceMinor,
} from '@/content/pricing';

export {
  angleSpecs,
  angleList,
  schematicAngleList,
  globalShotRules,
} from '@/content/shots';
export type { AngleSpec } from '@/content/shots';

export { sections } from '@/content/sections';
