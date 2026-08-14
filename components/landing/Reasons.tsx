// components/landing/Reasons.tsx
import { copy } from '@/lib/data';
import Illustration from './Illustration';
import SchematicCover from '@/components/schematic/SchematicCover';
import { DEFAULT_CONFIG } from '@/lib/config-schema';

/** One illustration per reason. The third reuses the open-cover schematic. */
const visuals = ['stitch', 'refill', 'schematic'] as const;

export default function Reasons() {
  return (
    <section className="section bg-paper-2">
      <div className="container-content">
        <h2 className="mb-10 max-w-prose">{copy.reasons.title}</h2>

        <div className="grid gap-8 md:grid-cols-3">
          {copy.reasons.items.map((item, i) => (
            <article key={item.title}>
              <div className="mb-4 rounded-sm border border-line bg-paper p-5">
                {visuals[i] === 'schematic' ? (
                  <SchematicCover config={DEFAULT_CONFIG} angle="open" compact />
                ) : (
                  <Illustration name={visuals[i]} />
                )}
              </div>
              <h3 className="mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
