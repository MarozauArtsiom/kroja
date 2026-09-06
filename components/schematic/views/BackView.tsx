// components/schematic/views/BackView.tsx
import { INK, LINE, PAPER } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Labels, Notes, PenLoop, type ViewProps } from '../schematic-parts';

export default function BackView({ compact, parts }: ViewProps) {
  const { fill, hatch, stitch, elastic, hasElastic, hasBuckle, hasPen } = parts;

  const notes: string[] = [];
  if (hasElastic) {
    notes.push('elastic knot on the outside — visible on the finished cover');
    notes.push('two holes stay even if the band is ever removed');
  }
  if (hasBuckle) notes.push('strap anchored here, wraps around the fore-edge');
  if (hasPen) notes.push(parts.penLabel);
  if (notes.length === 0) notes.push('no closure — no holes, no hardware');

  return (
    <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
         aria-label={`Technical drawing: ${parts.leatherName} cover in ${parts.colorName}, back view`}>
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

      {hasPen && <PenLoop parts={parts} cx={285} />}

      {!compact && <Labels parts={parts} />}
      {!compact && <Notes lines={notes} />}
    </svg>
  );
}
