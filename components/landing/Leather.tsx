// components/landing/Leather.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { LeatherCode } from '@/types/config';
import { leatherList, leathers, copy } from '@/lib/data';
import { DEFAULT_CONFIG } from '@/lib/config-schema';
import SchematicCover from '@/components/schematic/SchematicCover';
import { formatThickness } from '@/lib/format';
import Accordion from '@/components/ui/Accordion';
import clsx from 'clsx';

function Scale({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="flex gap-1" aria-label={`${label}: ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={clsx('h-2 w-2 rounded-full', n <= value ? 'bg-ink' : 'bg-line')}
          />
        ))}
      </span>
    </div>
  );
}

export default function Leather() {
  const [active, setActive] = useState<LeatherCode>('veg-tan');
  const l = leathers[active];

  return (
    <section id="leather" className="section">
      <div className="container-content">
        <h2 className="mb-2">{copy.leather.title}</h2>
        <p className="mb-10 max-w-prose text-ink-soft">{copy.leather.subtitle}</p>

        {/* Tabs */}
        <div role="tablist" aria-label="Leather types" className="mb-8 flex flex-wrap gap-2">
          {leatherList.map((item) => (
            <button
              key={item.code}
              role="tab"
              aria-selected={active === item.code}
              onClick={() => setActive(item.code)}
              className={clsx(
                'h-11 rounded-sm border px-5 text-sm transition-colors',
                active === item.code ? 'border-ink bg-paper-2 text-ink' : 'border-line text-muted hover:border-ink-soft',
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-sm border border-line bg-paper-2 p-6">
            <SchematicCover
              config={{ ...DEFAULT_CONFIG, leather: active, color: leathers[active].availableColors[0] }}
              angle="detail"
              compact
            />
            <p className="mt-3 text-center text-xs text-muted">
              Schematic hatch, not a photograph of the actual grain.
            </p>
          </div>

          <div>
            <p className="mb-6 text-ink-soft">{l.description}</p>

            <dl className="mb-6 space-y-1 border-y border-line py-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">{copy.leather.origin}</dt><dd>{l.origin}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Tanning</dt><dd>{l.tanning}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">{copy.leather.thickness}</dt><dd>{formatThickness(l.thicknessMm)}</dd></div>
            </dl>

            <div className="mb-6">
              <Scale value={l.scratchResistance} label={copy.leather.scratchResistance} />
              <Scale value={l.patinaSpeed} label={copy.leather.patinaSpeed} />
              <Scale value={l.softness} label={copy.leather.softness} />
            </div>

            <h3 className="mb-3 text-base">{copy.leather.ageingTitle}</h3>
            <dl className="mb-8 space-y-2 text-sm">
              <div><dt className="text-muted">{copy.leather.m6}</dt><dd className="text-ink-soft">{l.ageing.m6}</dd></div>
              <div><dt className="text-muted">{copy.leather.m12}</dt><dd className="text-ink-soft">{l.ageing.m12}</dd></div>
              <div><dt className="text-muted">{copy.leather.m36}</dt><dd className="text-ink-soft">{l.ageing.m36}</dd></div>
            </dl>

            <Link
              href={`/configurator?leather=${active}`}
              className="inline-flex h-11 items-center rounded-sm border border-ink px-5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {copy.leather.build}
            </Link>
          </div>
        </div>

        {/* This is not a defect */}
        <div className="mt-16 rounded-sm border border-line bg-paper-2 p-6 md:p-10">
          <h3 className="mb-3">{copy.leather.notDefect.title}</h3>
          <p className="max-w-prose text-ink-soft">{copy.leather.notDefect.body}</p>
        </div>

        <div className="mt-10">
          <Accordion
            items={[{ id: 'care', title: copy.leather.careTitle, body: copy.leather.careBody }]}
          />
        </div>
      </div>
    </section>
  );
}
