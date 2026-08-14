// content/pricing.ts
import type { InsertType } from '@/types/config';

export const CURRENCY = 'PLN' as const;

/** All amounts in minor units (grosz). 4000 === 40.00 zł */
export const ENGRAVING_MINOR = 4000;
export const GIFT_BOX_MINOR = 3500;

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
export const MAX_ENGRAVING_LENGTH = 20;
