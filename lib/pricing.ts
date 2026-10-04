// lib/pricing.ts
import type { Configuration } from '@/types/config';
import { sizes } from '@/content/sizes';
import { leathers } from '@/content/leathers';
import { threads } from '@/content/threads';
import { closures } from '@/content/closures';
import { penHolders } from '@/content/pen-holders';
import {
  EMBOSSING_MINOR,
  GIFT_BOX_MINOR,
  insertsPriceMinor,
} from '@/content/pricing';

export interface PriceBreakdown {
  baseMinor: number;
  leatherMinor: number;
  threadMinor: number;
  closureMinor: number;
  penHolderMinor: number;
  embossingMinor: number;
  insertsMinor: number;
  giftBoxMinor: number;
  totalMinor: number;
}

export function hasEmbossing(config: Configuration): boolean {
  return !!config.embossing && config.embossing.text.trim().length > 0;
}

export function calculatePrice(config: Configuration): PriceBreakdown {
  const baseMinor = sizes[config.size].basePriceMinor;
  const leatherMinor = leathers[config.leather].priceDeltaMinor;
  const threadMinor = threads[config.thread].priceMinor;
  const closureMinor = closures[config.closure].priceMinor;
  const penHolderMinor = penHolders[config.penHolder].priceMinor;
  const embossingMinor = hasEmbossing(config) ? EMBOSSING_MINOR : 0;

  // Pockets are free and have no line here. The first insert is free too.
  const insertsMinor = insertsPriceMinor(config.inserts);

  const giftBoxMinor = config.giftBox ? GIFT_BOX_MINOR : 0;

  return {
    baseMinor,
    leatherMinor,
    threadMinor,
    closureMinor,
    penHolderMinor,
    embossingMinor,
    insertsMinor,
    giftBoxMinor,
    totalMinor:
      baseMinor +
      leatherMinor +
      threadMinor +
      closureMinor +
      penHolderMinor +
      embossingMinor +
      insertsMinor +
      giftBoxMinor,
  };
}
