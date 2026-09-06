// components/configurator/ThreadSelector.tsx
'use client';

import type { Configuration, ThreadCode } from '@/types/config';
import { threadList, colors, THREAD_THICKNESS_MM } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill } from '@/lib/format';
import SwatchGroup from '@/components/ui/SwatchGroup';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function ThreadSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const leatherHex = colors[config.color].hex;

  return (
    <section>
      <h2 className="label mb-1">{dict.configurator.steps.thread}</h2>
      <p className="mb-3 text-xs text-muted">
        {fill(dict.configurator.threadThickness, { mm: THREAD_THICKNESS_MM })}
      </p>
      <SwatchGroup
        label={dict.configurator.steps.thread}
        value={config.thread}
        onChange={(v) => onChange({ thread: v as ThreadCode })}
        items={threadList.map((t) => ({
          value: t.code,
          label: dict.threads[t.code],
          // 'tonal' has no hex of its own: it shows the current leather colour.
          hex: t.hex ?? leatherHex,
          state: 'available' as const,
        }))}
      />
    </section>
  );
}
