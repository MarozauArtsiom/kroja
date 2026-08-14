// components/configurator/ConfiguratorClient.tsx
'use client';

import { ToastProvider } from '@/components/ui/Toast';
import { copy } from '@/lib/data';
import { useConfigurator } from './useConfigurator';
import Preview from './Preview';
import SizeSelector from './SizeSelector';
import LeatherSelector from './LeatherSelector';
import ColorSelector from './ColorSelector';
import DetailsSelector from './DetailsSelector';
import EngravingInput from './EngravingInput';
import InsertsSelector from './InsertsSelector';
import StickyBar from './StickyBar';

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

          {/* Right: options */}
          <div className="flex flex-col gap-10">
            <SizeSelector config={config} onChange={update} />
            <LeatherSelector config={config} onChange={update} />
            <ColorSelector config={config} onChange={update} />
            <DetailsSelector config={config} onChange={update} />
            <EngravingInput config={config} onChange={update} />
            <InsertsSelector config={config} onChange={update} />
          </div>
        </div>
      </main>

      <StickyBar priced={priced} />
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
