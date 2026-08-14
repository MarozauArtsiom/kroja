// components/schematic/HatchDefs.tsx
import type { HatchPattern } from '@/content/leathers';

const INK = '#1C1917';

export const hatchId: Record<HatchPattern, string> = {
  'diagonal-fine': 'hatch-fine',
  'diagonal-coarse': 'hatch-coarse',
  'cross-hatch': 'hatch-cross',
};

export function hatchUrl(pattern: HatchPattern): string {
  return `url(#${hatchId[pattern]})`;
}

export default function HatchDefs({ scale = 1 }: { scale?: number }) {
  return (
    <defs>
      <pattern
        id="hatch-fine"
        width={4 * scale}
        height={4 * scale}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={4 * scale}
          stroke={INK}
          strokeWidth={0.5 * scale}
          opacity="0.35"
        />
      </pattern>
      <pattern
        id="hatch-coarse"
        width={9 * scale}
        height={9 * scale}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={9 * scale}
          stroke={INK}
          strokeWidth={1.4 * scale}
          opacity="0.4"
        />
      </pattern>
      <pattern
        id="hatch-cross"
        width={7 * scale}
        height={7 * scale}
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="0"
          x2={7 * scale}
          y2={7 * scale}
          stroke={INK}
          strokeWidth={0.7 * scale}
          opacity="0.32"
        />
        <line
          x1={7 * scale}
          y1="0"
          x2="0"
          y2={7 * scale}
          stroke={INK}
          strokeWidth={0.7 * scale}
          opacity="0.32"
        />
      </pattern>
    </defs>
  );
}
