// components/schematic/views/FrontView.tsx
import { BRASS_HEX } from '@/lib/data';
import { fill } from '@/lib/format';
import { INK, LINE, MUTED } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Band, Hole, Labels, Notes, SPINE, type ViewProps } from '../schematic-parts';

export default function FrontView({ config, compact, parts, dict }: ViewProps) {
  const { fill: leatherFill, hatch, stitch, elastic, hasElastic, hasBuckle, embossFont } = parts;

  // The inner band is always there; the pen loop now lives inside and is drawn on the spread.
  const notes: string[] = [];
  if (hasElastic) notes.push(dict.schematic.elasticFront);
  if (hasBuckle) notes.push(dict.schematic.buckleFront);
  notes.push(dict.schematic.blockBand);

  return (
    <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
         aria-label={fill(dict.schematic.frontAria, { leather: parts.leatherName, color: parts.colorName })}>
      <HatchDefs />
      <rect x="8" y="8" width="384" height="484" fill="none" stroke={LINE}
            strokeWidth="1" strokeDasharray="6 4" />
      {/* cover */}
      <rect x="102" y="110" width="196" height="280" rx="6" fill={leatherFill}
            stroke={INK} strokeWidth="1.5" />
      <rect x="102" y="110" width="196" height="280" rx="6" fill={hatch} />
      {/* spine fold */}
      <line x1="128" y1="110" x2="128" y2="390" stroke={INK} strokeWidth="0.8"
            strokeDasharray="4 4" opacity="0.5" />
      {/* stitch line */}
      <rect x="114" y="122" width="172" height="256" rx="3" fill="none"
            stroke={stitch} strokeWidth="1.4" strokeDasharray="4 4" />

      {/* inner band: runs along the spine between holes at the head and tail. Always there. */}
      <Band x1={SPINE.blockBandX} y1={SPINE.blockHoleY[0]} x2={SPINE.blockBandX} y2={SPINE.blockHoleY[1]}
            color={elastic} width={2.4} />
      <Hole cx={SPINE.blockBandX} cy={SPINE.blockHoleY[0]} />
      <Hole cx={SPINE.blockBandX} cy={SPINE.blockHoleY[1]} />

      {/* closing band: two strands across the cover, out of two holes in the spine at mid-height */}
      {hasElastic && (
        <g>
          {SPINE.closeHoleY.map((y) => (
            <Band key={y} x1={SPINE.closeHoleX} y1={y} x2={298} y2={y} color={elastic} />
          ))}
          {SPINE.closeHoleY.map((y) => (
            <Hole key={y} cx={SPINE.closeHoleX} cy={y} />
          ))}
        </g>
      )}

      {/* buckle: a short tongue, about 2.5 cm, out from behind the fore-edge; brass frame on its end */}
      {hasBuckle && (
        <g>
          <rect x="266" y="238" width="32" height="24" rx="3" fill={leatherFill}
                stroke={INK} strokeWidth="1.2" />
          <rect x="266" y="238" width="32" height="24" rx="3" fill={hatch} />
          <line x1="279" y1="244" x2="294" y2="244" stroke={stitch} strokeWidth="1"
                strokeDasharray="3 3" />
          <line x1="279" y1="256" x2="294" y2="256" stroke={stitch} strokeWidth="1"
                strokeDasharray="3 3" />
          <rect x="252" y="230" width="24" height="40" rx="4" fill="none"
                stroke={BRASS_HEX} strokeWidth="3.5" />
          <line x1="264" y1="230" x2="264" y2="270" stroke={BRASS_HEX} strokeWidth="2.5"
                strokeLinecap="round" />
        </g>
      )}

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
        <text x="113" y="330" transform="rotate(-90 113 330)" textAnchor="middle"
              fontSize="14" letterSpacing="2" fill={INK} opacity="0.75" fontFamily={embossFont}>
          {config.embossing.text}
        </text>
      )}

      {!compact && <Labels parts={parts} />}
      {!compact && <Notes lines={notes} note={dict.schematic.note} />}
    </svg>
  );
}
