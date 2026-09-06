// content/leathers.ts
import type { LeatherCode, ColorCode, SizeCode } from '@/types/config';

export type HatchPattern = 'diagonal-fine' | 'croc-scale' | 'stipple';

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

/**
 * "Everything is available" until the maker confirms real stock.
 * To restrict a leather later, edit its availableColors / availableSizes — nothing else.
 */
const ALL_COLORS: ColorCode[] = [
  'natural', 'cognac', 'chestnut', 'olive', 'black', 'navy', 'burgundy', 'sand', 'graphite',
];
const ALL_SIZES: SizeCode[] = ['a6', 'b6', 'standard', 'a5'];

// DRAFT: origin, tanning, thickness and all texts are placeholders until the maker confirms them.
export const leathers: Record<LeatherCode, LeatherDef> = {
  smooth: {
    code: 'smooth',
    name: 'Smooth leather',
    origin: 'European tannery',
    tanning: 'Vegetable-tanned',
    thicknessMm: 1.8,
    priceDeltaMinor: 0,
    schematicHatch: 'diagonal-fine',
    character: 'Even, closed grain. Ages evenly.',
    description:
      'A clean, even surface with a fine natural grain. The most classic of the three: it takes embossing crisply and darkens evenly with use.',
    ageing: {
      m6: 'Slightly darker where hands touch it most',
      m12: 'Even, warmer tone, soft sheen on the edges',
      m36: 'Deep, uniform patina; holds its shape',
    },
    scratchResistance: 3,
    patinaSpeed: 3,
    softness: 3,
    availableColors: ALL_COLORS,
    availableSizes: ALL_SIZES,
    order: 1,
  },
  croc: {
    code: 'croc',
    name: 'Croc-embossed leather',
    origin: 'European tannery',
    tanning: 'Vegetable-tanned, plate-embossed',
    thicknessMm: 1.8,
    priceDeltaMinor: 1000,
    schematicHatch: 'croc-scale',
    character: 'Crocodile-pattern relief pressed into cowhide.',
    description:
      'Full-grain cowhide pressed with a crocodile-scale plate. The relief hides small scratches and gives the cover a formal, structured look. No exotic skins are used.',
    ageing: {
      m6: 'Scale tops polish slightly from handling',
      m12: 'Contrast between raised and recessed areas grows',
      m36: 'Glossy ridges, matte valleys — a deep two-tone relief',
    },
    scratchResistance: 4,
    patinaSpeed: 2,
    softness: 2,
    availableColors: ALL_COLORS,
    availableSizes: ALL_SIZES,
    order: 2,
  },
  suede: {
    code: 'suede',
    name: 'Suede',
    origin: 'European tannery',
    tanning: 'Chrome-free split',
    thicknessMm: 1.6,
    priceDeltaMinor: 2000,
    schematicHatch: 'stipple',
    character: 'Soft, velvety nap. Warm to the touch.',
    description:
      'The flesh side of the hide, buffed to a fine velvet nap. The softest and warmest of the three. It marks easily and that is its character — brush it and the nap recovers.',
    ageing: {
      m6: 'Nap flattens where fingers rest',
      m12: 'Colour deepens, surface becomes smoother',
      m36: 'Worn-in, slightly glossy in high-touch areas',
    },
    scratchResistance: 2,
    patinaSpeed: 4,
    softness: 5,
    availableColors: ALL_COLORS,
    availableSizes: ALL_SIZES,
    order: 3,
  },
};

export const leatherList: LeatherDef[] = Object.values(leathers).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_LEATHER: LeatherCode = 'smooth';
