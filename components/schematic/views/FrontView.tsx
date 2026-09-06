// components/schematic/views/FrontView.tsx
import { angleSpecs, BRASS_HEX } from '@/lib/data';
import { fill } from '@/lib/format';
import { INK, LINE, MUTED } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Labels, Notes, PenLoop, type ViewProps } from '../schematic-parts';

export default function FrontView({ config, compact, parts, dict }: ViewProps) {
  const { fill: leatherFill, hatch, stitch, elastic, hasElastic, hasBuckle, hasPen, embossFont } = parts;

  const notes: string[] = [];
  if (hasElastic) notes.push(dict.schematic.elasticFront);
  if (hasBuckle) notes.push(dict.schematic.buckleFront);
  if (hasPen) notes.push(parts.penLabel);
  if (notes.length === 0) notes.push(...angleSpecs.front.mustShow.slice(0, 3));

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

      {/* elastic band across the front */}
      {hasElastic && (
        <line x1="213" y1="110" x2="213" y2="390" stroke={elastic} strokeWidth="4"
              strokeLinecap="round" />
      )}

      {/* buckle: strap comes around the fore-edge (right) and ends in a brass frame */}
      {hasBuckle && (
        <g>
          <rect x="150" y="238" width="148" height="24" rx="3" fill={leatherFill}
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
      {hasPen && <PenLoop parts={parts} cx={115} />}

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

      {!compact && <Labels parts={parts} />}
      {!compact && <Notes lines={notes} note={dict.schematic.note} />}
    </svg>
  );
}
