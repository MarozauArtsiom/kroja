// content/threads.ts
import type { ThreadCode } from '@/types/config';

export interface ThreadDef {
  code: ThreadCode;
  name: string;
  /** null = take the leather colour (the 'tonal' mode) */
  hex: string | null;
  /** All threads are free today. Field exists so a single colour can get a surcharge later. */
  priceMinor: number;
  order: number;
}

// TEMPORARY palette — replaced with the maker's real threads later.
export const threads: Record<ThreadCode, ThreadDef> = {
  tonal: { code: 'tonal', name: 'Match the leather', hex: null,      priceMinor: 0, order: 1 },
  linen: { code: 'linen', name: 'Natural linen',     hex: '#C9B79A', priceMinor: 0, order: 2 },
  cream: { code: 'cream', name: 'Cream',             hex: '#EFE6D3', priceMinor: 0, order: 3 },
  black: { code: 'black', name: 'Black',             hex: '#1C1917', priceMinor: 0, order: 4 },
  brown: { code: 'brown', name: 'Brown',             hex: '#5C3A21', priceMinor: 0, order: 5 },
  navy:  { code: 'navy',  name: 'Navy',              hex: '#2A3345', priceMinor: 0, order: 6 },
};

export const threadList: ThreadDef[] = Object.values(threads).sort((a, b) => a.order - b.order);

export const DEFAULT_THREAD: ThreadCode = 'tonal';

/** Fixed. Shown as a fact, never chosen. */
export const THREAD_THICKNESS_MM = 0.5;

/** Colour to draw the stitch with. 'tonal' resolves to the leather colour. */
export function threadHex(code: ThreadCode, leatherColorHex: string): string {
  return threads[code].hex ?? leatherColorHex;
}
