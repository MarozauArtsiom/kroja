// components/landing/Process.tsx
import { sections } from '@/content/sections';
import { copy } from '@/content/copy';

export default function Process() {
  if (sections.process === false) return null;

  return (
    <section id="craft" className="section bg-paper-2">
      <div className="container-content">
        <h2 className="mb-4">{copy.process.title}</h2>
        <p className="mb-12 max-w-prose text-ink-soft">{copy.process.subtitle}</p>

        <ol className="grid gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-10">
          {copy.process.steps.map((step, i) => (
            <li key={step.title} className="flex gap-5">
              <span className="font-display text-4xl leading-none text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="mb-2 text-lg">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-12 text-center text-xs uppercase tracking-[0.1em] text-muted">
          Made by hand in {copy.brand.city}, Poland
        </p>
      </div>
    </section>
  );
}
