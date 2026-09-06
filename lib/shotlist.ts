// lib/shotlist.ts
import type { LeatherCode, ColorCode, Angle } from '@/types/config';
import { leatherList } from '@/content/leathers';
import { angleList } from '@/content/shots';
import { getStock } from '@/lib/availability';
import { previewFilename } from '@/lib/assets';

export interface ProductShot {
  index: number;
  leather: LeatherCode;
  color: ColorCode;
  angle: Angle;
  ratio: string;
  filename: string;
}

export interface StoryShot {
  index: number;
  id: string;
  ratio: string;
}

/**
 * Every product shot that has to be taken.
 * Grouped by angle first, because it is far easier to shoot a whole series
 * with one scene set up than to keep re-staging per colour.
 */
export function getProductShots(): ProductShot[] {
  const shots: ProductShot[] = [];
  let index = 0;

  for (const angle of angleList) {
    for (const leather of leatherList) {
      for (const colorCode of leather.availableColors) {
        // Never shoot combinations that are not sold.
        if (getStock(leather.code, colorCode) === 'unavailable') continue;

        index += 1;
        shots.push({
          index,
          leather: leather.code,
          color: colorCode,
          angle: angle.angle,
          ratio: angle.ratio,
          filename: previewFilename(leather.code, colorCode, angle.angle),
        });
      }
    }
  }

  return shots;
}

/** Story shots for the landing page. Texts live in the dictionary, keyed by id. */
export const storyShots: StoryShot[] = [
  { index: 1,  id: 'S1-hero',            ratio: '4 / 3' },
  { index: 2,  id: 'S2-stitch-macro',    ratio: '4 / 5' },
  { index: 3,  id: 'S2-grain-macro',     ratio: '4 / 5' },
  { index: 4,  id: 'S2-edge-macro',      ratio: '4 / 5' },
  { index: 5,  id: 'S4-leather-smooth',  ratio: '1 / 1' },
  { index: 6,  id: 'S4-leather-croc',    ratio: '1 / 1' },
  { index: 7,  id: 'S4-leather-suede',   ratio: '1 / 1' },
  { index: 8,  id: 'S4-not-defect',      ratio: '4 / 3' },
  { index: 9,  id: 'S6-hands',           ratio: '4 / 3' },
  { index: 10, id: 'S6-portrait',        ratio: '4 / 5' },
  { index: 11, id: 'S7-kit',             ratio: '4 / 3' },
];

export function getShotCounts() {
  const product = getProductShots().length;
  return { product, story: storyShots.length, total: product + storyShots.length };
}

/** Markdown export, used both by the page and by the npm script. */
export function toMarkdown(): string {
  const product = getProductShots();
  const counts = getShotCounts();
  const date = new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    '# Naked Skin — Shot list',
    '',
    `Generated ${date}. **${counts.total} shots total** — ${counts.product} product, ${counts.story} story.`,
    '',
    '## Rules for every product shot',
    '',
  ];

  lines.push('', '## Product matrix', '');
  lines.push('| # | File | Leather | Colour | Angle | Done |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of product) {
    lines.push(`| ${s.index} | \`${s.filename}\` | ${s.leather} | ${s.color} | ${s.angle} | ☐ |`);
  }

  lines.push('', '## Story shots', '');
  lines.push('| # | Id | Subject | Requirement | Done |');
  lines.push('|---|---|---|---|---|');
  for (const s of storyShots) {
    lines.push(`| ${s.index} | \`${s.id}\` | ${s.id} | ${s.id} | ☐ |`);
  }

  return lines.join('\n');
}

export function toCsv(): string {
  const rows: string[] = ['index,type,file,leather,colour,angle,ratio'];
  for (const s of getProductShots()) {
    rows.push(`${s.index},product,${s.filename},${s.leather},${s.color},${s.angle},"${s.ratio}"`);
  }
  for (const s of storyShots) {
    rows.push(`${s.index},story,${s.id},,,,"${s.ratio}"`);
  }
  return rows.join('\n');
}
