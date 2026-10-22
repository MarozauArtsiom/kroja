// components/configurator/summary.ts
// One-line summaries of the collapsed "Details" sections. Codes in, words out.
import type { Configuration } from '@/types/config';
import type { Dictionary } from '@/types/i18n';
import { PEN_HOLDER_MINOR } from '@/lib/data';
import { calculatePrice } from '@/lib/pricing';
import { fill, formatDelta } from '@/lib/format';

export type DetailId = 'thread' | 'penHolder' | 'pockets' | 'inserts';

export const DETAIL_IDS: DetailId[] = ['thread', 'penHolder', 'pockets', 'inserts'];

export interface SectionSummary {
  summary: string;
  delta?: string;
  deltaActive?: boolean;
}

export function detailSummaries(
  config: Configuration,
  dict: Dictionary,
): Record<DetailId, SectionSummary> {
  const price = calculatePrice(config);

  return {
    thread: {
      summary: dict.threads[config.thread],
      delta: formatDelta(price.threadMinor) || undefined,
      deltaActive: true,
    },
    penHolder: {
      summary: dict.options.penHolders[config.penHolder].title,
      delta: formatDelta(price.penHolderMinor || PEN_HOLDER_MINOR),
      deltaActive: price.penHolderMinor > 0,
    },
    pockets: {
      summary: fill(dict.configurator.pocketsSummary, {
        front: config.pockets.front.length,
        back: config.pockets.back.length,
      }),
      delta: dict.configurator.pocketsIncluded,
      deltaActive: false,
    },
    inserts: {
      summary: config.inserts
        .map((i) => fill(dict.configurator.insertsSummary, { qty: i.qty, name: dict.insertTypes[i.type] }))
        .join(', '),
      delta: formatDelta(price.insertsMinor) || undefined,
      deltaActive: true,
    },
  };
}
