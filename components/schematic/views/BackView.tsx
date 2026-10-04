// components/schematic/views/BackView.tsx
import { fill } from '@/lib/format';
import { INK, LINE } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Band, Hole, Labels, Notes, SPINE, type ViewProps } from '../schematic-parts';

/** The back view is the front mirrored: the spine is on the right. */
const mirror = (x: number) => 400 - x;

export default function BackView({ compact, parts, dict }: ViewProps) {
  const { fill: leatherFill, hatch, stitch, elastic, hasElastic, hasBuckle } = parts;

  const notes: string[] = [];
  if (hasElastic) notes.push(dict.schematic.spineHoles);
  if (hasBuckle) notes.push(dict.schematic.buckleBack, dict.schematic.blockBand);
  if (!hasElastic && !hasBuckle) notes.push(dict.schematic.noClosure);

  const closeX = mirror(SPINE.closeHoleX);
  const blockX = mirror(SPINE.blockBandX);

  return (
    <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
         aria-label={fill(dict.schematic.backAria, { leather: parts.leatherName, color: parts.colorName })}>
      <HatchDefs />
      <rect x="8" y="8" width="384" height="484" fill="none" stroke={LINE}
            strokeWidth="1" strokeDasharray="6 4" />
      {/* cover — mirrored: spine on the right */}
      <rect x="102" y="110" width="196" height="280" rx="6" fill={leatherFill}
            stroke={INK} strokeWidth="1.5" />
      <rect x="102" y="110" width="196" height="280" rx="6" fill={hatch} />
      <line x1="272" y1="110" x2="272" y2="390" stroke={INK} strokeWidth="0.8"
            strokeDasharray="4 4" opacity="0.5" />
      <rect x="114" y="122" width="172" height="256" rx="3" fill="none"
            stroke={stitch} strokeWidth="1.4" strokeDasharray="4 4" />

      {/* inner band along the spine, holes at the head and tail. Always there. */}
      <Band x1={blockX} y1={SPINE.blockHoleY[0]} x2={blockX} y2={SPINE.blockHoleY[1]}
            color={elastic} width={2.4} />
      <Hole cx={blockX} cy={SPINE.blockHoleY[0]} />
      <Hole cx={blockX} cy={SPINE.blockHoleY[1]} />

      {/* closing band: from the two mid-height holes in the spine across to the fore-edge */}
      {hasElastic && (
        <g>
          {SPINE.closeHoleY.map((y) => (
            <Band key={y} x1={102} y1={y} x2={closeX} y2={y} color={elastic} />
          ))}
          {SPINE.closeHoleY.map((y) => (
            <Hole key={y} cx={closeX} cy={y} />
          ))}
        </g>
      )}

      {/* buckle: the short strap is anchored at the fore-edge with a box stitch */}
      {hasBuckle && (
        <g>
          <rect x="102" y="238" width="32" height="24" rx="3" fill={leatherFill}
                stroke={INK} strokeWidth="1.2" />
          <rect x="102" y="238" width="32" height="24" rx="3" fill={hatch} />
          <rect x="110" y="241" width="18" height="18" fill="none" stroke={stitch}
                strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="110" y1="241" x2="128" y2="259" stroke={stitch} strokeWidth="1"
                strokeDasharray="2 2" />
          <line x1="128" y1="241" x2="110" y2="259" stroke={stitch} strokeWidth="1"
                strokeDasharray="2 2" />
        </g>
      )}

      {!compact && <Labels parts={parts} />}
      {!compact && <Notes lines={notes} note={dict.schematic.note} />}
    </svg>
  );
}
