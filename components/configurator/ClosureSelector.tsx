// components/configurator/ClosureSelector.tsx
'use client';

import clsx from 'clsx';
import type { Configuration, ClosureCode } from '@/types/config';
import { closureList, BRASS_HEX } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDelta } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import { INK, LINE } from '@/lib/schematic-tokens';

/** Tiny pictograms so the three closures are told apart at a glance. */
function ClosureIcon({ code }: { code: ClosureCode }) {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-full" aria-hidden="true">
      <rect x="1" y="1" width="58" height="22" rx="2" fill="none" stroke={LINE} strokeWidth="0.8" />
      {code === 'elastic' && (
        // Two strands across the cover, coming out of the spine on the left.
        <>
          <line x1="4" y1="10" x2="58" y2="10" stroke={INK} strokeWidth="1.6" />
          <line x1="4" y1="14" x2="58" y2="14" stroke={INK} strokeWidth="1.6" />
          <circle cx="4" cy="10" r="1.4" fill="none" stroke={INK} strokeWidth="0.8" />
          <circle cx="4" cy="14" r="1.4" fill="none" stroke={INK} strokeWidth="0.8" />
        </>
      )}
      {code === 'buckle' && (
        // A short tongue at the fore-edge with the brass frame on its end.
        <>
          <rect x="46" y="8" width="13" height="8" fill={INK} opacity="0.25" />
          <rect x="38" y="5" width="10" height="14" rx="2" fill="none" stroke={BRASS_HEX} strokeWidth="2" />
          <line x1="43" y1="5" x2="43" y2="19" stroke={BRASS_HEX} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function ClosureSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const current = dict.options.closures[config.closure];

  return (
    <div>
      <OptionCardGroup
        label={dict.configurator.steps.closure}
        columns="grid-cols-1 sm:grid-cols-3"
        value={config.closure}
        onChange={(v) => onChange({ closure: v as ClosureCode })}
        items={closureList.map((c) => ({
          value: c.code,
          title: dict.options.closures[c.code].title,
          delta: formatDelta(c.priceMinor),
          visual: <ClosureIcon code={c.code} />,
        }))}
      />
      {/* The closing band is the one choice that leaves holes: it gets the accent rule. */}
      <p
        className={clsx(
          'mt-3 text-xs leading-relaxed text-ink-soft',
          config.closure === 'elastic' && 'border-l-2 border-accent pl-3',
        )}
      >
        {current.note}
      </p>
    </div>
  );
}
