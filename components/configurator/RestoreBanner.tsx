// components/configurator/RestoreBanner.tsx
'use client';

import { useEffect, useState } from 'react';
import type { Configuration } from '@/types/config';
import { copy } from '@/content/copy';
import { parseConfig } from '@/lib/config-schema';
import Button from '@/components/ui/Button';

const KEY = 'kroja:last-config';

export function saveConfig(config: Configuration) {
  try {
    localStorage.setItem(KEY, JSON.stringify(config));
  } catch {
    // Storage may be unavailable (private mode). Failing silently is correct here.
  }
}

interface Props {
  /** True when the URL had no configuration params at all */
  isFreshVisit: boolean;
  onRestore: (config: Configuration) => void;
}

export default function RestoreBanner({ isFreshVisit, onRestore }: Props) {
  const [saved, setSaved] = useState<Configuration | null>(null);

  useEffect(() => {
    if (!isFreshVisit) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSaved(parseConfig(JSON.parse(raw)));
    } catch {
      setSaved(null);
    }
  }, [isFreshVisit]);

  if (!saved) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-line bg-paper-2 p-4">
      <p className="text-sm text-ink">{copy.configurator.restoreTitle}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setSaved(null)}>
          {copy.configurator.restoreNo}
        </Button>
        <Button size="sm" onClick={() => { onRestore(saved); setSaved(null); }}>
          {copy.configurator.restoreYes}
        </Button>
      </div>
    </div>
  );
}
