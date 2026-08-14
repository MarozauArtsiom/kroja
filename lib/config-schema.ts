// lib/config-schema.ts
import { z } from 'zod';
import type { Configuration } from '@/types/config';
import { DEFAULT_SIZE } from '@/content/sizes';
import { DEFAULT_LEATHER } from '@/content/leathers';
import { DEFAULT_COLOR } from '@/content/colors';
import { DEFAULT_THREAD } from '@/content/threads';
import { DEFAULT_CORD } from '@/content/cords';
import { MAX_ENGRAVING_LENGTH, MAX_INSERTS_PER_TYPE } from '@/content/pricing';

/** Latin, Polish, Cyrillic letters, digits, space, dot, hyphen, ampersand. */
export const ENGRAVING_ALLOWED_RE =
  /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻа-яА-ЯёЁ .\-&]*$/;

/** Strips every character that is not allowed. Used on every keystroke. */
export function sanitizeEngraving(raw: string): string {
  return raw
    .split('')
    .filter((ch) => ENGRAVING_ALLOWED_RE.test(ch))
    .join('')
    .slice(0, MAX_ENGRAVING_LENGTH);
}

export const engravingSchema = z
  .object({
    text: z.string().max(MAX_ENGRAVING_LENGTH).catch(''),
    font: z.enum(['serif', 'sans']).catch('serif'),
    position: z.enum(['bottom-right', 'spine']).catch('bottom-right'),
  })
  .nullable()
  .catch(null);

export const insertSchema = z.object({
  type: z.enum(['plain', 'ruled', 'dot']).catch('dot'),
  qty: z.number().int().min(0).max(MAX_INSERTS_PER_TYPE).catch(1),
});

export const configSchema = z.object({
  size: z.enum(['a6', 'b6', 'standard', 'a5']).catch(DEFAULT_SIZE),
  leather: z.enum(['veg-tan', 'crazy-horse', 'pull-up']).catch(DEFAULT_LEATHER),
  color: z
    .enum(['natural', 'cognac', 'chestnut', 'olive', 'black', 'navy', 'burgundy'])
    .catch(DEFAULT_COLOR),
  thread: z.enum(['natural', 'tonal', 'contrast']).catch(DEFAULT_THREAD),
  cord: z.enum(['black', 'brown', 'olive', 'burgundy']).catch(DEFAULT_CORD),
  engraving: engravingSchema,
  inserts: z.array(insertSchema).max(3).catch([{ type: 'dot', qty: 1 }]),
  giftBox: z.boolean().catch(false),
});

export const DEFAULT_CONFIG: Configuration = {
  size: DEFAULT_SIZE,
  leather: DEFAULT_LEATHER,
  color: DEFAULT_COLOR,
  thread: DEFAULT_THREAD,
  cord: DEFAULT_CORD,
  engraving: null,
  inserts: [{ type: 'dot', qty: 1 }],
  giftBox: false,
};

/**
 * Parses anything into a valid Configuration.
 * Also normalises engraving: whitespace-only text becomes null.
 * NEVER throws.
 */
export function parseConfig(input: unknown): Configuration {
  const result = configSchema.safeParse(input);
  const parsed = result.success ? result.data : DEFAULT_CONFIG;

  let engraving = parsed.engraving;
  if (engraving) {
    const clean = sanitizeEngraving(engraving.text).trim();
    engraving = clean.length > 0 ? { ...engraving, text: clean } : null;
  }

  return { ...parsed, engraving } as Configuration;
}
