// components/schematic/SchematicCover.tsx
import type { Configuration, Angle } from '@/types/config';
import { leathers, colors, threads, angleSpecs, NOT_IN_FRAME } from '@/lib/data';
import { previewFilename } from '@/lib/assets';
import type { HatchPattern } from '@/content/leathers';

interface Props {
  config: Configuration;
  angle: Angle;
  /** Small thumbnail: hide callouts, labels and file name */
  compact?: boolean;
}

const INK = '#1C1917';
const LINE = '#DED5C7';
const ALERT = '#A63D2F';
const MUTED = '#8A7F72';
const PAPER = '#FAF7F2';

const hatchId: Record<HatchPattern, string> = {
  'diagonal-fine': 'hatch-fine',
  'diagonal-coarse': 'hatch-coarse',
  'cross-hatch': 'hatch-cross',
};

/** Shared hatch patterns. Rendered inside every schematic SVG. */
function HatchDefs({ scale = 1 }: { scale?: number }) {
  return (
    <defs>
      <pattern id="hatch-fine" width={4 * scale} height={4 * scale}
               patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2={4 * scale} stroke={INK}
              strokeWidth={0.5 * scale} opacity="0.35" />
      </pattern>
      <pattern id="hatch-coarse" width={9 * scale} height={9 * scale}
               patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2={9 * scale} stroke={INK}
              strokeWidth={1.4 * scale} opacity="0.4" />
      </pattern>
      <pattern id="hatch-cross" width={7 * scale} height={7 * scale} patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2={7 * scale} y2={7 * scale} stroke={INK}
              strokeWidth={0.7 * scale} opacity="0.32" />
        <line x1={7 * scale} y1="0" x2="0" y2={7 * scale} stroke={INK}
              strokeWidth={0.7 * scale} opacity="0.32" />
      </pattern>
    </defs>
  );
}

export default function SchematicCover({ config, angle, compact = false }: Props) {
  const leather = leathers[config.leather];
  const color = colors[config.color];
  const thread = threads[config.thread];
  const spec = angleSpecs[angle];
  const hatch = `url(#${hatchId[leather.schematicHatch]})`;
  const fill = color.hex;
  const stitch = thread.hex;
  const insertCount = Math.min(
    4,
    Math.max(1, config.inserts.reduce((sum, i) => sum + i.qty, 0)),
  );

  const labels = !compact && (
    <>
      <rect x="20" y="20" width="14" height="14" fill={fill} stroke={INK} strokeWidth="0.8" />
      <text x="42" y="31" fontSize="11" fill={INK}>{color.name}</text>
      <text x="20" y="50" fontSize="10" fill={MUTED}>{leather.name}</text>
    </>
  );

  return (
    <div className="w-full">
      {angle === 'front' && (
        <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
             aria-label={`Technical drawing: ${leather.name} cover in ${color.name}, front view`}>
          <HatchDefs />
          <rect x="8" y="8" width="384" height="484" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          <rect x="102" y="110" width="196" height="280" rx="6" fill={fill}
                stroke={INK} strokeWidth="1.5" />
          <rect x="102" y="110" width="196" height="280" rx="6" fill={hatch} />
          <line x1="128" y1="110" x2="128" y2="390" stroke={INK} strokeWidth="0.8"
                strokeDasharray="4 4" opacity="0.5" />
          <rect x="114" y="122" width="172" height="256" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.4" strokeDasharray="4 4" />
          {config.engraving && (
            <>
              <rect x="198" y="330" width="76" height="28" fill="none" stroke={MUTED}
                    strokeWidth="1" strokeDasharray="2 2" />
              <text x="236" y="349" textAnchor="middle" fontSize="11" fill={MUTED}
                    fontFamily={config.engraving.font === 'serif' ? 'Georgia, serif' : 'sans-serif'}>
                {config.engraving.text}
              </text>
            </>
          )}
          {labels}
          {!compact && (
            <>
              {spec.mustShow.slice(0, 3).map((item, i) => (
                <text key={item} x="20" y={416 + i * 13} fontSize="9.5" fill={MUTED}>
                  → must show: {item}
                </text>
              ))}
              <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{NOT_IN_FRAME}</text>
            </>
          )}
        </svg>
      )}

      {angle === 'open' && (
        <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img"
             aria-label={`Technical drawing: ${leather.name} cover in ${color.name}, opened flat`}>
          <HatchDefs />
          <rect x="8" y="8" width="384" height="284" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          <rect x="60" y="52" width="280" height="180" rx="6" fill={fill}
                stroke={INK} strokeWidth="1.5" />
          <rect x="60" y="52" width="280" height="180" rx="6" fill={hatch} />
          <line x1="200" y1="52" x2="200" y2="232" stroke={INK} strokeWidth="1" strokeDasharray="5 4" />
          {Array.from({ length: insertCount }).map((_, i) => (
            <rect key={i} x={212 + i * 6} y={64 + i * 4} width="112" height="156" rx="2"
                  fill={PAPER} stroke={INK} strokeWidth="0.9" />
          ))}
          <line x1="200" y1="46" x2="200" y2="238" stroke={stitch} strokeWidth="2.5" />
          <rect x="72" y="64" width="256" height="156" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.3" strokeDasharray="4 4" />
          {labels}
          {!compact && (
            <>
              <text x="20" y="256" fontSize="9.5" fill={MUTED}>
                → must show: {spec.mustShow.join(' · ')}
              </text>
              <text x="20" y="278" fontSize="9.5" fontWeight="600" fill={ALERT}>{NOT_IN_FRAME}</text>
            </>
          )}
        </svg>
      )}

      {angle === 'detail' && (
        <svg viewBox="0 0 400 400" className="block h-auto w-full" role="img"
             aria-label={`Macro technical drawing: ${leather.name} stitched corner`}>
          <HatchDefs scale={2} />
          <rect x="8" y="8" width="384" height="384" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          <rect x="96" y="96" width="400" height="400" rx="14" fill={fill}
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
              <text x="20" y="292" fontSize="9.5" fill={MUTED}>burnished edge</text>
              <line x1="40" y1="236" x2="132" y2="236" stroke={MUTED} strokeWidth="0.9" />
              <text x="20" y="228" fontSize="9.5" fill={MUTED}>stitch density</text>
              <text x="20" y="372" fontSize="9.5" fontWeight="600" fill={ALERT}>{NOT_IN_FRAME}</text>
            </>
          )}
          {labels}
        </svg>
      )}

      {!compact && (
        <p className="mt-2 text-center font-mono text-[11px] text-muted">
          {previewFilename(config.leather, config.color, angle)}
        </p>
      )}
    </div>
  );
}
