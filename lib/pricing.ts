// lib/pricing.ts
import type { Configuration } from '@/types/config';
import { sizes } from '@/content/sizes';
import { leathers } from '@/content/leathers';
import { threads } from '@/content/threads';
import { closures } from '@/content/closures';
import {
  EMBOSSING_MINOR,
  GIFT_BOX_MINOR,
  CARD_SLOTS_MINOR,
  PEN_HOLDER_MINOR,
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
  const penHolderMinor = config.penHolder === 'none' ? 0 : PEN_HOLDER_MINOR;
  const cardSlotsMinor = config.cardSlots > 0 ? CARD_SLOTS_MINOR : 0;
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
