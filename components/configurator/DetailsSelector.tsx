// components/configurator/DetailsSelector.tsx
'use client';

import type { Configuration, ThreadCode, CordCode } from '@/types/config';
import { threadList } from '@/content/threads';
import { cordList } from '@/content/cords';
import { copy } from '@/content/copy';
import SwatchGroup from '@/components/ui/SwatchGroup';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function DetailsSelector({ config, onChange }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="label mb-3">{copy.configurator.thread}</h2>
        <SwatchGroup
          label="Thread"
          value={config.thread}
          onChange={(v) => onChange({ thread: v as ThreadCode })}
          items={threadList.map((t) => ({
            value: t.code,
            label: t.name,
            hex: t.hex,
            state: 'available' as const,
          }))}
        />
      </div>

      <div>
        <h2 className="label mb-3">{copy.configurator.cord}</h2>
        <SwatchGroup
          label="Elastic cord"
          value={config.cord}
          onChange={(v) => onChange({ cord: v as CordCode })}
          items={cordList.map((c) => ({
            value: c.code,
            label: c.name,
            hex: c.hex,
            state: 'available' as const,
          }))}
        />
        <p className="mt-2 text-xs text-muted">
          The cord is composited onto the photograph, which is why it is not drawn on the
          technical drawing and must not appear in the shot.
        </p>
      </div>
    </section>
  );
}
