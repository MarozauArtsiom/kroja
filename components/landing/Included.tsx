// components/landing/Included.tsx
'use client';

import { useI18n } from '@/components/i18n/I18nProvider';

export default function Included() {
  const { dict } = useI18n();

  return (
    <section className="section">
      <div className="container-content">
        <h2 className="mb-10 max-w-prose">{dict.included.title}</h2>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <ul className="space-y-3">
              {dict.included.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-sm border border-line bg-paper-2 p-5 text-sm text-ink-soft">
              <p className="mb-1 font-medium text-ink">{dict.included.compatibilityTitle}</p>
              <p className="text-xs leading-relaxed">{dict.included.compatibility}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-sm border border-line bg-paper-2 p-6 md:p-8">
            <div>
              <h3 className="mb-3 text-lg font-medium text-ink">{dict.included.timeTitle}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{dict.included.timeBody}</p>
            </div>
            <p className="mt-8 text-xs text-muted">{dict.included.footerNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
