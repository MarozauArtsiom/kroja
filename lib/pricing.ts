// lib/pricing.ts
import type { Configuration } from '@/types/config';
import { sizes } from '@/content/sizes';
import { leathers } from '@/content/leathers';
import {
  ENGRAVING_MINOR,
  GIFT_BOX_MINOR,
  insertPriceMinor,
} from '@/content/pricing';

export interface PriceBreakdown {
  baseMinor: number;
  leatherMinor: number;
  engravingMinor: number;
  insertsMinor: number;
  giftBoxMinor: number;
  totalMinor: number;
}

export function hasEngraving(config: Configuration): boolean {
  return !!config.engraving && config.engraving.text.trim().length > 0;
}

export function calculatePrice(config: Configuration): PriceBreakdown {
  const baseMinor = sizes[config.size].basePriceMinor;
  const leatherMinor = leathers[config.leather].priceDeltaMinor;
  const engravingMinor = hasEngraving(config) ? ENGRAVING_MINOR : 0;

  const insertsMinor = config.inserts.reduce(
    (sum, item) => sum + insertPriceMinor[item.type] * item.qty,
    0,
  );

  const giftBoxMinor = config.giftBox ? GIFT_BOX_MINOR : 0;

  return {
    baseMinor,
    leatherMinor,
    engravingMinor,
    insertsMinor,
    giftBoxMinor,
    totalMinor: baseMinor + leatherMinor + engravingMinor + insertsMinor + giftBoxMinor,
  };
}
