// components/configurator/MobilePreview.tsx
'use client';

import { useCallback, useState } from 'react';
import clsx from 'clsx';
import type { Angle, Configuration } from '@/types/config';
import { schematicAngleList } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import SchematicCover from '@/components/schematic/SchematicCover';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  config: Configuration;
  angle: Angle;
  onAngleChange: (angle: Angle) => void;
}

/**
 * Below lg the full preview sits far above the options, so every choice was made blind.
 * This strip stays pinned under the top edge while the options scroll beneath it.
 * Must be a direct child of <main>: sticky only works inside a tall parent.
 */
export default function MobilePreview({ config, angle, onAngleChange }: Props) {
  const { dict } = useI18n();
  const [expanded, setExpanded] = useState(false);
  // Stable, so the modal does not re-run its focus effect on every configuration change.
  const close = useCallback(() => setExpanded(false), []);

  return (
    <>
      <div className="sticky top-0 z-20 -mx-5 mb-8 border-b border-line bg-paper/95 px-5 py-2 backdrop-blur md:-mx-8 md:px-8 lg:hidden">
        <div className="flex items-stretch gap-3">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={dict.configurator.previewExpand}
            className="relative flex h-[26svh] min-h-[176px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-sm border border-line bg-paper-2 p-1 [&>div]:h-full [&_svg]:mx-auto [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full"
          >
            <SchematicCover config={config} angle={angle} compact />
            <span aria-hidden className="absolute bottom-1 right-2 text-sm text-ink-soft">
              ⤢
            </span>
          </button>

          <div
            role="tablist"
            aria-label={dict.a11y.previewAngle}
            aria-orientation="vertical"
            className="flex w-28 shrink-0 flex-col gap-0.5"
          >
            {schematicAngleList.map((a) => (
              <button
                key={a.angle}
                type="button"
                role="tab"
                aria-selected={angle === a.angle}
                onClick={() => onAngleChange(a.angle)}
                className={clsx(
                  'min-h-11 flex-1 rounded-sm border px-2 text-xs transition-colors duration-150',
                  angle === a.angle ? 'border-ink bg-paper-2 text-ink' : 'border-line text-ink-soft',
                )}
              >
                {dict.angles[a.angle]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={expanded}
        title={dict.configurator.previewTitle}
        onClose={close}
        footer={
          <Button variant="secondary" onClick={close}>
            {dict.configurator.previewClose}
          </Button>
        }
      >
        <SchematicCover config={config} angle={angle} />
      </Modal>
    </>
  );
}
