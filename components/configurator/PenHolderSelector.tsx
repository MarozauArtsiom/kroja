// components/configurator/PenHolderSelector.tsx
'use client';

import type { Configuration, PenHolderCode } from '@/types/config';
import { penHolderList, PEN_HOLDER_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill, formatDelta } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import PenSizeGuide from '@/components/schematic/PenSizeGuide';
import { INK, LINE } from '@/lib/schematic-tokens';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

/** Pen cross-section: the wide loop is drawn at 13:10 of the slim one. */
function PenIcon({ code }: { code: PenHolderCode }) {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-full" aria-hidden="true">
      <rect x="1" y="1" width="58" height="22" rx="2" fill="none" stroke={LINE} strokeWidth="0.8" />
      {code === 'slim' && <circle cx="30" cy="12" r="5" fill="none" stroke={INK} strokeWidth="1.2" />}
      {code === 'wide' && <circle cx="30" cy="12" r="6.5" fill="none" stroke={INK} strokeWidth="1.2" />}
    </svg>
  );
}

export default function PenHolderSelector({ config, onChange }: Props) {
  const { dict } = useI18n();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="label mb-3">
          {dict.configurator.steps.penHolder}
          <span className="ml-2 normal-case tracking-normal text-accent">
            {formatDelta(PEN_HOLDER_MINOR)}
          </span>
        </h2>
        <OptionCardGroup
          label={dict.configurator.steps.penHolder}
          columns="grid-cols-1 sm:grid-cols-3"
          value={config.penHolder}
          onChange={(v) => onChange({ penHolder: v as PenHolderCode })}
          items={penHolderList.map((p) => ({
            value: p.code,
            title: dict.configurator.penHolders[p.code].title,
            meta: dict.configurator.penHolders[p.code].meta
              ? fill(dict.configurator.penHolders[p.code].meta, { min: p.minMm, max: p.maxMm })
              : undefined,
            delta: p.priceMinor === 0 ? undefined : formatDelta(p.priceMinor),
            visual: <PenIcon code={p.code} />,
          }))}
        />
      </div>
      <p className="text-xs leading-relaxed text-ink-soft">{dict.configurator.penHolderHelp}</p>
      <PenSizeGuide active={config.penHolder} />
    </section>
  );
}
