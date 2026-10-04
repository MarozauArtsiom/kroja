// components/shotlist/ShotMatrix.tsx
'use client';

import type { Configuration } from '@/types/config';
import { angleList, leatherList } from '@/lib/data';
import { DEFAULT_CONFIG } from '@/lib/config-schema';
import { getProductShots, type ProductShot } from '@/lib/shotlist';
import { useI18n } from '@/components/i18n/I18nProvider';
import SchematicCover from '@/components/schematic/SchematicCover';
import HatchDefs, { hatchUrl } from '@/components/schematic/HatchDefs';

function HatchLegend() {
  const { dict } = useI18n();

  return (
    <div className="mb-10 rounded-sm border border-line bg-paper-2 p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        {dict.shotlist.hatchLegendTitle}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {leatherList.map((l) => (
          <div key={l.code} className="flex items-center gap-3">
            <svg
              viewBox="0 0 48 24"
              className="h-6 w-12 shrink-0 rounded-sm border border-line bg-paper"
            >
              <HatchDefs />
              <rect x="0" y="0" width="48" height="24" fill={hatchUrl(l.schematicHatch)} />
            </svg>
            <div>
              <p className="text-xs font-medium text-ink">{dict.leatherNames[l.code] || l.name}</p>
              <p className="text-[11px] text-muted">
                {dict.leather.descriptions[l.code]?.character || l.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShotMatrix() {
  const { dict } = useI18n();
  const allShots = getProductShots();

  return (
    <div className="space-y-12">
      {/* Global rules */}
      <div className="rounded-sm border border-line bg-paper-2 p-5 text-sm">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          {dict.shotlist.rulesTitle}
        </h3>
        <ul className="space-y-1.5 text-xs text-ink-soft">
          {dict.shotlist.rules.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ink" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <HatchLegend />

      {/* Angle groups */}
      {angleList.map((a) => {
        const groupShots = allShots.filter((s) => s.angle === a.angle);

        return (
          <section key={a.angle} data-shot-group className="space-y-4">
            <div className="border-b border-line pb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl font-medium text-ink">
                  {dict.angles[a.angle]} {dict.shotlist.viewLabel}{' '}
                  <span className="text-sm font-normal text-muted">({a.ratio})</span>
                </h3>
                <span className="text-xs text-muted">
                  {groupShots.length} {dict.shotlist.shotsCount}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {dict.shotlist.mustShow}: {dict.shotlist.angleMustShow[a.angle].join(' · ')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {groupShots.map((shot: ProductShot) => {
                const config: Configuration = {
                  ...DEFAULT_CONFIG,
                  leather: shot.leather,
                  color: shot.color,
                  // Hardware is composited by the site and must not appear in the
                  // reference drawing — the shot rules above say exactly that.
                  closure: 'none',
                  penHolder: 'none',
                  pockets: { front: [], back: [] },
                  embossing: null,
                  inserts: [{ type: 'dot', qty: 2 }],
                };

                return (
                  <div
                    key={shot.filename}
                    data-shot-card
                    className="flex flex-col justify-between rounded-sm border border-line bg-paper p-4"
                  >
                    <div className="mb-3">
                      <div className="mx-auto mb-3 max-w-[140px]">
                        <SchematicCover config={config} angle={shot.angle} compact />
                      </div>
                      <p className="text-sm font-medium text-ink">{dict.colors[shot.color]}</p>
                      <p className="text-xs text-muted">{dict.leatherNames[shot.leather]}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-line pt-3">
                      <code className="text-[11px] text-muted">{shot.filename}</code>
                      <div
                        data-shot-checkbox
                        className="h-4 w-4 rounded-sm border border-ink"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
