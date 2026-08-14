// components/configurator/ConfiguratorClient.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ToastProvider } from '@/components/ui/Toast';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useConfigurator } from './useConfigurator';
import Preview from './Preview';
import SizeSelector from './SizeSelector';
import LeatherSelector from './LeatherSelector';
import ColorSelector from './ColorSelector';
import DetailsSelector from './DetailsSelector';
import EngravingInput from './EngravingInput';
import InsertsSelector from './InsertsSelector';
import StickyBar from './StickyBar';
import RestoreBanner, { saveConfig } from './RestoreBanner';

function Inner() {
  const searchParams = useSearchParams();
  const { dict, getLocalizedPath } = useI18n();
  const { config, priced, warnings, update } = useConfigurator();

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const isFreshVisit = searchParams.toString() === '';

  return (
    <>
      <main className="container-content pb-32 pt-8">
        <Link
          href={getLocalizedPath('/')}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
        >
          {dict.nav.backToHome}
        </Link>
        <h1 className="mb-8 text-3xl md:text-4xl">{dict.configurator.title}</h1>

        <RestoreBanner isFreshVisit={isFreshVisit} onRestore={(c) => update(c)} />

        {warnings.length > 0 && (
          <div className="mb-6 rounded-sm border border-line bg-paper-2 p-4 text-sm text-ink-soft">
            {dict.configurator.conflictBanner}
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
