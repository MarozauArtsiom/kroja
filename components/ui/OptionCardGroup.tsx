// components/ui/OptionCardGroup.tsx
'use client';

import OptionCard, { type OptionCardProps } from './OptionCard';

export interface OptionCardItem extends Omit<OptionCardProps, 'onSelect' | 'selected'> {}

interface Props {
  label: string;
  items: OptionCardItem[];
  value: string;
  onChange: (value: string) => void;
  /** Tailwind grid columns class, e.g. 'grid-cols-2 md:grid-cols-4' */
  columns?: string;
  /** Below sm every card is a row: visual left, text right. */
  rowOnMobile?: boolean;
}

export default function OptionCardGroup({
  label, items, value, onChange, columns = 'grid-cols-2', rowOnMobile = false,
}: Props) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-2 ${columns}`}>
      {items.map((item) => (
        <OptionCard
          key={item.value}
          {...item}
          selected={item.value === value}
          rowOnMobile={rowOnMobile}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
