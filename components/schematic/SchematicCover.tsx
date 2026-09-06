// components/schematic/SchematicCover.tsx
import type { Configuration, Angle } from '@/types/config';
import {
  leathers,
  colors,
  threadHex,
  elasticColors,
  penHolders,
  angleSpecs,
  SCHEMATIC_NOTE,
  BRASS_HEX,
} from '@/lib/data';
import { previewFilename } from '@/lib/assets';
import HatchDefs, { hatchUrl } from './HatchDefs';
import { INK, LINE, ALERT, MUTED, PAPER } from '@/lib/schematic-tokens';

interface Props {
  config: Configuration;
  angle: Angle;
  /** Small thumbnail: hide callouts, labels and file name */
  compact?: boolean;
}

/** Pen radius in drawing units. The wide loop must be visibly bigger than the slim one. */
const PEN_RADIUS = { slim: 7, wide: 9 } as const;

/** Card slot geometry in the 'open' view: card 85.6 × 54 mm drawn as 100 × 63, stacked with a 16 step. */
const SLOT_W = 100;
const SLOT_H = 63;
const SLOT_STEP = 16;
const SLOT_X = 80;
const SLOT_BOTTOM = 220;

export default function SchematicCover({ config, angle, compact = false }: Props) {
  const leather = leathers[config.leather];
  const color = colors[config.color];
  const spec = angleSpecs[angle];
  const hatch = hatchUrl(leather.schematicHatch);
  const fill = color.hex;
  const stitch = threadHex(config.thread, color.hex);
  const elastic = elasticColors[config.elasticColor].hex;
  const hasElastic = config.closure === 'elastic';
  const hasBuckle = config.closure === 'buckle';
  const hasPen = config.penHolder !== 'none';
  const penR = config.penHolder === 'wide' ? PEN_RADIUS.wide : PEN_RADIUS.slim;
  const penDef = penHolders[config.penHolder];
  const penLabel =
    config.penHolder === 'wide'
      ? `pen loop Ø ${penDef.minMm}–${penDef.maxMm} mm`
      : `pen loop Ø up to ${penDef.maxMm} mm`;
  const embossFont =
    config.embossing?.font === 'sans' ? 'Inter, system-ui, sans-serif' : 'Georgia, serif';
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

  /** A pen sitting in its loop on a spine strip centred at x = cx (front and back views). */
  const penLoop = (cx: number) => (
    <g>
      <rect x={cx - penR} y="196" width={penR * 2} height="108" rx={penR}
            fill={PAPER} stroke={INK} strokeWidth="1.2" />
      <rect x={cx - penR - 4} y="238" width={penR * 2 + 8} height="20" rx="3"
            fill={fill} stroke={INK} strokeWidth="1.2" />
      <rect x={cx - penR - 4} y="238" width={penR * 2 + 8} height="20" rx="3" fill={hatch} />
    </g>
  );

  /** Callout lines under the drawing in the 400×500 views. Max three lines. */
  const notes = (lines: string[]) =>
    !compact && (
      <>
        {lines.slice(0, 3).map((line, i) => (
          <text key={line} x="20" y={416 + i * 13} fontSize="9.5" fill={MUTED}>
            → {line}
          </text>
        ))}
        <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
      </>
    );

  const frontNotes: string[] = [];
  if (hasElastic) frontNotes.push('elastic band runs around the cover; knot is on the back');
  if (hasBuckle) frontNotes.push('solid brass buckle, strap in the cover leather');
  if (hasPen) frontNotes.push(penLabel);
  if (frontNotes.length === 0) frontNotes.push(...spec.mustShow.slice(0, 3));

  const backNotes: string[] = [];
  if (hasElastic) {
    backNotes.push('elastic knot on the outside — visible on the finished cover');
    backNotes.push('two holes stay even if the band is ever removed');
  }
  if (hasBuckle) backNotes.push('strap anchored here, wraps around the fore-edge');
  if (hasPen) backNotes.push(penLabel);
  if (backNotes.length === 0) backNotes.push('no closure — no holes, no hardware');

  return (
    <div className="w-full">
      {angle === 'front' && (
        <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
             aria-label={`Technical drawing: ${leather.name} cover in ${color.name}, front view`}>
          <HatchDefs />
          <rect x="8" y="8" width="384" height="484" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          {/* cover */}
          <rect x="102" y="110" width="196" height="280" rx="6" fill={fill}
                stroke={INK} strokeWidth="1.5" />
          <rect x="102" y="110" width="196" height="280" rx="6" fill={hatch} />
          {/* spine fold */}
          <line x1="128" y1="110" x2="128" y2="390" stroke={INK} strokeWidth="0.8"
                strokeDasharray="4 4" opacity="0.5" />
          {/* stitch line */}
          <rect x="114" y="122" width="172" height="256" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.4" strokeDasharray="4 4" />

          {/* elastic band across the front */}
          {hasElastic && (
            <line x1="213" y1="110" x2="213" y2="390" stroke={elastic} strokeWidth="4"
                  strokeLinecap="round" />
          )}

          {/* buckle: strap comes around the fore-edge (right) and ends in a brass frame */}
          {hasBuckle && (
            <g>
              <rect x="150" y="238" width="148" height="24" rx="3" fill={fill}
                    stroke={INK} strokeWidth="1.2" />
              <rect x="150" y="238" width="148" height="24" rx="3" fill={hatch} />
              <line x1="172" y1="244" x2="292" y2="244" stroke={stitch} strokeWidth="1"
                    strokeDasharray="3 3" />
              <line x1="172" y1="256" x2="292" y2="256" stroke={stitch} strokeWidth="1"
                    strokeDasharray="3 3" />
              <rect x="144" y="230" width="26" height="40" rx="4" fill="none"
                    stroke={BRASS_HEX} strokeWidth="3.5" />
              <line x1="157" y1="230" x2="157" y2="270" stroke={BRASS_HEX} strokeWidth="2.5"
                    strokeLinecap="round" />
            </g>
          )}

          {/* pen loop on the spine strip */}
          {hasPen && penLoop(115)}

          {/* embossing */}
          {config.embossing && config.embossing.position === 'bottom-right' && (
            <g>
              <rect x="214" y="322" width="60" height="42" fill="none" stroke={MUTED}
                    strokeWidth="1" strokeDasharray="2 2" />
              <text x="244" y="352" textAnchor="middle" fontSize="22" letterSpacing="2"
                    fill={INK} opacity="0.75" fontFamily={embossFont}>
                {config.embossing.text}
              </text>
            </g>
          )}
          {config.embossing && config.embossing.position === 'spine' && (
            <text x="115" y="340" transform="rotate(-90 115 340)" textAnchor="middle"
                  fontSize="14" letterSpacing="2" fill={INK} opacity="0.75" fontFamily={embossFont}>
              {config.embossing.text}
            </text>
          )}

          {labels}
          {notes(frontNotes)}
        </svg>
      )}

      {angle === 'back' && (
        <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
             aria-label={`Technical drawing: ${leather.name} cover in ${color.name}, back view`}>
          <HatchDefs />
          <rect x="8" y="8" width="384" height="484" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          {/* cover — mirrored: spine on the right */}
          <rect x="102" y="110" width="196" height="280" rx="6" fill={fill}
                stroke={INK} strokeWidth="1.5" />
          <rect x="102" y="110" width="196" height="280" rx="6" fill={hatch} />
          <line x1="272" y1="110" x2="272" y2="390" stroke={INK} strokeWidth="0.8"
                strokeDasharray="4 4" opacity="0.5" />
          <rect x="114" y="122" width="172" height="256" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.4" strokeDasharray="4 4" />

          {/* elastic: two holes, the band, the knot with two tails */}
          {hasElastic && (
            <g>
              <line x1="187" y1="110" x2="187" y2="228" stroke={elastic} strokeWidth="4"
                    strokeLinecap="round" />
              <line x1="187" y1="272" x2="187" y2="390" stroke={elastic} strokeWidth="4"
                    strokeLinecap="round" />
              <circle cx="187" cy="232" r="4.5" fill={PAPER} stroke={INK} strokeWidth="1" />
              <circle cx="187" cy="268" r="4.5" fill={PAPER} stroke={INK} strokeWidth="1" />
              <line x1="187" y1="232" x2="187" y2="268" stroke={elastic} strokeWidth="4" />
              <line x1="187" y1="250" x2="174" y2="262" stroke={elastic} strokeWidth="3"
                    strokeLinecap="round" />
              <line x1="187" y1="250" x2="201" y2="261" stroke={elastic} strokeWidth="3"
                    strokeLinecap="round" />
              <circle cx="187" cy="250" r="7" fill={elastic} stroke={INK} strokeWidth="1" />
            </g>
          )}

          {/* buckle: strap root, box-stitched near the spine, running to the fore-edge (left) */}
          {hasBuckle && (
            <g>
              <rect x="102" y="238" width="150" height="24" rx="3" fill={fill}
                    stroke={INK} strokeWidth="1.2" />
              <rect x="102" y="238" width="150" height="24" rx="3" fill={hatch} />
              <line x1="108" y1="244" x2="230" y2="244" stroke={stitch} strokeWidth="1"
                    strokeDasharray="3 3" />
              <line x1="108" y1="256" x2="230" y2="256" stroke={stitch} strokeWidth="1"
                    strokeDasharray="3 3" />
              <rect x="232" y="240" width="18" height="20" fill="none" stroke={stitch}
                    strokeWidth="1.2" strokeDasharray="2 2" />
            </g>
          )}

          {hasPen && penLoop(285)}

          {labels}
          {notes(backNotes)}
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

          {/* card slots: a column on the inside of the front cover (left half), lower slots in front */}
          {config.cardSlots > 0 &&
            Array.from({ length: config.cardSlots }).map((_, i) => {
              const top = SLOT_BOTTOM - SLOT_H - (config.cardSlots - 1) * SLOT_STEP;
              const y = top + i * SLOT_STEP;
              return (
                <g key={i}>
                  <rect x={SLOT_X} y={y} width={SLOT_W} height={SLOT_H} rx="3" fill={fill}
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
          {labels}
          {!compact && (
            <>
              <text x="20" y="252" fontSize="9.5" fill={MUTED}>
                → {spec.mustShow.join(' · ')}
              </text>
              {config.cardSlots > 0 && (
                <text x="20" y="266" fontSize="9.5" fill={MUTED}>
                  → card slots × {config.cardSlots}, inside the front cover
                </text>
              )}
              <text x="20" y="286" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
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
              <text x="20" y="228" fontSize="9.5" fill={MUTED}>0.5 mm thread, saddle stitch</text>
              <text x="20" y="372" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
            </>
          )}
          {labels}
        </svg>
      )}

      {!compact && angle !== 'back' && (
        <p className="mt-2 text-center font-mono text-[11px] text-muted">
          {previewFilename(config.leather, config.color, angle)}
        </p>
      )}
    </div>
  );
}
