// lib/shotlist.ts
import type { LeatherCode, ColorCode, Angle } from '@/types/config';
import { leatherList } from '@/content/leathers';
import { colors } from '@/content/colors';
import { angleList } from '@/content/shots';
import { getStock } from '@/lib/availability';
import { previewFilename } from '@/lib/assets';
import { globalShotRules } from '@/content/shots';

export interface ProductShot {
  index: number;
  leather: LeatherCode;
  leatherName: string;
  color: ColorCode;
  colorName: string;
  angle: Angle;
  angleName: string;
  ratio: string;
  filename: string;
  mustShow: string[];
}

export interface StoryShot {
  index: number;
  id: string;
  subject: string;
  requirement: string;
  why: string;
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
          leatherName: leather.name,
          color: colorCode,
          colorName: colors[colorCode].name,
          angle: angle.angle,
          angleName: angle.name,
          ratio: angle.ratio,
          filename: previewFilename(leather.code, colorCode, angle.angle),
          mustShow: angle.mustShow,
        });
      }
    }
  }

  return shots;
}

/** Story shots for the landing page. Kept here so the list stays in one place. */
export const storyShots: StoryShot[] = [
  { index: 1, id: 'S1-hero', subject: 'Cover held in one hand or resting on a desk', requirement: 'Warm side light, horizontal frame with space for text', why: 'Hero image — the first thing anyone sees', ratio: '4 / 3' },
  { index: 2, id: 'S2-stitch-macro', subject: 'Macro: saddle stitch on the cover edge', requirement: 'Side light to reveal thread relief, 4–5 stitches fill the frame', why: 'Proves the stitching is done by hand', ratio: '4 / 5' },
  { index: 3, id: 'S2-grain-macro', subject: 'Macro: full-grain leather surface', requirement: 'At least 2000 px, no retouching of the texture', why: 'Shows what full-grain actually looks like', ratio: '4 / 5' },
  { index: 4, id: 'S2-edge-macro', subject: 'Macro: burnished edge', requirement: 'Raking light along the edge', why: 'Edge finish is the clearest sign of skill', ratio: '4 / 5' },
  { index: 5, id: 'S4-leather-smooth', subject: 'Macro: smooth leather grain', requirement: 'Flat even light, square frame', why: 'Leather comparison section', ratio: '1 / 1' },
  { index: 6, id: 'S4-leather-croc', subject: 'Macro: croc-embossed relief, raking light', requirement: 'Flat even light plus one raking light, square frame, same distance as the others', why: 'Leather comparison section', ratio: '1 / 1' },
  { index: 7, id: 'S4-leather-suede', subject: 'Macro: suede nap, brushed two ways', requirement: 'Flat even light, square frame, same distance as the others', why: 'Leather comparison section', ratio: '1 / 1' },
  { index: 8, id: 'S4-not-defect', subject: 'Natural marks: scars, insect bites, uneven colour', requirement: 'Marks clearly visible, close crop', why: 'The "this is not a defect" block', ratio: '4 / 3' },
  { index: 9, id: 'S6-hands', subject: 'Hands at work with a tool', requirement: 'Shot during real work, not staged afterwards', why: 'Proof the work is manual', ratio: '4 / 3' },
  { index: 10, id: 'S6-portrait', subject: 'Portrait of the maker at the bench, face visible', requirement: 'Natural light, no posing', why: 'An anonymous "craftsman" does not build trust', ratio: '4 / 5' },
  { index: 11, id: 'S7-kit', subject: 'Everything that ships, laid out flat', requirement: 'Top-down, even light, neutral surface', why: 'Sets expectations about what arrives', ratio: '4 / 3' },
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

  for (const rule of globalShotRules) lines.push(`- ${rule}`);

  lines.push('', '## Product matrix', '');
  lines.push('| # | File | Leather | Colour | Angle | Done |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of product) {
    lines.push(`| ${s.index} | \`${s.filename}\` | ${s.leatherName} | ${s.colorName} | ${s.angleName} | ☐ |`);
  }

  lines.push('', '## Story shots', '');
  lines.push('| # | Id | Subject | Requirement | Done |');
  lines.push('|---|---|---|---|---|');
  for (const s of storyShots) {
    lines.push(`| ${s.index} | \`${s.id}\` | ${s.subject} | ${s.requirement} | ☐ |`);
  }

  return lines.join('\n');
}

export function toCsv(): string {
  const rows: string[] = ['index,type,file,leather,colour,angle,ratio'];
  for (const s of getProductShots()) {
    rows.push(`${s.index},product,${s.filename},${s.leatherName},${s.colorName},${s.angleName},"${s.ratio}"`);
  }
  for (const s of storyShots) {
    rows.push(`${s.index},story,${s.id},,,,"${s.ratio}"`);
  }
  return rows.join('\n');
}
