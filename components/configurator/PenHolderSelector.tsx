// components/configurator/PenHolderSelector.tsx
'use client';

import type { Configuration, PenHolderCode } from '@/types/config';
import { penHolderList, PEN_HOLDER_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDelta } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import PenSizeGuide from '@/components/schematic/PenSizeGuide';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const INK = '#1C1917';
const LINE = '#DED5C7';

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
            meta: dict.configurator.penHolders[p.code].meta || undefined,
            delta: p.code === 'none' ? undefined : formatDelta(PEN_HOLDER_MINOR),
            visual: <PenIcon code={p.code} />,
          }))}
        />
      </div>
      <p className="text-xs leading-relaxed text-ink-soft">{dict.configurator.penHolderHelp}</p>
      <PenSizeGuide active={config.penHolder} />
    </section>
  );
}
