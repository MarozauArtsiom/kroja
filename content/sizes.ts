// content/sizes.ts
import type { SizeCode } from '@/types/config';

export interface SizeDef {
  code: SizeCode;
  name: string;
  /** Cover dimensions when closed, [width, height] in mm */
  coverMm: [number, number];
  /** Paper insert dimensions, [width, height] in mm */
  insertMm: [number, number];
  weightG: number;
  /** Paper inserts in total, the included one counts. */
  insertCapacity: number;
  basePriceMinor: number;
  useCase: string;
  order: number;
}

export const sizes: Record<SizeCode, SizeDef> = {
  a6: {
    code: 'a6',
    name: 'A6 Pocket',
    coverMm: [112, 158],
    insertMm: [105, 148],
    weightG: 120,
    insertCapacity: 2,
    basePriceMinor: 30000,
    useCase: 'Lists and quick notes on the move',
    order: 1,
  },
  b6: {
    code: 'b6',
    name: 'B6 Compact',
    coverMm: [132, 186],
    insertMm: [125, 176],
    weightG: 160,
    insertCapacity: 3,
    basePriceMinor: 30000,
    useCase: 'Everyday carry, the middle ground',
    order: 2,
  },
  standard: {
    code: 'standard',
    name: 'Standard',
    coverMm: [118, 220],
    insertMm: [110, 210],
    weightG: 180,
    insertCapacity: 4,
    basePriceMinor: 30000,
    useCase: 'Travel notebook format, sketching on the go',
    order: 3,
  },
  a5: {
    code: 'a5',
    name: 'A5 Large',
    coverMm: [155, 220],
    insertMm: [148, 210],
    weightG: 210,
    insertCapacity: 4,
    basePriceMinor: 30000,
    useCase: 'Desk work, journaling, long-form notes',
    order: 4,
  },
};

export const sizeList: SizeDef[] = Object.values(sizes).sort((a, b) => a.order - b.order);

export const DEFAULT_SIZE: SizeCode = 'a5';
