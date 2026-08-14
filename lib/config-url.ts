// lib/config-url.ts
import type { Configuration, InsertSelection } from '@/types/config';
import { parseConfig, DEFAULT_CONFIG } from './config-schema';
import { resolveConfiguration } from './availability';

export interface ParsedUrlConfig {
  config: Configuration;
  /** Messages about substitutions made because the URL asked for something impossible */
  warnings: string[];
}

/** Serialises inserts as `2:dot,1:ruled` */
function serialiseInserts(inserts: InsertSelection[]): string {
  return inserts
    .filter((i) => i.qty > 0)
    .map((i) => `${i.qty}:${i.type}`)
    .join(',');
}

function parseInserts(raw: string | null): InsertSelection[] | undefined {
  if (!raw) return undefined;
  const parts = raw.split(',').filter(Boolean);
  const result: InsertSelection[] = [];
  for (const part of parts) {
    const [qtyRaw, typeRaw] = part.split(':');
    const qty = Number.parseInt(qtyRaw, 10);
    if (Number.isNaN(qty)) continue;
    result.push({ type: typeRaw as InsertSelection['type'], qty });
  }
  return result.length > 0 ? result : undefined;
}

/**
 * Reads a configuration out of URL search params.
 * Unknown params are ignored. Invalid values fall back to defaults.
 * Impossible combinations are resolved to the closest valid one and reported in warnings.
 * NEVER throws.
 */
export function configFromSearchParams(
  params: URLSearchParams | Record<string, string | undefined>,
): ParsedUrlConfig {
  const get = (key: string): string | null => {
    if (params instanceof URLSearchParams) return params.get(key);
    return params[key] ?? null;
  };

  const engravingText = get('engraving');

  const raw = {
    size: get('size') ?? undefined,
    leather: get('leather') ?? undefined,
    color: get('color') ?? undefined,
    thread: get('thread') ?? undefined,
    cord: get('cord') ?? undefined,
    engraving: engravingText
      ? {
          text: engravingText,
          font: get('font') ?? undefined,
          position: get('pos') ?? undefined,
        }
      : null,
    inserts: parseInserts(get('inserts')),
    giftBox: get('box') === '1',
  };

  const parsed = parseConfig(raw);
  const { config, changes } = resolveConfiguration(parsed);

  return { config, warnings: changes };
}

/**
 * Serialises a configuration into search params.
 * Only writes values that differ from the default, to keep URLs short and shareable.
 */
export function configToSearchParams(config: Configuration): URLSearchParams {
  const p = new URLSearchParams();

  p.set('size', config.size);
  p.set('leather', config.leather);
  p.set('color', config.color);

  if (config.thread !== DEFAULT_CONFIG.thread) p.set('thread', config.thread);
  if (config.cord !== DEFAULT_CONFIG.cord) p.set('cord', config.cord);

  if (config.engraving && config.engraving.text.trim()) {
    p.set('engraving', config.engraving.text);
    p.set('font', config.engraving.font);
    p.set('pos', config.engraving.position);
  }

  const inserts = serialiseInserts(config.inserts);
  if (inserts) p.set('inserts', inserts);

  if (config.giftBox) p.set('box', '1');

  return p;
}

export function configToQueryString(config: Configuration): string {
  return `?${configToSearchParams(config).toString()}`;
}
