// types/config.ts

export type SizeCode = 'a6' | 'b6' | 'standard' | 'a5';

export type LeatherCode = 'smooth' | 'croc' | 'suede';

export type ColorCode =
  | 'natural' | 'cognac' | 'chestnut'
  | 'olive' | 'black' | 'navy' | 'burgundy'
  | 'sand' | 'graphite';

/** 'tonal' = the thread takes the leather colour. Everything else is a fixed thread colour. */
export type ThreadCode = 'tonal' | 'linen' | 'cream' | 'black' | 'brown' | 'navy';

export type ClosureCode = 'elastic' | 'buckle' | 'none';

export type PenHolderCode = 'none' | 'slim' | 'wide';

export type InsertType = 'plain' | 'ruled' | 'dot';

/**
 * A pocket is one piece of leather folded up and stitched on three sides.
 * The kinds differ only in how high the fold goes — that is, in what fits inside.
 */
export type PocketKind = 'deep' | 'medium' | 'card' | 'corner';

/** Inner side of the cover. 'front' is the left half of the open spread, 'back' the right. */
export type Flap = 'front' | 'back';

export interface Pocket {
  kind: PocketKind;
  /** Stitched down the middle: two compartments from one piece. Never true for 'corner'. */
  divided: boolean;
}

/** Pockets on each flap, listed bottom to top. Each one overlaps the one below. */
export interface PocketLayout {
  front: Pocket[];
  back: Pocket[];
}

export type EmbossingFont = 'serif' | 'sans';

export type EmbossingPosition = 'bottom-right' | 'spine';

/** 'back' is schematic-only. The photo matrix uses front / open / detail. */
export type Angle = 'front' | 'back' | 'open' | 'detail';

export type StockStatus = 'in_stock' | 'made_to_order' | 'unavailable';

export interface Embossing {
  /** 1–2 uppercase letters, Latin or Cyrillic. Never empty, never whitespace. */
  text: string;
  font: EmbossingFont;
  position: EmbossingPosition;
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
  /** Both bands — the closing one and the inner one that holds the inserts — are in the leather colour. */
  closure: ClosureCode;
  penHolder: PenHolderCode;
  /** Free and always present. The per-size height budget is enforced in lib/availability.ts */
  pockets: PocketLayout;
  embossing: Embossing | null;
  /** At least one in total: the first insert is included in the price. */
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
