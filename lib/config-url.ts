import type { Configuration, InsertSelection } from '@/types/config';
import { parseConfig, DEFAULT_CONFIG } from './config-schema';
import { resolveConfiguration, type ConfigChange } from './availability';

export interface ParsedUrlConfig {
  config: Configuration;
  /** Messages about substitutions made because the URL asked for something impossible */
  warnings: ConfigChange[];
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

  const embossText = get('emboss');
  const cardsRaw = get('cards');

  const raw = {
    size: get('size') ?? undefined,
    leather: get('leather') ?? undefined,
    color: get('color') ?? undefined,
    thread: get('thread') ?? undefined,
    closure: get('closure') ?? undefined,
    elasticColor: get('elastic') ?? undefined,
    penHolder: get('pen') ?? undefined,
    cardSlots: cardsRaw ? Number.parseInt(cardsRaw, 10) : undefined,
    embossing: embossText
      ? {
          text: embossText,
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
  if (config.closure !== DEFAULT_CONFIG.closure) p.set('closure', config.closure);
  if (config.closure === 'elastic' && config.elasticColor !== DEFAULT_CONFIG.elasticColor) {
    p.set('elastic', config.elasticColor);
  }
  if (config.penHolder !== 'none') p.set('pen', config.penHolder);
  if (config.cardSlots > 0) p.set('cards', String(config.cardSlots));

  if (config.embossing && config.embossing.text.trim()) {
    p.set('emboss', config.embossing.text);
    p.set('font', config.embossing.font);
    p.set('pos', config.embossing.position);
  }

  const inserts = serialiseInserts(config.inserts);
  if (inserts) p.set('inserts', inserts);

  if (config.giftBox) p.set('box', '1');

  return p;
}

export function configToQueryString(config: Configuration): string {
  return `?${configToSearchParams(config).toString()}`;
}
