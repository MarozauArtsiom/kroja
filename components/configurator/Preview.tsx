// components/configurator/Preview.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { Configuration, Angle } from '@/types/config';
import { schematicAngleList } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { getPreview, SHOW_SCHEMATIC_NOTES } from '@/lib/assets';
import SchematicCover from '@/components/schematic/SchematicCover';
import SizeDiagram from '@/components/schematic/SizeDiagram';
import { serialisePockets } from '@/lib/pockets';

/** Everything that is only visible on the open spread. A change here switches the view to it. */
function insideKey(config: Configuration): string {
  const inserts = config.inserts.reduce((sum, i) => sum + i.qty, 0);
  return `${serialisePockets(config.pockets)}#${config.penHolder}#${inserts}`;
}

export default function Preview({ config }: { config: Configuration }) {
  const { dict } = useI18n();
  const [angle, setAngle] = useState<Angle>('front');
  const source = getPreview(config, angle);

  // Pockets, the pen loop and the inserts live inside the cover. Without this the user
  // presses "+" on the Front tab and nothing on the drawing changes.
  const inside = insideKey(config);
  const lastInside = useRef(inside);
  useEffect(() => {
    if (lastInside.current !== inside) {
      lastInside.current = inside;
      setAngle('open');
    }
  }, [inside]);

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
      <div className="flex gap-2" role="tablist" aria-label={dict.a11y.previewAngle}>
        {schematicAngleList.map((a) => (
          <button
            key={a.angle}
            type="button"
            role="tab"
            aria-selected={angle === a.angle}
            onClick={() => setAngle(a.angle)}
            className={clsx(
              'flex-1 rounded-sm border px-3 py-2 text-xs transition-colors duration-150',
              angle === a.angle
                ? 'border-ink bg-paper-2 text-ink'
                : 'border-line text-muted hover:border-ink-soft',
            )}
          >
            {dict.angles[a.angle]}
          </button>
        ))}
      </div>

      {SHOW_SCHEMATIC_NOTES && (
        <p className="text-xs leading-relaxed text-muted">{dict.leather.schematicNote}</p>
      )}

      <div className="rounded-sm border border-line p-4">
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
