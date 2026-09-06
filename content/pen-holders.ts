// content/pen-holders.ts
import type { PenHolderCode } from "@/types/config";

export interface PenHolderDef {
  code: PenHolderCode;
  /** Inner diameter of the loop, mm. DRAFT until the maker measures the real loops. */
  minMm: number;
  maxMm: number;
  order: number;
}

export const penHolders: Record<PenHolderCode, PenHolderDef> = {
  none: { code: "none", minMm: 0,  maxMm: 0,  order: 1 },
  slim: { code: "slim", minMm: 0,  maxMm: 10, order: 2 },
  wide: { code: "wide", minMm: 10, maxMm: 13, order: 3 },
};

export const penHolderList: PenHolderDef[] = Object.values(penHolders).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_PEN_HOLDER: PenHolderCode = "none";
