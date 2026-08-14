// app/shotlist/page.tsx
import { copy } from '@/content/copy';
import { getShotCounts } from '@/lib/shotlist';
import Header from '@/components/landing/Header';
import ShotMatrix from '@/components/shotlist/ShotMatrix';
import StorySlots from '@/components/shotlist/StorySlots';
import ExportButtons from '@/components/shotlist/ExportButtons';

export const metadata = {
  title: 'Shot list — KROJA',
  robots: { index: false, follow: false },
};

export default function ShotlistPage() {
  const counts = getShotCounts();
  const date = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="print:hidden">
        <Header />
      </div>

      <main className="container-content py-10">
        <header className="mb-10 border-b border-line pb-8">
          <h1 className="mb-2">{copy.shotlist.title}</h1>
          <p className="mb-6 text-ink-soft">{copy.shotlist.subtitle}</p>

          <p className="font-display text-5xl text-ink">
            {counts.total}{' '}
            <span className="text-xl text-muted">{copy.shotlist.totalLabel}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {counts.product} product · {counts.story} story · {copy.shotlist.generated} {date}
          </p>

          <div className="mt-6 print:hidden">
            <ExportButtons />
          </div>
        </header>

        <section className="mb-16">
          <h2 className="mb-6">{copy.shotlist.productShots}</h2>
          <ShotMatrix />
        </section>

        <section className="break-before-page">
          <h2 className="mb-6">{copy.shotlist.storyShots}</h2>
          <StorySlots />
        </section>
      </main>
    </>
  );
}
