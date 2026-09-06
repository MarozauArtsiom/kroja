// components/schematic/views/OpenView.tsx
import { fill } from '@/lib/format';
import { INK, LINE, MUTED, ALERT, PAPER } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Labels, type ViewProps } from '../schematic-parts';

/** Card slot geometry: card 85.6 × 54 mm drawn as 100 × 63, stacked with a 16 step. */
const SLOT_W = 100;
const SLOT_H = 63;
const SLOT_STEP = 16;
const SLOT_X = 80;
const SLOT_BOTTOM = 220;

export default function OpenView({ config, compact, parts, dict }: ViewProps) {
  const { fill: leatherFill, hatch, stitch, elastic, insertCount } = parts;
  const slotTop = SLOT_BOTTOM - SLOT_H - (config.cardSlots - 1) * SLOT_STEP;

  return (
    <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img"
         aria-label={fill(dict.schematic.openAria, { leather: parts.leatherName, color: parts.colorName })}>
      <HatchDefs />
      <rect x="8" y="8" width="384" height="284" fill="none" stroke={LINE}
            strokeWidth="1" strokeDasharray="6 4" />
      <rect x="60" y="52" width="280" height="180" rx="6" fill={leatherFill}
            stroke={INK} strokeWidth="1.5" />
      <rect x="60" y="52" width="280" height="180" rx="6" fill={hatch} />
      <line x1="200" y1="52" x2="200" y2="232" stroke={INK} strokeWidth="1" strokeDasharray="5 4" />

      {/* card slots: a column on the inside of the front cover (left half), lower slots in front */}
      {config.cardSlots > 0 &&
        Array.from({ length: config.cardSlots }).map((_, i) => {
          const y = slotTop + i * SLOT_STEP;
          return (
            <g key={i}>
              <rect x={SLOT_X} y={y} width={SLOT_W} height={SLOT_H} rx="3" fill={leatherFill}
                    stroke={INK} strokeWidth="1" />
              <rect x={SLOT_X} y={y} width={SLOT_W} height={SLOT_H} rx="3" fill={hatch} />
              <line x1={SLOT_X + 3} y1={y + 3} x2={SLOT_X + SLOT_W - 3} y2={y + 3}
                    stroke={stitch} strokeWidth="1" strokeDasharray="3 3" />
            </g>
          );
        })}

      {/* inserts on the right half */}
      {Array.from({ length: insertCount }).map((_, i) => (
        <rect key={i} x={212 + i * 6} y={64 + i * 4} width="112" height="156" rx="2"
              fill={PAPER} stroke={INK} strokeWidth="0.9" />
      ))}
      {/* spine elastic that holds the inserts — always there, in the band colour */}
      <line x1="200" y1="46" x2="200" y2="238" stroke={elastic} strokeWidth="2.5" />
      <rect x="72" y="64" width="256" height="156" rx="3" fill="none"
            stroke={stitch} strokeWidth="1.3" strokeDasharray="4 4" />

      {!compact && <Labels parts={parts} />}
      {!compact && (
        <>
          <text x="20" y="252" fontSize="9.5" fill={MUTED}>
            → {dict.shotlist.angleMustShow.open.join(' · ')}
          </text>
          {config.cardSlots > 0 && (
            <text x="20" y="266" fontSize="9.5" fill={MUTED}>
              → {fill(dict.schematic.cardSlots, { count: config.cardSlots })}
            </text>
          )}
          <text x="20" y="286" fontSize="9.5" fontWeight="600" fill={ALERT}>{dict.schematic.note}</text>
        </>
      )}
    </svg>
  );
}
