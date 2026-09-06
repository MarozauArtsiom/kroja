// content/shots.ts
import type { Angle } from '@/types/config';

export interface AngleSpec {
  angle: Angle;
  /** CSS aspect-ratio value, e.g. '4 / 5' */
  ratio: string;
  /** Numeric ratio for SVG viewBox calculations: width / height */
  ratioValue: number;
}

export const angleSpecs: Record<Angle, AngleSpec> = {
  front:  { angle: 'front',  ratio: '4 / 5', ratioValue: 0.8 },
  back:   { angle: 'back',   ratio: '4 / 5', ratioValue: 0.8 },
  open:   { angle: 'open',   ratio: '4 / 3', ratioValue: 1.3333 },
  detail: { angle: 'detail', ratio: '1 / 1', ratioValue: 1 },
};

/** Photo-matrix angles. 'back' is schematic-only: the band and knot are drawn, nothing to photograph. */
export const angleList: AngleSpec[] = [angleSpecs.front, angleSpecs.open, angleSpecs.detail];

/** Tabs in the configurator preview. */
export const schematicAngleList: AngleSpec[] = [
  angleSpecs.front,
  angleSpecs.back,
  angleSpecs.open,
  angleSpecs.detail,
];
