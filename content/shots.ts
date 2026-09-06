// content/shots.ts
import type { Angle } from '@/types/config';

export interface AngleSpec {
  angle: Angle;
  name: string;
  /** CSS aspect-ratio value, e.g. '4 / 5' */
  ratio: string;
  /** Numeric ratio for SVG viewBox calculations: width / height */
  ratioValue: number;
  /** Shown as callouts on the schematic */
  mustShow: string[];
  /** One-line description of the framing */
  framing: string;
}

export const angleSpecs: Record<Angle, AngleSpec> = {
  front: {
    angle: 'front',
    name: 'Front',
    ratio: '4 / 5',
    ratioValue: 0.8,
    mustShow: ['Leather grain', 'Stitch line', 'Burnished edge', 'Overall silhouette'],
    framing: 'Closed cover, slight angle, whole object in frame',
  },
  back: {
    angle: 'back',
    name: 'Back',
    ratio: '4 / 5',
    ratioValue: 0.8,
    mustShow: ['Elastic knot and two holes', 'Strap anchor when a buckle is chosen', 'Pen loop on the spine'],
    framing: 'Closed cover seen from the back, whole object in frame',
  },
  open: {
    angle: 'open',
    name: 'Open',
    ratio: '4 / 3',
    ratioValue: 1.3333,
    mustShow: ['How inserts attach', 'Inner side of the leather', 'Card slots when chosen'],
    framing: 'Cover opened flat, inserts in place, shot from above',
  },
  detail: {
    angle: 'detail',
    name: 'Detail',
    ratio: '1 / 1',
    ratioValue: 1,
    mustShow: ['Stitch density', 'Edge finish', 'Close grain'],
    framing: 'Corner of the cover filling the frame',
  },
};

/** Photo-matrix angles. 'back' is schematic-only: the band and knot are drawn, nothing to photograph. */
export const angleList: AngleSpec[] = [
  angleSpecs.front,
  angleSpecs.open,
  angleSpecs.detail,
];

/** Tabs in the configurator preview. */
export const schematicAngleList: AngleSpec[] = [
  angleSpecs.front,
  angleSpecs.back,
  angleSpecs.open,
  angleSpecs.detail,
];

/** Rules that apply to every single product shot. Kept for the future shoot. Shown on /shotlist. */
export const globalShotRules: string[] = [
  'No elastic band, no embossing, no pen loop, no card slots and no buckle in frame — all are drawn by the site',
  'Identical angle, light, distance and background within one angle group',
  'One neutral background across the whole matrix',
  'At least 2400 px on the long side before compression',
  'No retouching of the leather texture',
  'Shoot one size only — size is shown on the site by a diagram, not by photography',
  'Deliver original files, not messenger-compressed images',
];

/** Text shown on every schematic so it cannot be misread as a finished photo */
export const SCHEMATIC_NOTE = 'SCHEMATIC DRAWING — not a photograph. Colours are approximate.';
