// components/schematic/views/OpenView.tsx
import type { Flap, Pocket } from '@/types/config';
import { pockets as pocketDefs } from '@/lib/data';
import { fill } from '@/lib/format';
import { pocketBudgetMm, pocketSpans } from '@/lib/pockets';
import type { Dictionary } from '@/types/i18n';
import { INK, LINE, MUTED, ALERT, PAPER } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Band, Labels, PenLoop, type SchematicParts, type ViewProps } from '../schematic-parts';

/**
 * Working area inside the stitch line, in drawing units. Pockets stack up from AREA_BOTTOM.
 * The vertical scale maps the size's height budget onto AREA_TOP..AREA_BOTTOM, so a pocket
 * looks as big on the drawing as it is relative to that notebook.
 */
const AREA_TOP = 64;
const AREA_BOTTOM = 220;

/** Front flap = left half, back flap = right half. Pen loop sits at the front flap's fore-edge. */
const FRONT = { left: 76, right: 192 };
const BACK = { left: 208, right: 328 };
const PEN_LEFT = 72;
const SPINE_X = 200;
const BLOCK_HOLES = [60, 224] as const;

function PocketStack({
  stack,
  flap,
  left,
  right,
  scale,
  parts,
}: {
  stack: Pocket[];
  flap: Flap;
  left: number;
  right: number;
  scale: number;
  parts: SchematicParts;
}) {
  const { fill: leatherFill, hatch, stitch } = parts;
  const spans = pocketSpans(stack);
  const width = right - left;

  // Topmost first, so each lower pocket is drawn over the one above it — as it is sewn.
  const order = stack.map((_, i) => i).reverse();

  return (
    <g>
      {order.map((i) => {
        const pocket = stack[i];
        const yTop = AREA_BOTTOM - spans[i].topMm * scale;
        const yBottom = AREA_BOTTOM - spans[i].bottomMm * scale;

        if (pocket.kind === 'corner') {
          // A triangle at the outer bottom corner: fore-edge is left on the front flap, right on the back.
          const leg = pocketDefs.corner.heightMm * scale;
          const x0 = flap === 'front' ? left : right;
          const dir = flap === 'front' ? 1 : -1;
          const d = `M ${x0} ${yBottom} L ${x0} ${yBottom - leg} L ${x0 + dir * leg} ${yBottom} Z`;
          return (
            <g key={i}>
              <path d={d} fill={leatherFill} stroke={INK} strokeWidth="1" />
              <path d={d} fill={hatch} />
              <path
                d={`M ${x0 + dir * 3} ${yBottom - leg + 6} L ${x0 + dir * 3} ${yBottom - 3} L ${x0 + dir * (leg - 6)} ${yBottom - 3}`}
                fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="3 3"
              />
            </g>
          );
        }

        const h = yBottom - yTop;
        return (
          <g key={i}>
            <rect x={left} y={yTop} width={width} height={h} rx="2" fill={leatherFill}
                  stroke={INK} strokeWidth="1" />
            <rect x={left} y={yTop} width={width} height={h} rx="2" fill={hatch} />
            {/* stitched on three sides; the top edge is the open fold */}
            <path
              d={`M ${left + 3} ${yTop + 4} L ${left + 3} ${yBottom - 3} L ${left + width - 3} ${yBottom - 3} L ${left + width - 3} ${yTop + 4}`}
              fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="3 3"
            />
            {/* The split is a seam the customer chose: an ink crease under the stitch keeps it
                visible even when the thread matches the leather. */}
            {pocket.divided && (
              <g>
                <line x1={left + width / 2} y1={yTop + 2} x2={left + width / 2} y2={yBottom - 2}
                      stroke={INK} strokeWidth="1" opacity="0.55" />
                <line x1={left + width / 2 + 2} y1={yTop + 4} x2={left + width / 2 + 2} y2={yBottom - 3}
                      stroke={stitch} strokeWidth="1" strokeDasharray="3 3" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function stackLabel(stack: Pocket[], dict: Dictionary): string {
  return stack
    .map((p) =>
      p.divided
        ? `${dict.options.pockets[p.kind].title} (${dict.configurator.pocketsDivide.toLowerCase()})`
        : dict.options.pockets[p.kind].title,
    )
    .join(', ');
}

export default function OpenView({ config, compact, parts, dict }: ViewProps) {
  const { fill: leatherFill, hatch, stitch, elastic, insertCount, hasPen, penR } = parts;
  const scale = (AREA_BOTTOM - AREA_TOP) / pocketBudgetMm(config.size);
  const front = config.pockets.front;
  const back = config.pockets.back;

  // With a pen loop at the fore-edge the front pockets start further in.
  const frontLeft = hasPen ? PEN_LEFT + penR * 2 + 6 : FRONT.left;

  const notes: string[] = [];
  if (hasPen) notes.push(parts.penLabel);
  if (front.length > 0) {
    notes.push(fill(dict.schematic.pocketsOn, { flap: dict.options.flaps.front, list: stackLabel(front, dict) }));
  }
  if (back.length > 0) {
    notes.push(fill(dict.schematic.pocketsOn, { flap: dict.options.flaps.back, list: stackLabel(back, dict) }));
  }
  if (notes.length === 0) notes.push(dict.shotlist.angleMustShow.open.join(' · '));

  return (
    <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img"
         aria-label={fill(dict.schematic.openAria, { leather: parts.leatherName, color: parts.colorName })}>
      <HatchDefs />
      <rect x="8" y="8" width="384" height="284" fill="none" stroke={LINE}
            strokeWidth="1" strokeDasharray="6 4" />
      <rect x="60" y="52" width="280" height="180" rx="6" fill={leatherFill}
            stroke={INK} strokeWidth="1.5" />
      <rect x="60" y="52" width="280" height="180" rx="6" fill={hatch} />
      <line x1={SPINE_X} y1="52" x2={SPINE_X} y2="232" stroke={INK} strokeWidth="1" strokeDasharray="5 4" />
      <rect x="72" y="64" width="256" height="156" rx="3" fill="none"
            stroke={stitch} strokeWidth="1.3" strokeDasharray="4 4" />

      {/* front flap: pen loop at the fore-edge, pockets next to it */}
      {hasPen && <PenLoop parts={parts} cx={PEN_LEFT + penR} top={76} length={132} />}
      <PocketStack stack={front} flap="front" left={frontLeft} right={FRONT.right}
                   scale={scale} parts={parts} />

      {/* back flap pockets sit under the inserts; the inserts turn to outlines so they stay visible */}
      <PocketStack stack={back} flap="back" left={BACK.left} right={BACK.right}
                   scale={scale} parts={parts} />
      {Array.from({ length: insertCount }).map((_, i) => (
        <rect key={i} x={212 + i * 6} y={64 + i * 4} width="112" height="156" rx="2"
              fill={back.length > 0 ? 'none' : PAPER} stroke={INK} strokeWidth="0.9"
              strokeDasharray={back.length > 0 ? '4 3' : undefined} />
      ))}

      {/* inner band along the spine, between the holes at the head and tail; holds the inserts */}
      <Band x1={SPINE_X} y1={BLOCK_HOLES[0]} x2={SPINE_X} y2={BLOCK_HOLES[1]} color={elastic} width={2.4} />
      {BLOCK_HOLES.map((y) => (
        <circle key={y} cx={SPINE_X} cy={y} r="3.4" fill="none" stroke={INK} strokeWidth="1" />
      ))}

      {!compact && <Labels parts={parts} />}
      {!compact && (
        <>
          {notes.slice(0, 3).map((line, i) => (
            <text key={line} x="20" y={248 + i * 12} fontSize="9.5" fill={MUTED}>
              → {line}
            </text>
          ))}
          <text x="20" y="288" fontSize="9.5" fontWeight="600" fill={ALERT}>{dict.schematic.note}</text>
        </>
      )}
    </svg>
  );
}
