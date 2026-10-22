// components/configurator/EmbossingInput.tsx
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Configuration, EmbossingFont, EmbossingPosition } from '@/types/config';
import { EMBOSSING_MINOR, MAX_EMBOSSING_LENGTH } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { sanitizeEmbossing } from '@/lib/config-schema';
import { fill, formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const FONTS: EmbossingFont[] = ['serif', 'sans'];
const POSITIONS: EmbossingPosition[] = ['bottom-right', 'spine'];

export default function EmbossingInput({ config, onChange }: Props) {
  const { dict } = useI18n();
  const [text, setText] = useState(config.embossing?.text ?? '');

  // Keep local state in sync when config changes from outside (e.g. URL restore)
  useEffect(() => {
    setText(config.embossing?.text ?? '');
  }, [config.embossing?.text]);

  function commit(next: { text?: string; font?: EmbossingFont; position?: EmbossingPosition }) {
    const clean = (next.text ?? text).trim();
    if (clean.length === 0) {
      if (config.embossing !== null) onChange({ embossing: null });
      return;
    }
    onChange({
      embossing: {
        text: clean,
        font: next.font ?? config.embossing?.font ?? 'serif',
        position: next.position ?? config.embossing?.position ?? 'bottom-right',
      },
    });
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          autoCapitalize="characters"
          autoComplete="off"
          value={text}
          onChange={(e) => {
            const clean = sanitizeEmbossing(e.target.value);
            setText(clean);
            commit({ text: clean });
          }}
          placeholder={dict.configurator.embossingPlaceholder}
          maxLength={MAX_EMBOSSING_LENGTH}
          aria-describedby="embossing-hint"
          className="h-14 w-28 rounded-sm border border-line bg-paper text-center font-display text-2xl tracking-[0.2em] text-ink placeholder:text-muted focus:border-ink"
        />
        <span className="font-mono text-xs text-muted">
          {text.length} / {MAX_EMBOSSING_LENGTH}
          <span className="font-sans text-xs text-accent"> · {formatDelta(EMBOSSING_MINOR)}</span>
        </span>
      </div>

      <p id="embossing-hint" className="mt-1.5 text-xs text-muted">
        {fill(dict.configurator.embossingHint, { max: MAX_EMBOSSING_LENGTH })}
      </p>
      <p className="mt-1 text-xs text-ink-soft">{dict.configurator.embossingNote}</p>

      {text.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="label mb-2 block">{dict.configurator.embossingFontLabel}</span>
            <div className="flex gap-2">
              {FONTS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => commit({ font: f })}
                  className={clsx(
                    'h-11 flex-1 rounded-sm border text-sm transition-colors duration-150',
                    config.embossing?.font === f ? 'border-ink bg-paper-2' : 'border-line',
                  )}
                >
                  {dict.options.embossingFonts[f]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label mb-2 block">{dict.configurator.embossingPositionLabel}</span>
            <div className="flex gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => commit({ position: p })}
                  className={clsx(
                    'h-11 flex-1 rounded-sm border text-xs transition-colors duration-150',
                    config.embossing?.position === p ? 'border-ink bg-paper-2' : 'border-line',
                  )}
                >
                  {dict.options.embossingPositions[p]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
