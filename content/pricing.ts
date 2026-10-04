// content/pricing.ts
import type { InsertSelection, InsertType } from '@/types/config';

export const CURRENCY = 'PLN' as const;

/** All amounts in minor units (grosz). 4000 === 40.00 zł */
export const EMBOSSING_MINOR = 4000;
export const GIFT_BOX_MINOR = 3500;
/** Flat fee for a pen loop, either loop size. */
export const PEN_HOLDER_MINOR = 2000;
/** Solid brass buckle instead of the elastic band. */
export const BUCKLE_MINOR = 13000;

export const insertPriceMinor: Record<InsertType, number> = {
  plain: 2500,
  ruled: 2500,
  dot: 2500,
};

export const MAX_INSERTS_PER_TYPE = 4;
export const MAX_EMBOSSING_LENGTH = 2;

/** How many paper inserts come with every cover at no charge. */
export const INCLUDED_INSERTS = 1;

/**
 * The included insert is free, whichever type it is; every further one is paid.
 * Units are priced cheapest-first-free, so the rule holds even if types ever cost differently.
 * Kept here so the rule lives next to the price, not inside calculatePrice.
 */
export function insertsPriceMinor(inserts: InsertSelection[]): number {
  const unitPrices = inserts
    .flatMap((item) => Array.from({ length: Math.max(0, item.qty) }, () => insertPriceMinor[item.type]))
    .sort((a, b) => a - b);
  return unitPrices.slice(INCLUDED_INSERTS).reduce((sum, price) => sum + price, 0);
}
