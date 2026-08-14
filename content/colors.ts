// content/colors.ts
import type { ColorCode } from '@/types/config';

export interface ColorDef {
  code: ColorCode;
  name: string;
  /** UI only: the swatch dot and the schematic colour chip.
   *  This is NOT the real leather colour — real colour comes from photography. */
  hex: string;
  /** Lower number = higher priority when auto-substituting an unavailable colour */
  order: number;
}

export const colors: Record<ColorCode, ColorDef> = {
  cognac:   { code: 'cognac',   name: 'Cognac',   hex: '#8B4A2B', order: 1 },
  chestnut: { code: 'chestnut', name: 'Chestnut', hex: '#5C3A21', order: 2 },
  natural:  { code: 'natural',  name: 'Natural',  hex: '#C9A97E', order: 3 },
  olive:    { code: 'olive',    name: 'Olive',    hex: '#4A4B32', order: 4 },
  navy:     { code: 'navy',     name: 'Navy',     hex: '#2A3345', order: 5 },
  burgundy: { code: 'burgundy', name: 'Burgundy', hex: '#5A222B', order: 6 },
  black:    { code: 'black',    name: 'Black',    hex: '#1C1917', order: 7 },
};

export const colorList: ColorDef[] = Object.values(colors).sort((a, b) => a.order - b.order);

export const DEFAULT_COLOR: ColorCode = 'cognac';
