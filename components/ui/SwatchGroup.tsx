// components/ui/SwatchGroup.tsx
'use client';

import { useRef } from 'react';
import Swatch, { type SwatchProps } from './Swatch';

export interface SwatchItem extends Omit<SwatchProps, 'onSelect' | 'selected'> {}

interface Props {
  label: string;
  items: SwatchItem[];
  value: string;
  onChange: (value: string) => void;
}

export default function SwatchGroup({ label, items, value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Arrow-key navigation inside the radio group.
  function handleKeyDown(e: React.KeyboardEvent) {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const selectable = items.filter((i) => i.state !== 'disabled');
    const currentIndex = selectable.findIndex((i) => i.value === value);
    if (currentIndex === -1) return;

    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const nextIndex = forward
      ? (currentIndex + 1) % selectable.length
      : (currentIndex - 1 + selectable.length) % selectable.length;

    onChange(selectable[nextIndex].value);
    // Move focus to the newly selected swatch.
    requestAnimationFrame(() => {
      const buttons = ref.current?.querySelectorAll('button');
      buttons?.[items.findIndex((i) => i.value === selectable[nextIndex].value)]?.focus();
    });
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => (
        <Swatch
          key={item.value}
          {...item}
          selected={item.value === value}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
