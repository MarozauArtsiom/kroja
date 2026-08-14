// content/cords.ts
import type { CordCode } from '@/types/config';

export interface CordDef {
  code: CordCode;
  name: string;
  hex: string;
  order: number;
}

export const cords: Record<CordCode, CordDef> = {
  black:    { code: 'black',    name: 'Black',    hex: '#1C1917', order: 1 },
  brown:    { code: 'brown',    name: 'Brown',    hex: '#5C3A21', order: 2 },
  olive:    { code: 'olive',    name: 'Olive',    hex: '#4A4B32', order: 3 },
  burgundy: { code: 'burgundy', name: 'Burgundy', hex: '#5A222B', order: 4 },
};

export const cordList: CordDef[] = Object.values(cords).sort((a, b) => a.order - b.order);

export const DEFAULT_CORD: CordCode = 'black';
