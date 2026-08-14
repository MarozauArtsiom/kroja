// components/landing/Faq.tsx
'use client';

import { useI18n } from '@/components/i18n/I18nProvider';
import Accordion from '@/components/ui/Accordion';

export default function Faq() {
  const { dict } = useI18n();

  return (
    <section id="faq" className="section">
      <div className="container-content max-w-3xl">
        <h2 className="mb-8">{dict.faq.title}</h2>
        <Accordion
          items={dict.faq.items.map((item, i) => ({
            id: `faq-${i}`,
            title: item.q,
            body: item.a,
          }))}
        />
      </div>
    </section>
  );
}
