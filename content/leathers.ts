// content/leathers.ts
import type { LeatherCode, ColorCode, SizeCode } from '@/types/config';

export type HatchPattern = 'diagonal-fine' | 'diagonal-coarse' | 'cross-hatch';

export interface LeatherDef {
  code: LeatherCode;
  name: string;
  origin: string;
  tanning: string;
  thicknessMm: number;
  priceDeltaMinor: number;
  schematicHatch: HatchPattern;
  /** Short description for the configurator */
  character: string;
  /** Longer description for the landing page */
  description: string;
  ageing: { m6: string; m12: string; m36: string };
  /** 1..5 for the comparison table */
  scratchResistance: number;
  patinaSpeed: number;
  softness: number;
  availableColors: ColorCode[];
  availableSizes: SizeCode[];
  order: number;
}

export const leathers: Record<LeatherCode, LeatherDef> = {
  'veg-tan': {
    code: 'veg-tan',
    name: 'Vegetable-tanned',
    origin: 'Tuscany, Italy',
    tanning: 'Vegetable, tannins from tree bark',
    thicknessMm: 1.8,
    priceDeltaMinor: 0,
    schematicHatch: 'diagonal-fine',
    character: 'Firm and smooth. Darkens with sunlight and use.',
    description:
      'Tanned the slow way, with tree bark rather than chemicals. It starts pale and firm, and darkens into a deep honey tone over the first year. The most alive of the three.',
    ageing: {
      m6: 'Noticeably darker where hands touch it most',
      m12: 'Even honey tone, first soft creases along the spine',
      m36: 'Deep amber, fully broken in, holds its shape',
    },
    scratchResistance: 2,
    patinaSpeed: 5,
    softness: 2,
    availableColors: ['natural', 'cognac', 'chestnut', 'black'],
    availableSizes: ['a6', 'b6', 'standard', 'a5'],
    order: 1,
  },
  'crazy-horse': {
    code: 'crazy-horse',
    name: 'Crazy Horse',
    origin: 'Poland',
    tanning: 'Chrome-free, wax-pulled surface',
    thicknessMm: 2.0,
    priceDeltaMinor: 3000,
    schematicHatch: 'diagonal-coarse',
    character: 'Waxed surface. Scratches lighten and rub back out.',
    description:
      'A waxed finish that lightens where it bends or scratches, then rubs back with a thumb. Every mark is temporary, which makes it the most forgiving of the three.',
    ageing: {
      m6: 'A map of light streaks where it flexes',
      m12: 'Surface settles, wax evens out, marks less visible',
      m36: 'Soft and dense, a worn-in look that reads as character',
    },
    scratchResistance: 4,
    patinaSpeed: 3,
    softness: 3,
    availableColors: ['cognac', 'chestnut', 'olive', 'black', 'navy'],
    availableSizes: ['a6', 'b6', 'standard', 'a5'],
    order: 2,
  },
  'pull-up': {
    code: 'pull-up',
    name: 'Pull-up',
    origin: 'Italy',
    tanning: 'Oil-impregnated, aniline finish',
    thicknessMm: 1.6,
    priceDeltaMinor: 5000,
    schematicHatch: 'cross-hatch',
    character: 'Oil-rich and soft. Colour shifts where it bends.',
    description:
      'Saturated with oil, so the colour lifts wherever the leather bends. Softer than the others from day one, and mottled rather than uniform.',
    ageing: {
      m6: 'Bends already lighter than flat areas',
      m12: 'Rich contrast between worn and untouched surfaces',
      m36: 'Supple, slouched, deeply personal to its owner',
    },
    scratchResistance: 3,
    patinaSpeed: 4,
    softness: 5,
    availableColors: ['cognac', 'black', 'burgundy'],
    availableSizes: ['b6', 'standard', 'a5'],
    order: 3,
  },
};

export const leatherList: LeatherDef[] = Object.values(leathers).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_LEATHER: LeatherCode = 'veg-tan';
