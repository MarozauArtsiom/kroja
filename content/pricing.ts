// content/pricing.ts
import type { InsertType } from '@/types/config';

export const CURRENCY = 'PLN' as const;

/** All amounts in minor units (grosz). 4000 === 40.00 zł */
export const EMBOSSING_MINOR = 4000;
export const GIFT_BOX_MINOR = 3500;
/** Flat fee for having card slots at all. Count and notebook size do not change it. */
export const CARD_SLOTS_MINOR = 1000;
/** Flat fee for a pen loop, either loop size. */
export const PEN_HOLDER_MINOR = 2000;
/** Solid brass buckle instead of the elastic band. */
export const BUCKLE_MINOR = 13000;

export const insertPriceMinor: Record<InsertType, number> = {
  plain: 2500,
  ruled: 2500,
  dot: 2500,
};

export const insertNames: Record<InsertType, string> = {
  plain: 'Plain',
  ruled: 'Ruled',
  dot: 'Dot grid',
};

export const MAX_INSERTS_PER_TYPE = 4;
export const MAX_EMBOSSING_LENGTH = 2;
/** Absolute upper bound for the URL parser. The per-size limit is sizes[size].cardSlotsMax. */
export const MAX_CARD_SLOTS = 4;
