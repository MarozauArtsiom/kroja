// lib/config-schema.ts
import { z } from 'zod';
import type { Configuration } from '@/types/config';
import { DEFAULT_SIZE } from '@/content/sizes';
import { DEFAULT_LEATHER } from '@/content/leathers';
import { DEFAULT_COLOR } from '@/content/colors';
import { DEFAULT_THREAD } from '@/content/threads';
import { DEFAULT_CLOSURE } from '@/content/closures';
import { DEFAULT_PEN_HOLDER } from '@/content/pen-holders';
import { DEFAULT_POCKETS } from '@/content/pockets';
import { MAX_EMBOSSING_LENGTH, MAX_INSERTS_PER_TYPE } from '@/content/pricing';

/**
 * One uppercase letter: Latin A–Z, Polish diacritics, Cyrillic А–Я plus Ё and the
 * Belarusian / Ukrainian letters Ў І Ї Є Ґ. Nothing else — no digits, no punctuation, no space.
 */
export const EMBOSSING_LETTER_RE = /^[A-ZĄĆĘŁŃÓŚŹŻА-ЯЁЎІЇЄҐ]$/;

/** Uppercases, drops every disallowed character, cuts to the max length. Used on every keystroke. */
export function sanitizeEmbossing(raw: string): string {
  return raw
    .toUpperCase()
    .split('')
    .filter((ch) => EMBOSSING_LETTER_RE.test(ch))
    .join('')
    .slice(0, MAX_EMBOSSING_LENGTH);
}

export const embossingSchema = z
  .object({
    text: z.string().max(MAX_EMBOSSING_LENGTH).catch(''),
    font: z.enum(['serif', 'sans']).catch('serif'),
    position: z.enum(['bottom-right', 'spine']).catch('bottom-right'),
  })
  .nullable()
  .catch(null);

export const insertSchema = z.object({
  type: z.enum(['plain', 'ruled', 'dot']).catch('dot'),
  qty: z.number().int().min(0).max(MAX_INSERTS_PER_TYPE).catch(1),
});

export const pocketSchema = z.object({
  kind: z.enum(['deep', 'medium', 'card', 'corner']),
  divided: z.boolean().catch(false),
});

/** Bad entries are dropped one by one; a broken layout as a whole falls back to the default. */
const pocketStackSchema = z
  .array(z.unknown())
  .transform((items) =>
    items.flatMap((item) => {
      const parsed = pocketSchema.safeParse(item);
      return parsed.success ? [parsed.data] : [];
    }),
  );

export const pocketLayoutSchema = z
  .object({ front: pocketStackSchema, back: pocketStackSchema })
  .catch(DEFAULT_POCKETS);

export const configSchema = z.object({
  size: z.enum(['a6', 'b6', 'standard', 'a5']).catch(DEFAULT_SIZE),
  leather: z.enum(['smooth', 'croc', 'suede']).catch(DEFAULT_LEATHER),
  color: z
    .enum(['natural', 'cognac', 'chestnut', 'olive', 'black', 'navy', 'burgundy', 'sand', 'graphite'])
    .catch(DEFAULT_COLOR),
  thread: z.enum(['tonal', 'linen', 'cream', 'black', 'brown', 'navy']).catch(DEFAULT_THREAD),
  closure: z.enum(['elastic', 'buckle', 'none']).catch(DEFAULT_CLOSURE),
  penHolder: z.enum(['none', 'slim', 'wide']).catch(DEFAULT_PEN_HOLDER),
  pockets: pocketLayoutSchema,
  embossing: embossingSchema,
  inserts: z.array(insertSchema).max(3).catch([{ type: 'dot', qty: 1 }]),
  giftBox: z.boolean().catch(false),
});

export const DEFAULT_CONFIG: Configuration = {
  size: DEFAULT_SIZE,
  leather: DEFAULT_LEATHER,
  color: DEFAULT_COLOR,
  thread: DEFAULT_THREAD,
  closure: DEFAULT_CLOSURE,
  penHolder: DEFAULT_PEN_HOLDER,
  pockets: DEFAULT_POCKETS,
  embossing: null,
  inserts: [{ type: 'dot', qty: 1 }],
  giftBox: false,
};

/**
 * Parses anything into a valid Configuration.
 * Also normalises embossing: after sanitising, an empty text becomes null.
 * NEVER throws.
 */
export function parseConfig(input: unknown): Configuration {
  const result = configSchema.safeParse(input);
  const parsed = result.success ? result.data : DEFAULT_CONFIG;

  let embossing = parsed.embossing;
  if (embossing) {
    const clean = sanitizeEmbossing(embossing.text);
    embossing = clean.length > 0 ? { ...embossing, text: clean } : null;
  }

  return { ...parsed, embossing } as Configuration;
}
