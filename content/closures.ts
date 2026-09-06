// content/closures.ts
import type { ClosureCode } from "@/types/config";
import { BUCKLE_MINOR } from "./pricing";

export interface ClosureDef {
  code: ClosureCode;
  priceMinor: number;
  order: number;
}

export const closures: Record<ClosureCode, ClosureDef> = {
  elastic: { code: "elastic", priceMinor: 0,            order: 1 },
  buckle:  { code: "buckle",  priceMinor: BUCKLE_MINOR, order: 2 },
  none:    { code: "none",    priceMinor: 0,            order: 3 },
};

export const closureList: ClosureDef[] = Object.values(closures).sort((a, b) => a.order - b.order);

export const DEFAULT_CLOSURE: ClosureCode = "elastic";

/** Schematic colour of the solid-brass buckle. One finish only. */
export const BRASS_HEX = "#B08D57";
