// components/schematic/views/DetailView.tsx
import { THREAD_THICKNESS_MM } from '@/lib/data';
import { fill } from '@/lib/format';
import { INK, LINE, MUTED, ALERT } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Labels, type ViewProps } from '../schematic-parts';

export default function DetailView({ compact, parts, dict }: ViewProps) {
  const { fill: leatherFill, hatch, stitch } = parts;

  return (
    <svg viewBox="0 0 400 400" className="block h-auto w-full" role="img"
         aria-label={fill(dict.schematic.detailAria, { leather: parts.leatherName })}>
      <HatchDefs scale={2} />
      <rect x="8" y="8" width="384" height="384" fill="none" stroke={LINE}
            strokeWidth="1" strokeDasharray="6 4" />
      <rect x="96" y="96" width="400" height="400" rx="14" fill={leatherFill}
            stroke={INK} strokeWidth="2" />
      <rect x="96" y="96" width="400" height="400" rx="14" fill={hatch} />
      <path d="M 96 400 L 96 110 Q 96 96 110 96 L 400 96" fill="none"
            stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M 136 400 L 136 150 Q 136 136 150 136 L 400 136" fill="none"
            stroke={stitch} strokeWidth="2" strokeDasharray="10 8" />
      <g fill={INK} opacity="0.8">
        {[380, 332, 284, 236, 188].map((cy) => <circle key={cy} cx="136" cy={cy} r="3.2" />)}
        {[168, 216, 264, 312].map((cx) => <circle key={cx} cx={cx} cy="136" r="3.2" />)}
      </g>
      {!compact && (
        <>
          <line x1="40" y1="300" x2="92" y2="300" stroke={MUTED} strokeWidth="0.9" />
          <text x="20" y="292" fontSize="9.5" fill={MUTED}>{dict.schematic.burnishedEdge}</text>
          <line x1="40" y1="236" x2="132" y2="236" stroke={MUTED} strokeWidth="0.9" />
          <text x="20" y="228" fontSize="9.5" fill={MUTED}>
            {fill(dict.schematic.threadDetail, { mm: THREAD_THICKNESS_MM })}
          </text>
          <text x="20" y="372" fontSize="9.5" fontWeight="600" fill={ALERT}>{dict.schematic.note}</text>
        </>
      )}
      {!compact && <Labels parts={parts} />}
    </svg>
  );
}
