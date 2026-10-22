// components/configurator/ConfiguratorClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ToastProvider } from '@/components/ui/Toast';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useConfigurator } from './useConfigurator';
import { usePreviewAngle } from './usePreviewAngle';
import Preview from './Preview';
import MobilePreview from './MobilePreview';
import SizeSelector from './SizeSelector';
import LeatherSelector from './LeatherSelector';
import ColorSelector from './ColorSelector';
import ThreadSelector from './ThreadSelector';
import ClosureSelector from './ClosureSelector';
import PenHolderSelector from './PenHolderSelector';
import PocketsSelector from './PocketsSelector';
import InsertsSelector from './InsertsSelector';
import EmbossingInput from './EmbossingInput';
import StickyBar from './StickyBar';
import RestoreBanner, { saveConfig } from './RestoreBanner';
import OptionSection from './OptionSection';
import { DETAIL_IDS, detailSummaries, type DetailId } from './summary';

/** Opening one of these shows the spread: they live inside the cover (D-19). */
const INSIDE: DetailId[] = ['penHolder', 'pockets', 'inserts'];

function Inner() {
  const searchParams = useSearchParams();
  const { dict, getLocalizedPath } = useI18n();
  const { config, priced, warnings, update } = useConfigurator();
  const { angle, setAngle } = usePreviewAngle(config);
  const [openDetails, setOpenDetails] = useState<DetailId[]>([]);
  const summaries = detailSummaries(config, dict);

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const isFreshVisit = searchParams.toString() === '';

  function toggleDetail(id: DetailId) {
    const opening = !openDetails.includes(id);
    setOpenDetails((prev) => (opening ? [...prev, id] : prev.filter((x) => x !== id)));
    if (opening && INSIDE.includes(id)) setAngle('open');
  }

  const detailTitle: Record<DetailId, string> = {
    thread: dict.configurator.steps.thread,
    penHolder: dict.configurator.steps.penHolder,
    pockets: dict.configurator.steps.pockets,
    inserts: dict.configurator.steps.inserts,
  };

  function renderDetail(id: DetailId) {
    switch (id) {
      case 'thread':
        return <ThreadSelector config={config} onChange={update} />;
      case 'penHolder':
        return <PenHolderSelector config={config} onChange={update} />;
      case 'pockets':
        return <PocketsSelector config={config} onChange={update} />;
      case 'inserts':
        return <InsertsSelector config={config} onChange={update} />;
    }
  }

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

        <MobilePreview config={config} angle={angle} onAngleChange={setAngle} />

        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          {/* Left: preview, sticky on desktop */}
          <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <Preview config={config} angle={angle} onAngleChange={setAngle} />
          </div>

          {/* Right: the four main choices open, the details folded into one-line summaries */}
          <div className="flex flex-col gap-10">
            <OptionSection title={dict.configurator.steps.size}>
              <SizeSelector config={config} onChange={update} />
            </OptionSection>
            <OptionSection title={dict.configurator.steps.leather}>
              <LeatherSelector config={config} onChange={update} />
            </OptionSection>
            <OptionSection title={dict.configurator.steps.color}>
              <ColorSelector config={config} onChange={update} />
            </OptionSection>
            <OptionSection title={dict.configurator.steps.closure}>
              <ClosureSelector config={config} onChange={update} />
            </OptionSection>

            <div>
              <h2 className="font-display text-xl text-ink">{dict.configurator.groupDetails}</h2>
              <p className="mb-2 mt-1 text-sm text-ink-soft">{dict.configurator.groupDetailsHint}</p>
              <div className="border-t border-line">
                {DETAIL_IDS.map((id) => (
                  <OptionSection
                    key={id}
                    title={detailTitle[id]}
                    {...summaries[id]}
                    open={openDetails.includes(id)}
                    onToggle={() => toggleDetail(id)}
                  >
                    {renderDetail(id)}
                  </OptionSection>
                ))}
              </div>
            </div>

            {/* Embossing is the personal touch and a +40 zł upsell: open, last, right before the gift box. */}
            <div onFocusCapture={() => setAngle('front')}>
              <OptionSection title={dict.configurator.steps.embossing}>
                <EmbossingInput config={config} onChange={update} />
              </OptionSection>
            </div>
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
