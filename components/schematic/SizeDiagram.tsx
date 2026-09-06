// components/schematic/SizeDiagram.tsx
import type { SizeCode } from '@/types/config';
import { sizes, sizeList } from '@/lib/data';
import { formatDimensions } from '@/lib/format';
import { INK, LINE, MUTED } from '@/lib/schematic-tokens';

interface Props {
  /** Highlighted size */
  active: SizeCode;
  /** Show all four outlines for comparison (landing) or just the active one (configurator) */
  mode?: 'single' | 'compare';
  /** Localised size names, keyed by size code. */
  names: Record<SizeCode, string>;
}

const PHONE_MM: [number, number] = [70, 150];

export default function SizeDiagram({ active, mode = 'single', names }: Props) {
  const shown = mode === 'compare' ? sizeList : [sizes[active]];

  // Scale: fit the tallest object (phone or largest cover) into 200 units of height
  const maxMmH = Math.max(PHONE_MM[1], ...shown.map((s) => s.coverMm[1]));
  const scale = 200 / maxMmH;

  const gap = 12;
  const widths = shown.map((s) => s.coverMm[0] * scale);
  const phoneW = PHONE_MM[0] * scale;
  const totalW = widths.reduce((a, b) => a + b, 0) + phoneW + gap * shown.length;
  const vbH = 200 + 40;

  let cursor = 0;

  return (
    <svg
      viewBox={`0 0 ${Math.ceil(totalW)} ${vbH}`}
      className="block h-auto w-full"
      role="img"
      aria-label={
        mode === 'compare'
          ? 'Size comparison of all four notebook formats, drawn to scale next to a phone'
          : `Size diagram: ${names[active]}, ${formatDimensions(sizes[active].coverMm)}`
      }
    >
      {shown.map((s) => {
        const w = s.coverMm[0] * scale;
        const h = s.coverMm[1] * scale;
        const x = cursor;
        const y = 200 - h;
        cursor += w + gap;
        const isActive = s.code === active;

        return (
          <g key={s.code}>
            <rect
              x={x} y={y} width={w} height={h} rx="3"
              fill="none"
              stroke={isActive ? INK : LINE}
              strokeWidth={isActive ? 1.6 : 1}
            />
            <text
              x={x + w / 2} y={218}
              textAnchor="middle" fontSize="9"
              fill={isActive ? INK : MUTED}
            >
              {names[s.code]}
            </text>
            <text
              x={x + w / 2} y={230}
              textAnchor="middle" fontSize="8" fill={MUTED}
            >
              {formatDimensions(s.coverMm)}
            </text>
          </g>
        );
      })}

      {/* Phone silhouette for scale */}
      <g opacity="0.4">
        <rect
          x={cursor} y={200 - PHONE_MM[1] * scale}
          width={phoneW} height={PHONE_MM[1] * scale} rx="8"
          fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3"
        />
        <text x={cursor + phoneW / 2} y={218} textAnchor="middle" fontSize="9" fill={MUTED}>
          Phone
        </text>
      </g>
    </svg>
  );
}
