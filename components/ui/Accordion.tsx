// components/ui/Accordion.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';

export interface AccordionItem {
  id: string;
  title: string;
  body: string;
}

interface Props {
  items: AccordionItem[];
  /** Called when an item opens. Used for analytics later. */
  onOpen?: (id: string) => void;
}

export default function Accordion({ items, onOpen }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next && onOpen) onOpen(next);
  }

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`panel-${item.id}`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-base text-ink">{item.title}</span>
              <span
                aria-hidden
                className={clsx(
                  'shrink-0 text-xl leading-none text-muted transition-transform duration-150',
                  open && 'rotate-45',
                )}
              >
                +
              </span>
            </button>
            <div
              id={`panel-${item.id}`}
              hidden={!open}
              className="max-w-prose pb-5 text-sm leading-relaxed text-ink-soft"
            >
              {item.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
