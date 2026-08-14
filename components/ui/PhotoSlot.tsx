// components/ui/PhotoSlot.tsx
import clsx from 'clsx';

export interface PhotoSlotSpec {
  id: string;
  /** CSS aspect-ratio, e.g. '4 / 5' */
  ratio: string;
  subject: string;
  requirement: string;
  why: string;
}

interface Props extends PhotoSlotSpec {
  className?: string;
}

export default function PhotoSlot({
  id, ratio, subject, requirement, why, className,
}: Props) {
  return (
    <figure
      data-photo-slot={id}
      style={{ aspectRatio: ratio }}
      className={clsx(
        'flex flex-col justify-between border border-dashed border-line bg-paper-2 p-4',
        className,
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{id}</span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink">{subject}</p>
        <p className="text-xs text-ink-soft">{requirement}</p>
        <p className="text-xs italic text-muted">{why}</p>
      </div>
    </figure>
  );
}
