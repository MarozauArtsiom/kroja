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
  cardSlotsPriceMinor,
  insertPriceMinor,
} from '@/content/pricing';

export interface PriceBreakdown {
  baseMinor: number;
  leatherMinor: number;
  threadMinor: number;
  closureMinor: number;
  penHolderMinor: number;
  cardSlotsMinor: number;
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
  const cardSlotsMinor = cardSlotsPriceMinor(config.cardSlots);
  const embossingMinor = hasEmbossing(config) ? EMBOSSING_MINOR : 0;

  const insertsMinor = config.inserts.reduce(
    (sum, item) => sum + insertPriceMinor[item.type] * item.qty,
    0,
  );

  const giftBoxMinor = config.giftBox ? GIFT_BOX_MINOR : 0;

  return {
    baseMinor,
    leatherMinor,
    threadMinor,
    closureMinor,
    penHolderMinor,
    cardSlotsMinor,
    embossingMinor,
    insertsMinor,
    giftBoxMinor,
    totalMinor:
      baseMinor +
      leatherMinor +
      threadMinor +
      closureMinor +
      penHolderMinor +
      cardSlotsMinor +
      embossingMinor +
      insertsMinor +
      giftBoxMinor,
  };
}
