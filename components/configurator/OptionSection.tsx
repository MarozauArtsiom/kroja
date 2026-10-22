// components/configurator/OptionSection.tsx
'use client';

import { useId, type ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  title: string;
  /** Collapsible sections show the current choice in one line. Main sections pass nothing. */
  summary?: string;
  /** Price note in the collapsed line, e.g. "+20 zł" or "Included". */
  delta?: string;
  /** true — already in the total (accent); false — what it would cost (muted). */
  deltaActive?: boolean;
  /** Passing onToggle makes the section collapsible. */
  open?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}

export default function OptionSection({
  title,
  summary,
  delta,
  deltaActive = false,
  open = false,
  onToggle,
  children,
}: Props) {
  const panelId = useId();

  if (!onToggle) {
    return (
      <section>
        <h2 className="label mb-3">{title}</h2>
        {children}
      </section>
    );
  }

  return (
    <section className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-14 w-full items-center gap-3 py-3 text-left"
        >
          <span className="label shrink-0">{title}</span>
          <span className="ml-auto min-w-0 truncate text-right text-sm text-ink">{summary}</span>
          {delta && (
            <span className={clsx('shrink-0 text-xs', deltaActive ? 'text-accent' : 'text-muted')}>
              {delta}
            </span>
          )}
          <span
            aria-hidden
            className={clsx(
              'shrink-0 text-lg leading-none text-muted transition-transform duration-150',
              open && 'rotate-45',
            )}
          >
            +
          </span>
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="pb-6">
        {children}
      </div>
    </section>
  );
}
