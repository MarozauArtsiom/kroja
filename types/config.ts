// types/config.ts

export type SizeCode = 'a6' | 'b6' | 'standard' | 'a5';

export type LeatherCode = 'veg-tan' | 'crazy-horse' | 'pull-up';

export type ColorCode =
  | 'natural' | 'cognac' | 'chestnut'
  | 'olive' | 'black' | 'navy' | 'burgundy';

export type ThreadCode = 'natural' | 'tonal' | 'contrast';

export type CordCode = 'black' | 'brown' | 'olive' | 'burgundy';

export type InsertType = 'plain' | 'ruled' | 'dot';

export type EngravingFont = 'serif' | 'sans';

export type EngravingPosition = 'bottom-right' | 'spine';

export type Angle = 'front' | 'open' | 'detail';

export type StockStatus = 'in_stock' | 'made_to_order' | 'unavailable';

export interface Engraving {
  /** Trimmed, max 20 characters. Never contains only whitespace. */
  text: string;
  font: EngravingFont;
  position: EngravingPosition;
}

export interface InsertSelection {
  type: InsertType;
  /** 0..4 */
  qty: number;
}

/** Everything the user picks. This is the single source of truth for a product. */
export interface Configuration {
  size: SizeCode;
  leather: LeatherCode;
  color: ColorCode;
  thread: ThreadCode;
  cord: CordCode;
  engraving: Engraving | null;
  inserts: InsertSelection[];
  giftBox: boolean;
}

/** Configuration plus everything derived from it. Never stored, always computed. */
export interface PricedConfiguration extends Configuration {
  /** Total in minor units (grosz). 35900 === 359.00 zł */
  totalMinor: number;
  currency: 'PLN';
  productionDays: number;
  stock: StockStatus;
  /** `${leather}_${color}` — NOTE: size is intentionally NOT part of this key */
  previewKey: string;
}

export interface CartItem {
  /** Stable hash of the normalised configuration. Used to merge duplicates. */
  id: string;
  config: PricedConfiguration;
  qty: number;
  addedAt: number;
}
