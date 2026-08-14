// components/configurator/EngravingInput.tsx
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Configuration, EngravingFont, EngravingPosition } from '@/types/config';
import { copy } from '@/content/copy';
import { ENGRAVING_MINOR, MAX_ENGRAVING_LENGTH } from '@/content/pricing';
import { sanitizeEngraving } from '@/lib/config-schema';
import { formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const DEBOUNCE_MS = 120;

export default function EngravingInput({ config, onChange }: Props) {
  const [text, setText] = useState(config.engraving?.text ?? '');

  // Keep local state in sync when config changes from outside (e.g. URL restore)
  useEffect(() => {
    setText(config.engraving?.text ?? '');
  }, [config.engraving?.text]);

  // Debounced push into the configuration
  useEffect(() => {
    const timer = setTimeout(() => {
      const clean = text.trim();
      if (clean.length === 0) {
        if (config.engraving !== null) onChange({ engraving: null });
        return;
      }
      if (clean !== config.engraving?.text) {
        onChange({
          engraving: {
            text: clean,
            font: config.engraving?.font ?? 'serif',
            position: config.engraving?.position ?? 'bottom-right',
          },
        });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const count = text.length;
  const nearLimit = count >= 18;

  return (
    <section>
      <h2 className="label mb-3">
        {copy.configurator.steps.engraving}
        <span className="ml-2 normal-case tracking-normal text-accent">
          {formatDelta(ENGRAVING_MINOR)}
        </span>
      </h2>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(sanitizeEngraving(e.target.value))}
        placeholder={copy.configurator.engravingPlaceholder}
        maxLength={MAX_ENGRAVING_LENGTH}
        aria-describedby="engraving-hint"
        className="h-11 w-full rounded-sm border border-line bg-paper px-3 text-base text-ink placeholder:text-muted focus:border-ink"
      />

      <div className="mt-1.5 flex items-start justify-between gap-4">
        <p id="engraving-hint" className="text-xs text-muted">
          {copy.configurator.engravingHint}
        </p>
        <span className={clsx('shrink-0 font-mono text-xs', nearLimit ? 'text-alert' : 'text-muted')}>
          {count} / {MAX_ENGRAVING_LENGTH}
        </span>
      </div>

      {text.trim().length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="label mb-2 block">{copy.configurator.engravingFontLabel}</span>
            <div className="flex gap-2">
              {(['serif', 'sans'] as EngravingFont[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() =>
                    onChange({
                      engraving: {
                        text: text.trim(),
                        font: f,
                        position: config.engraving?.position ?? 'bottom-right',
                      },
                    })
                  }
                  className={clsx(
                    'h-9 flex-1 rounded-sm border text-sm transition-colors duration-150',
                    config.engraving?.font === f ? 'border-ink bg-paper-2' : 'border-line',
                  )}
                >
                  {copy.configurator.engravingFonts[f]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label mb-2 block">{copy.configurator.engravingPositionLabel}</span>
            <div className="flex gap-2">
              {(['bottom-right', 'spine'] as EngravingPosition[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    onChange({
                      engraving: {
                        text: text.trim(),
                        font: config.engraving?.font ?? 'serif',
                        position: p,
                      },
                    })
                  }
                  className={clsx(
                    'h-9 flex-1 rounded-sm border text-xs transition-colors duration-150',
                    config.engraving?.position === p ? 'border-ink bg-paper-2' : 'border-line',
                  )}
                >
                  {copy.configurator.engravingPositions[p]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
