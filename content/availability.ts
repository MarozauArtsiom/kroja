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
 * Today everything is in stock — until the maker confirms real quantities.
 */
export const stock: Record<StockKey, StockStatus> = {
  // smooth
  'smooth_natural': 'in_stock',
  'smooth_cognac': 'in_stock',
  'smooth_chestnut': 'in_stock',
  'smooth_olive': 'in_stock',
  'smooth_black': 'in_stock',
  'smooth_navy': 'in_stock',
  'smooth_burgundy': 'in_stock',
  'smooth_sand': 'in_stock',
  'smooth_graphite': 'in_stock',
  // croc
  'croc_natural': 'in_stock',
  'croc_cognac': 'in_stock',
  'croc_chestnut': 'in_stock',
  'croc_olive': 'in_stock',
  'croc_black': 'in_stock',
  'croc_navy': 'in_stock',
  'croc_burgundy': 'in_stock',
  'croc_sand': 'in_stock',
  'croc_graphite': 'in_stock',
  // suede
  'suede_natural': 'in_stock',
  'suede_cognac': 'in_stock',
  'suede_chestnut': 'in_stock',
  'suede_olive': 'in_stock',
  'suede_black': 'in_stock',
  'suede_navy': 'in_stock',
  'suede_burgundy': 'in_stock',
  'suede_sand': 'in_stock',
  'suede_graphite': 'in_stock',
};

export const productionDays: Record<Exclude<StockStatus, 'unavailable'>, number> = {
  in_stock: 5,
  made_to_order: 14,
};
