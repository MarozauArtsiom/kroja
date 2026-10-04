// components/schematic/schematic-parts.tsx
// Values and fragments shared by all four schematic views.
// Geometry lives in the views; anything derived from the configuration lives here.
import type { Configuration } from '@/types/config';
import { leathers, colors, threadHex, penHolders } from '@/lib/data';
import type { Dictionary } from '@/types/i18n';
import { fill } from '@/lib/format';
import { INK, MUTED, ALERT, PAPER } from '@/lib/schematic-tokens';
import { hatchUrl } from './HatchDefs';

/** Pen radius in drawing units. The wide loop must be visibly bigger than the slim one. */
const PEN_RADIUS = { slim: 7, wide: 9 } as const;

export interface SchematicParts {
  leatherName: string;
  colorName: string;
  /** Leather colour fill */
  fill: string;
  /** url(#…) of the leather hatch pattern */
  hatch: string;
  /** Stitch colour, already resolved for the 'tonal' thread */
  stitch: string;
  /** Both bands are in the leather colour; drawn with <Band> so they stay visible on it. */
  elastic: string;
  hasElastic: boolean;
  hasBuckle: boolean;
  hasPen: boolean;
  penR: number;
  penLabel: string;
  embossFont: string;
  /** How many paper inserts to draw in the open view: 1..4 */
  insertCount: number;
}

/** Everything the drawings need, derived from the configuration in one place. */
export function schematicParts(config: Configuration, dict: Dictionary): SchematicParts {
  const leather = leathers[config.leather];
  const color = colors[config.color];
  const penDef = penHolders[config.penHolder];

  return {
    leatherName: dict.leatherNames[config.leather],
    colorName: dict.colors[config.color],
    fill: color.hex,
    hatch: hatchUrl(leather.schematicHatch),
    stitch: threadHex(config.thread, color.hex),
    elastic: color.hex,
    hasElastic: config.closure === 'elastic',
    hasBuckle: config.closure === 'buckle',
    hasPen: config.penHolder !== 'none',
    penR: config.penHolder === 'wide' ? PEN_RADIUS.wide : PEN_RADIUS.slim,
    penLabel:
      config.penHolder === 'wide'
        ? fill(dict.schematic.penLoopWide, { min: penDef.minMm, max: penDef.maxMm })
        : fill(dict.schematic.penLoopSlim, { max: penDef.maxMm }),
    embossFont:
      config.embossing?.font === 'sans' ? 'Inter, system-ui, sans-serif' : 'Georgia, serif',
    insertCount: Math.min(4, Math.max(1, config.inserts.reduce((sum, i) => sum + i.qty, 0))),
  };
}

export interface ViewProps {
  config: Configuration;
  compact: boolean;
  parts: SchematicParts;
  dict: Dictionary;
}

/** Colour chip and material names, top-left corner of every view. */
export function Labels({ parts }: { parts: SchematicParts }) {
  return (
    <>
      <rect x="20" y="20" width="14" height="14" fill={parts.fill} stroke={INK} strokeWidth="0.8" />
      <text x="42" y="31" fontSize="11" fill={INK}>{parts.colorName}</text>
      <text x="20" y="50" fontSize="10" fill={MUTED}>{parts.leatherName}</text>
    </>
  );
}

/** Callout lines plus the schematic warning, for the 400 × 500 views. Max three lines. */
export function Notes({ lines, note }: { lines: string[]; note: string }) {
  return (
    <>
      {lines.slice(0, 3).map((line, i) => (
        <text key={line} x="20" y={416 + i * 13} fontSize="9.5" fill={MUTED}>
          → {line}
        </text>
      ))}
      <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{note}</text>
    </>
  );
}

/**
 * A pen held by a leather loop, lying vertically with its axis at x = cx.
 * Used on the open spread: the loop is stitched to the inside of the front flap.
 */
export function PenLoop({
  parts,
  cx,
  top,
  length,
}: {
  parts: SchematicParts;
  cx: number;
  top: number;
  length: number;
}) {
  const { penR, fill, hatch } = parts;
  const keeperY = top + length / 2 - 10;
  return (
    <g>
      <rect x={cx - penR} y={top} width={penR * 2} height={length} rx={penR}
            fill={PAPER} stroke={INK} strokeWidth="1.1" />
      <rect x={cx - penR - 4} y={keeperY} width={penR * 2 + 8} height="20" rx="3"
            fill={fill} stroke={INK} strokeWidth="1.1" />
      <rect x={cx - penR - 4} y={keeperY} width={penR * 2 + 8} height="20" rx="3" fill={hatch} />
    </g>
  );
}

/**
 * An elastic band. It is the same colour as the leather, so it is drawn with an ink
 * casing underneath — otherwise a cognac band on a cognac cover disappears.
 */
export function Band({
  x1, y1, x2, y2, color, width = 3,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string; width?: number;
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={width + 1.6}
            strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
            strokeLinecap="round" />
    </g>
  );
}

/** A punched hole the band passes through. */
export function Hole({ cx, cy, r = 3.2 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={PAPER} stroke={INK} strokeWidth="1" />;
}

/**
 * Holes in the spine, shared by the front and back views. x values are for the front view;
 * the back view mirrors them (400 − x). Two holes at mid-height for the closing band,
 * two at the head and tail for the inner band that holds the inserts.
 */
export const SPINE = {
  closeHoleX: 110,
  closeHoleY: [244, 256] as const,
  blockBandX: 122,
  blockHoleY: [124, 376] as const,
};
