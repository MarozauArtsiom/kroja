// components/schematic/HatchDefs.tsx
import type { HatchPattern } from '@/lib/data';
import { INK } from '@/lib/schematic-tokens';

export const hatchId: Record<HatchPattern, string> = {
  'diagonal-fine': 'hatch-fine',
  'croc-scale': 'hatch-croc',
  stipple: 'hatch-stipple',
};

export function hatchUrl(pattern: HatchPattern): string {
  return `url(#${hatchId[pattern]})`;
}

/**
 * Three leather textures as SVG patterns.
 * fine   — smooth leather: thin even diagonal lines
 * croc   — croc-embossed: brick-offset rounded plates, reads as scales
 * stipple— suede: dots of two sizes, reads as nap
 */
export default function HatchDefs({ scale = 1 }: { scale?: number }) {
  const s = scale;
  return (
    <defs>
      <pattern
        id="hatch-fine"
        width={4 * s}
        height={4 * s}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2={4 * s} stroke={INK} strokeWidth={0.5 * s} opacity="0.35" />
      </pattern>

      <pattern id="hatch-croc" width={16 * s} height={12 * s} patternUnits="userSpaceOnUse">
        <rect x={1 * s} y={1 * s} width={14 * s} height={4.5 * s} rx={2 * s}
              fill="none" stroke={INK} strokeWidth={0.8 * s} opacity="0.45" />
        <rect x={-7 * s} y={7 * s} width={14 * s} height={4.5 * s} rx={2 * s}
              fill="none" stroke={INK} strokeWidth={0.8 * s} opacity="0.45" />
        <rect x={9 * s} y={7 * s} width={14 * s} height={4.5 * s} rx={2 * s}
              fill="none" stroke={INK} strokeWidth={0.8 * s} opacity="0.45" />
      </pattern>

      <pattern id="hatch-stipple" width={6 * s} height={6 * s} patternUnits="userSpaceOnUse">
        <circle cx={1.5 * s} cy={1.5 * s} r={0.55 * s} fill={INK} opacity="0.4" />
        <circle cx={4.5 * s} cy={4.5 * s} r={0.55 * s} fill={INK} opacity="0.4" />
        <circle cx={4.5 * s} cy={1.5 * s} r={0.35 * s} fill={INK} opacity="0.25" />
        <circle cx={1.5 * s} cy={4.5 * s} r={0.35 * s} fill={INK} opacity="0.25" />
      </pattern>
    </defs>
  );
}
