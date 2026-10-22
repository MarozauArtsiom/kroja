// components/configurator/Preview.tsx
'use client';

import clsx from 'clsx';
import type { Configuration, Angle } from '@/types/config';
import { schematicAngleList } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { getPreview } from '@/lib/assets';
import SchematicCover from '@/components/schematic/SchematicCover';
import SizeDiagram from '@/components/schematic/SizeDiagram';

interface Props {
  config: Configuration;
  angle: Angle;
  onAngleChange: (angle: Angle) => void;
}

/** The angle lives in usePreviewAngle: the mobile preview and the option sections share it. */
export default function Preview({ config, angle, onAngleChange }: Props) {
  const { dict } = useI18n();
  const source = getPreview(config, angle);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-sm border border-line bg-paper-2 p-4 md:p-6">
        {source.kind === 'schematic' ? (
          <SchematicCover config={config} angle={angle} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={source.src} alt={source.alt} className="w-full" />
        )}
      </div>

      {/* Angle tabs */}
      <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label={dict.a11y.previewAngle}>
        {schematicAngleList.map((a) => (
          <button
            key={a.angle}
            type="button"
            role="tab"
            aria-selected={angle === a.angle}
            onClick={() => onAngleChange(a.angle)}
            className={clsx(
              'h-11 min-w-max flex-1 whitespace-nowrap rounded-sm border px-2 text-xs transition-colors duration-150',
              angle === a.angle
                ? 'border-ink bg-paper-2 text-ink'
                : 'border-line text-muted hover:border-ink-soft',
            )}
          >
            {dict.angles[a.angle]}
          </button>
        ))}
      </div>

      <div className="hidden rounded-sm border border-line p-4 lg:block">
        <SizeDiagram
          active={config.size}
          mode="single"
          names={dict.sizes.names}
          mmUnit={dict.units.mm}
          aria={{ single: dict.schematic.sizeDiagramSingle, compare: dict.schematic.sizeDiagramCompare }}
          phoneLabel={dict.schematic.phone}
        />
      </div>
    </div>
  );
}
