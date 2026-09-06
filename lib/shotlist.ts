// lib/shotlist.ts
import type { LeatherCode, ColorCode, Angle } from '@/types/config';
import type { Dictionary } from '@/types/i18n';
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
export function toMarkdown(dict: Dictionary): string {
  const product = getProductShots();
  const counts = getShotCounts();
  const date = new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    `# ${dict.brand.name} — ${dict.shotlist.title}`,
    '',
    `${dict.shotlist.generated} ${date}. **${counts.total} ${dict.shotlist.totalLabel}** — ${counts.product} + ${counts.story}.`,
    '',
    `## ${dict.shotlist.rulesTitle}`,
    '',
  ];

  for (const rule of dict.shotlist.rules) lines.push(`- ${rule}`);

  lines.push('', `## ${dict.shotlist.productShots}`, '');
  lines.push('| # | File | Leather | Colour | Angle | Done |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of product) {
    lines.push(
      `| ${s.index} | \`${s.filename}\` | ${dict.leatherNames[s.leather]} | ${dict.colors[s.color]} | ${dict.angles[s.angle]} | ☐ |`,
    );
  }

  lines.push('', `## ${dict.shotlist.storyShots}`, '');
  lines.push('| # | Id | Subject | Requirement | Done |');
  lines.push('|---|---|---|---|---|');
  for (const s of storyShots) {
    const copy = dict.shotlist.stories[s.id];
    lines.push(`| ${s.index} | \`${s.id}\` | ${copy.subject} | ${copy.requirement} | ☐ |`);
  }

  return lines.join('\n');
}

export function toCsv(dict: Dictionary): string {
  const rows: string[] = ['index,type,file,leather,colour,angle,ratio'];
  for (const s of getProductShots()) {
    rows.push(
      `${s.index},product,${s.filename},${dict.leatherNames[s.leather]},${dict.colors[s.color]},${dict.angles[s.angle]},"${s.ratio}"`,
    );
  }
  for (const s of storyShots) {
    rows.push(`${s.index},story,${s.id},,,,"${s.ratio}"`);
  }
  return rows.join('\n');
}
