// content/availability.ts
import type { LeatherCode, ColorCode, StockStatus } from '@/types/config';

/** Key format: `${leather}_${color}` */
export type StockKey = string;

export function stockKey(leather: LeatherCode, color: ColorCode): StockKey {
  return `${leather}_${color}`;
}

/**
 * MANUAL STOCK CONTROL.
 * This is the only file to edit when leather stock changes.
 * A key missing from this map is treated as 'unavailable'.
 */
export const stock: Record<StockKey, StockStatus> = {
  // veg-tan
  'veg-tan_natural': 'in_stock',
  'veg-tan_cognac': 'in_stock',
  'veg-tan_chestnut': 'in_stock',
  'veg-tan_black': 'made_to_order',
  // crazy-horse
  'crazy-horse_cognac': 'in_stock',
  'crazy-horse_chestnut': 'in_stock',
  'crazy-horse_olive': 'made_to_order',
  'crazy-horse_black': 'in_stock',
  'crazy-horse_navy': 'made_to_order',
  // pull-up
  'pull-up_cognac': 'in_stock',
  'pull-up_black': 'in_stock',
  'pull-up_burgundy': 'unavailable',
};

export const productionDays: Record<Exclude<StockStatus, 'unavailable'>, number> = {
  in_stock: 5,
  made_to_order: 14,
};
