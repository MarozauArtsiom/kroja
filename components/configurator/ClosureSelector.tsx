// components/configurator/ClosureSelector.tsx
'use client';

import clsx from 'clsx';
import type { Configuration, ClosureCode, ElasticColorCode } from '@/types/config';
import { closureList, elasticColorList, BRASS_HEX } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDelta } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import SwatchGroup from '@/components/ui/SwatchGroup';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const INK = '#1C1917';
const LINE = '#DED5C7';

/** Tiny pictograms so the three closures are told apart at a glance. */
function ClosureIcon({ code }: { code: ClosureCode }) {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-full" aria-hidden="true">
      <rect x="1" y="1" width="58" height="22" rx="2" fill="none" stroke={LINE} strokeWidth="0.8" />
      {code === 'elastic' && (
        <>
          <line x1="30" y1="1" x2="30" y2="23" stroke={INK} strokeWidth="2" />
          <circle cx="30" cy="12" r="3" fill={INK} />
        </>
      )}
      {code === 'buckle' && (
        <>
          <rect x="8" y="8" width="44" height="8" fill={INK} opacity="0.25" />
          <rect x="10" y="5" width="10" height="14" rx="2" fill="none" stroke={BRASS_HEX} strokeWidth="2" />
          <line x1="15" y1="5" x2="15" y2="19" stroke={BRASS_HEX} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

export default function ClosureSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const current = dict.configurator.closures[config.closure];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="label mb-3">{dict.configurator.steps.closure}</h2>
        <OptionCardGroup
          label={dict.configurator.steps.closure}
          columns="grid-cols-1 sm:grid-cols-3"
          value={config.closure}
          onChange={(v) => onChange({ closure: v as ClosureCode })}
          items={closureList.map((c) => ({
            value: c.code,
            title: dict.configurator.closures[c.code].title,
            delta: formatDelta(c.priceMinor),
            visual: <ClosureIcon code={c.code} />,
          }))}
        />
        <p
          className={clsx(
            'mt-3 text-xs leading-relaxed text-ink-soft',
            config.closure === 'elastic' && 'border-l-2 border-accent pl-3',
          )}
        >
          {current.note}
        </p>
      </div>

      {config.closure === 'elastic' && (
        <div>
          <h3 className="label mb-3">{dict.configurator.elasticColor}</h3>
          <SwatchGroup
            label={dict.configurator.elasticColor}
            value={config.elasticColor}
            onChange={(v) => onChange({ elasticColor: v as ElasticColorCode })}
            items={elasticColorList.map((e) => ({
              value: e.code,
              label: dict.elasticColors[e.code],
              hex: e.hex,
              state: 'available' as const,
            }))}
          />
        </div>
      )}
    </section>
  );
}
