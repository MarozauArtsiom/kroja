// components/landing/Sizes.tsx
'use client';

import Link from 'next/link';
import { sizeList } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDimensions, formatPrice, formatWeight } from '@/lib/format';
import SizeDiagram from '@/components/schematic/SizeDiagram';

export default function Sizes() {
  const { dict, getLocalizedPath } = useI18n();

  return (
    <section id="sizes" className="section">
      <div className="container-content">
        <h2 className="mb-2">{dict.sizes.title}</h2>
        <p className="mb-10 max-w-prose text-ink-soft">{dict.sizes.subtitle}</p>

        <div className="mb-12 rounded-sm border border-line p-6">
          <SizeDiagram active="a5" mode="compare" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sizeList.map((s) => (
            <Link
              key={s.code}
              href={getLocalizedPath(`/configurator?size=${s.code}`)}
              className="group flex flex-col rounded-sm border border-line p-5 transition-colors hover:border-ink"
            >
              <h3 className="mb-1 text-lg">{s.name}</h3>
              <p className="mb-3 text-sm text-muted">{formatDimensions(s.coverMm)}</p>
              <p className="mb-4 flex-1 text-sm text-ink-soft">
                {dict.sizes.useCases[s.code] || s.useCase}
              </p>
              <dl className="mb-4 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <dt>{dict.sizes.capacity}</dt>
                  <dd>
                    {s.insertCapacity} {dict.sizes.inserts}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>{dict.sizes.weight}</dt>
                  <dd>{formatWeight(s.weightG)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{dict.sizes.cardSlots}</dt>
                  <dd>
                    {dict.sizes.upTo} {s.cardSlotsMax}
                  </dd>
                </div>
              </dl>
              <p className="text-sm text-ink">
                {formatPrice(s.basePriceMinor)}
                <span className="ml-2 text-accent underline underline-offset-4 group-hover:no-underline">
                  {dict.sizes.build}
                </span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
