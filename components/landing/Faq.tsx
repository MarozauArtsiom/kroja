// components/landing/Faq.tsx
import { copy } from '@/content/copy';
import Accordion from '@/components/ui/Accordion';

export default function Faq() {
  return (
    <section id="faq" className="section">
      <div className="container-content max-w-3xl">
        <h2 className="mb-8">{copy.faq.title}</h2>
        <Accordion
          items={copy.faq.items.map((item, i) => ({
            id: `faq-${i}`,
            title: item.q,
            body: item.a,
          }))}
        />
      </div>
    </section>
  );
}
