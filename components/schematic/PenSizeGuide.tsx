// components/schematic/PenSizeGuide.tsx
'use client';

import type { PenHolderCode } from '@/types/config';
import { penHolders } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill } from '@/lib/format';
import { INK, MUTED } from '@/lib/schematic-tokens';

/**
 * Two circles in REAL millimetres: the inner diameter of the slim and the wide loop.
 * width/height are in mm on purpose — the user can hold a pen against the screen.
 */
export default function PenSizeGuide({ active }: { active: PenHolderCode }) {
  const { dict } = useI18n();
  const slim = penHolders.slim.maxMm;
  const wide = penHolders.wide.maxMm;

  return (
    <div className="flex flex-wrap items-center gap-5 rounded-sm border border-line bg-paper-2 p-4">
      <svg
        width="34mm"
        height="17mm"
        viewBox="0 0 34 17"
        role="img"
        aria-label={fill(dict.a11y.loopDiameters, {
          slim: `${slim} ${dict.units.mm}`,
          wide: `${wide} ${dict.units.mm}`,
        })}
        className="shrink-0"
      >
        <circle cx="8" cy="7.5" r={slim / 2} fill={active === 'slim' ? INK : 'none'}
                stroke={INK} strokeWidth="0.35" />
        <circle cx="25" cy="7.5" r={wide / 2} fill={active === 'wide' ? INK : 'none'}
                stroke={INK} strokeWidth="0.35" />
        <text x="8" y="16" textAnchor="middle" fontSize="2" fill={MUTED}>{slim} {dict.units.mm}</text>
        <text x="25" y="16" textAnchor="middle" fontSize="2" fill={MUTED}>{wide} {dict.units.mm}</text>
      </svg>
      <p className="max-w-[28ch] text-xs leading-relaxed text-muted">
        {dict.configurator.penHolderGuideLabel}
      </p>
    </div>
  );
}
