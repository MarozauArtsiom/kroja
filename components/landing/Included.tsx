// components/landing/Included.tsx
import { copy } from '@/content/copy';

export default function Included() {
  return (
    <section className="section">
      <div className="container-content">
        <h2 className="mb-10 max-w-prose">{copy.included.title}</h2>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <ul className="space-y-3">
              {copy.included.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-sm border border-line bg-paper-2 p-5 text-sm text-ink-soft">
              <p className="font-medium text-ink mb-1">Compatibility</p>
              <p className="text-xs leading-relaxed">{copy.included.compatibility}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-sm border border-line bg-paper-2 p-6 md:p-8">
            <div>
              <h3 className="mb-3 text-lg font-medium text-ink">{copy.included.timeTitle}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{copy.included.timeBody}</p>
            </div>
            <p className="mt-8 text-xs text-muted">
              Hand-cut, hand-stitched, finished to order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
