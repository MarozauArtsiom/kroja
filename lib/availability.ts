// lib/availability.ts
import type {
  LeatherCode, ColorCode, SizeCode, StockStatus, Configuration, InsertSelection,
} from '@/types/config';
import { sizes } from '@/content/sizes';
import { leathers } from '@/content/leathers';
import { colors, colorList } from '@/content/colors';
import { stock, stockKey, productionDays } from '@/content/availability';

export type OptionState =
  | { kind: 'available'; status: 'in_stock' | 'made_to_order' }
  | { kind: 'unavailable'; reason: string }
  | { kind: 'not-in-leather'; reason: string };

export function getStock(leather: LeatherCode, color: ColorCode): StockStatus {
  return stock[stockKey(leather, color)] ?? 'unavailable';
}

export function getProductionDays(leather: LeatherCode, color: ColorCode): number {
  const s = getStock(leather, color);
  if (s === 'unavailable') return productionDays.made_to_order;
  return productionDays[s];
}

/** Can this leather be made in this size at all? */
export function isSizeAvailableInLeather(leather: LeatherCode, size: SizeCode): boolean {
  return leathers[leather].availableSizes.includes(size);
}

/** Does this leather exist in this colour at all (regardless of stock)? */
export function isColorInLeather(leather: LeatherCode, color: ColorCode): boolean {
  return leathers[leather].availableColors.includes(color);
}

/** Full UI state of a colour swatch for a given leather. */
export function getColorState(leather: LeatherCode, color: ColorCode): OptionState {
  if (!isColorInLeather(leather, color)) {
    return {
      kind: 'not-in-leather',
      reason: `Not available in ${leathers[leather].name}`,
    };
  }
  const s = getStock(leather, color);
  if (s === 'unavailable') {
    return { kind: 'unavailable', reason: 'Currently unavailable' };
  }
  return { kind: 'available', status: s };
}

/** Full UI state of a leather card for a given size. */
export function getLeatherState(leather: LeatherCode, size: SizeCode): OptionState {
  if (!isSizeAvailableInLeather(leather, size)) {
    return {
      kind: 'not-in-leather',
      reason: `Not available in this size`,
    };
  }
  return { kind: 'available', status: 'in_stock' };
}

/** Is a colour selectable right now (exists in leather AND in stock)? */
export function isColorSelectable(leather: LeatherCode, color: ColorCode): boolean {
  return getColorState(leather, color).kind === 'available';
}

/**
 * Best replacement colour when the current one cannot be used.
 * Priority order comes from colors.order (lower = higher priority).
 * Returns null only if the leather has no selectable colour at all.
 */
export function findClosestColor(leather: LeatherCode): ColorCode | null {
  const candidates = colorList
    .filter((c) => isColorSelectable(leather, c.code))
    .sort((a, b) => a.order - b.order);
  return candidates[0]?.code ?? null;
}

/** Reduces insert quantities, last items first, until the total fits the capacity. */
function clampInserts(inserts: InsertSelection[], capacity: number): InsertSelection[] {
  let remaining = capacity;
  return inserts
    .map((item) => {
      const qty = Math.max(0, Math.min(item.qty, remaining));
      remaining -= qty;
      return { ...item, qty };
    })
    .filter((item) => item.qty > 0);
}

export interface ResolveResult {
  config: Configuration;
  /** Human-readable messages about what was changed and why. Empty if nothing changed. */
  changes: string[];
}

/**
 * Takes any configuration (possibly invalid) and returns the closest valid one.
 * NEVER throws. NEVER returns an invalid configuration.
 */
export function resolveConfiguration(input: Configuration): ResolveResult {
  const changes: string[] = [];
  let { leather, color, inserts, cardSlots } = input;
  const { size } = input;

  // Rule 1: size wins over leather.
  // If the leather cannot be made in this size, switch to a leather that can.
  if (!isSizeAvailableInLeather(leather, size)) {
    const fallback = Object.values(leathers)
      .sort((a, b) => a.order - b.order)
      .find((l) => l.availableSizes.includes(size));
    if (fallback) {
      changes.push(
        `Leather changed to ${fallback.name} — ${leathers[leather].name} is not made in this size`,
      );
      leather = fallback.code;
    }
  }

  // Rule 2: colour is substituted if it does not exist in the leather or is out of stock.
  if (!isColorSelectable(leather, color)) {
    const replacement = findClosestColor(leather);
    if (replacement) {
      changes.push(
        `Colour changed to ${colors[replacement].name} — ${colors[color].name} is not available in ${leathers[leather].name}`,
      );
      color = replacement;
    }
  }

  // Rule 3: paper inserts cannot exceed what the size holds.
  const capacity = sizes[size].insertCapacity;
  const totalInserts = inserts.reduce((sum, i) => sum + i.qty, 0);
  if (totalInserts > capacity) {
    inserts = clampInserts(inserts, capacity);
    changes.push(`Inserts reduced to ${capacity} — ${sizes[size].name} holds no more`);
  }

  // Rule 4: card slots cannot exceed what the size holds.
  const maxSlots = sizes[size].cardSlotsMax;
  if (cardSlots > maxSlots) {
    changes.push(`Card slots reduced to ${maxSlots} — ${sizes[size].name} holds no more`);
    cardSlots = maxSlots;
  }

  return { config: { ...input, leather, color, inserts, cardSlots }, changes };
}
