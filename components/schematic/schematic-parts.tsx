// components/schematic/schematic-parts.tsx
// Values and fragments shared by all four schematic views.
// Geometry lives in the views; anything derived from the configuration lives here.
import type { Configuration } from '@/types/config';
import { leathers, colors, threadHex, elasticColors, penHolders, SCHEMATIC_NOTE } from '@/lib/data';
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
  /** Elastic band colour */
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
export function schematicParts(config: Configuration): SchematicParts {
  const leather = leathers[config.leather];
  const color = colors[config.color];
  const penDef = penHolders[config.penHolder];

  return {
    leatherName: leather.name,
    colorName: color.name,
    fill: color.hex,
    hatch: hatchUrl(leather.schematicHatch),
    stitch: threadHex(config.thread, color.hex),
    elastic: elasticColors[config.elasticColor].hex,
    hasElastic: config.closure === 'elastic',
    hasBuckle: config.closure === 'buckle',
    hasPen: config.penHolder !== 'none',
    penR: config.penHolder === 'wide' ? PEN_RADIUS.wide : PEN_RADIUS.slim,
    penLabel:
      config.penHolder === 'wide'
        ? `pen loop Ø ${penDef.minMm}–${penDef.maxMm} mm`
        : `pen loop Ø up to ${penDef.maxMm} mm`,
    embossFont:
      config.embossing?.font === 'sans' ? 'Inter, system-ui, sans-serif' : 'Georgia, serif',
    insertCount: Math.min(4, Math.max(1, config.inserts.reduce((sum, i) => sum + i.qty, 0))),
  };
}

export interface ViewProps {
  config: Configuration;
  compact: boolean;
  parts: SchematicParts;
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
export function Notes({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.slice(0, 3).map((line, i) => (
        <text key={line} x="20" y={416 + i * 13} fontSize="9.5" fill={MUTED}>
          → {line}
        </text>
      ))}
      <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
    </>
  );
}

/** A pen sitting in its loop on a spine strip centred at x = cx. */
export function PenLoop({ parts, cx }: { parts: SchematicParts; cx: number }) {
  const { penR, fill, hatch } = parts;
  return (
    <g>
      <rect x={cx - penR} y="196" width={penR * 2} height="108" rx={penR}
            fill={PAPER} stroke={INK} strokeWidth="1.2" />
      <rect x={cx - penR - 4} y="238" width={penR * 2 + 8} height="20" rx="3"
            fill={fill} stroke={INK} strokeWidth="1.2" />
      <rect x={cx - penR - 4} y="238" width={penR * 2 + 8} height="20" rx="3" fill={hatch} />
    </g>
  );
}
