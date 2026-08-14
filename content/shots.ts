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
  open: {
    angle: 'open',
    name: 'Open',
    ratio: '4 / 3',
    ratioValue: 1.3333,
    mustShow: ['How inserts attach', 'Inner side of the leather', 'Elastic retention'],
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

export const angleList: AngleSpec[] = [
  angleSpecs.front,
  angleSpecs.open,
  angleSpecs.detail,
];

/** Rules that apply to every single product shot. Shown on /shotlist. */
export const globalShotRules: string[] = [
  'No cord and no engraving in frame — both are composited in code',
  'Identical angle, light, distance and background within one angle group',
  'One neutral background across the whole matrix',
  'At least 2400 px on the long side before compression',
  'No retouching of the leather texture',
  'Shoot one size only — size is shown on the site by a diagram, not by photography',
  'Deliver original files, not messenger-compressed images',
];

/** Text shown on every schematic so it cannot be misread as a finished photo */
export const NOT_IN_FRAME = 'NOT IN FRAME: cord, engraving, packaging, props';
