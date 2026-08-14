// components/configurator/ConfiguratorClient.tsx
'use client';

import { ToastProvider } from '@/components/ui/Toast';
import { copy } from '@/lib/data';
import { formatPrice } from '@/lib/format';
import { useConfigurator } from './useConfigurator';
import Preview from './Preview';
import SizeSelector from './SizeSelector';

function Inner() {
  const { config, priced, warnings, update } = useConfigurator();

  return (
    <>
      <main className="container-content pb-32 pt-8">
        <h1 className="mb-8 text-3xl md:text-4xl">{copy.configurator.title}</h1>

        {warnings.length > 0 && (
          <div className="mb-6 rounded-sm border border-line bg-paper-2 p-4 text-sm text-ink-soft">
            {copy.configurator.conflictBanner}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          {/* Left: preview, sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Preview config={config} />
          </div>

          {/* Right: options. Each SLOT is filled by a later task. */}
          <div className="flex flex-col gap-10">
            <SizeSelector config={config} onChange={update} />
            {/* SLOT: LeatherSelector */}
            {/* SLOT: ColorSelector */}
            {/* SLOT: DetailsSelector */}
            {/* SLOT: EngravingInput */}
            {/* SLOT: InsertsSelector */}
          </div>
        </div>
      </main>

      {/* Temporary price bar. Replaced by StickyBar in T-058. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur">
        <div className="container-content flex h-[72px] items-center">
          <p className="text-lg font-medium">{formatPrice(priced.totalMinor)}</p>
        </div>
      </div>

      {/* SLOT: StickyBar */}
    </>
  );
}

export default function ConfiguratorClient() {
  return (
    <ToastProvider>
      <Inner />
    </ToastProvider>
  );
}
