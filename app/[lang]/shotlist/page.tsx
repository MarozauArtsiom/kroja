// app/[lang]/shotlist/page.tsx
import Header from '@/components/landing/Header';
import ShotMatrix from '@/components/shotlist/ShotMatrix';
import StorySlots from '@/components/shotlist/StorySlots';
import ExportButtons from '@/components/shotlist/ExportButtons';
import { getShotCounts } from '@/lib/shotlist';
import { getDictionary } from '@/content/i18n';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shot list',
  robots: { index: false, follow: false },
};

export default async function LocalizedShotlistPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const counts = getShotCounts();
  const date = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="print:hidden">
        <Header />
      </div>

      <main className="container-content py-10">
        <header className="mb-10 border-b border-line pb-8">
          <h1 className="mb-2">{dict.shotlist.title}</h1>
          <p className="mb-6 text-ink-soft">{dict.shotlist.subtitle}</p>
          <p className="mb-6 rounded-sm border border-line bg-paper-2 p-3 text-xs text-ink-soft">
            {dict.shotlist.postponedNote}
          </p>

          <p className="font-display text-5xl text-ink">
            {counts.total}{' '}
            <span className="text-xl text-muted">{dict.shotlist.totalLabel}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {counts.product} {dict.shotlist.productShots.toLowerCase()} · {counts.story}{' '}
            {dict.shotlist.storyShots.toLowerCase()} · {dict.shotlist.generated} {date}
          </p>

          <div className="mt-6 print:hidden">
            <ExportButtons />
          </div>
        </header>

        <section className="mb-16">
          <h2 className="mb-6">{dict.shotlist.productShots}</h2>
          <ShotMatrix />
        </section>

        <section className="break-before-page">
          <h2 className="mb-6">{dict.shotlist.storyShots}</h2>
          <StorySlots />
        </section>
      </main>
    </>
  );
}
