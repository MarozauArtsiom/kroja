// lib/pockets.ts
// Pure rules for the pocket layout: height budget, validity, URL format.
// No React, no locale — the configurator, the resolver and the drawing all read from here.
import type {
  AddPocketBlocker,
  Flap,
  Pocket,
  PocketKind,
  PocketLayout,
  PocketPresetCode,
  SizeCode,
} from '@/types/config';
import { sizes } from '@/content/sizes';
import {
  pockets as pocketDefs,
  POCKET_OVERLAP_MM,
  MAX_POCKETS_PER_FLAP,
  FLAP_MARGIN_MM,
} from '@/content/pockets';
import { pocketPresetList } from '@/content/pocket-presets';

export const FLAPS: Flap[] = ['front', 'back'];

/** Height a flap can give to pockets: cover height minus the seam margin top and bottom. */
export function pocketBudgetMm(size: SizeCode): number {
  return sizes[size].coverMm[1] - 2 * FLAP_MARGIN_MM;
}

/** Height a stack takes: each pocket's fold, minus the overlap between neighbours. */
export function stackHeightMm(stack: Pocket[]): number {
  if (stack.length === 0) return 0;
  const sum = stack.reduce((total, p) => total + pocketDefs[p.kind].heightMm, 0);
  return sum - POCKET_OVERLAP_MM * (stack.length - 1);
}

/**
 * Where each pocket sits, measured in mm up from the bottom of the working area.
 * Index 0 is the lowest pocket.
 */
export function pocketSpans(stack: Pocket[]): Array<{ bottomMm: number; topMm: number }> {
  const spans: Array<{ bottomMm: number; topMm: number }> = [];
  let bottom = 0;
  for (const p of stack) {
    const top = bottom + pocketDefs[p.kind].heightMm;
    spans.push({ bottomMm: bottom, topMm: top });
    bottom = top - POCKET_OVERLAP_MM;
  }
  return spans;
}

/** Why a pocket of this kind cannot go on top of the stack, or null if it can. */
export function addPocketBlocker(
  stack: Pocket[],
  kind: PocketKind,
  size: SizeCode,
): AddPocketBlocker | null {
  if (stack.length >= MAX_POCKETS_PER_FLAP) return 'max';
  // A corner holds a sheet by its corner: only at the very bottom, so only on an empty flap.
  if (kind === 'corner' && stack.length > 0) return 'corner';
  if (stackHeightMm([...stack, { kind, divided: false }]) > pocketBudgetMm(size)) return 'budget';
  return null;
}

/** Can a pocket of this kind be added on top of the stack? */
export function canAddPocket(stack: Pocket[], kind: PocketKind, size: SizeCode): boolean {
  return addPocketBlocker(stack, kind, size) === null;
}

/** Can the pocket at `index` swap places with its neighbour in `direction`? */
export function canMovePocket(stack: Pocket[], index: number, direction: 'up' | 'down'): boolean {
  const target = direction === 'up' ? index + 1 : index - 1;
  if (target < 0 || target >= stack.length) return false;
  // Nothing may leave or take the bottom slot of a corner.
  return stack[index].kind !== 'corner' && stack[target].kind !== 'corner';
}

/**
 * Brings one flap into a valid state. Never throws.
 * Rules, in order: a corner only at the bottom and only one; corners are never divided;
 * at most four pockets; the stack fits the size's budget — trimmed from the top.
 * Returns the fixed stack and whether anything had to change.
 */
export function normaliseStack(stack: Pocket[], size: SizeCode): { stack: Pocket[]; changed: boolean } {
  let next = stack
    .filter((p, i) => p.kind !== 'corner' || i === 0)
    .map((p) => (pocketDefs[p.kind].canDivide ? p : { ...p, divided: false }));

  next = next.slice(0, MAX_POCKETS_PER_FLAP);

  const budget = pocketBudgetMm(size);
  while (next.length > 0 && stackHeightMm(next) > budget) next = next.slice(0, -1);

  const changed =
    next.length !== stack.length ||
    next.some((p, i) => p.kind !== stack[i].kind || p.divided !== stack[i].divided);
  return { stack: next, changed };
}

/* ------------------------------------------------------------------ URL format */
// d = deep, m = medium, c = card, k = corner; '+' after a letter = divided.
// Pockets bottom to top, comma-separated; front and back separated by '|'.
// Example: "d,c+|m" — front: deep, then a divided card pocket; back: one medium.

const byLetter = Object.fromEntries(
  Object.values(pocketDefs).map((def) => [def.letter, def.code]),
) as Record<string, PocketKind>;

function serialiseStack(stack: Pocket[]): string {
  return stack.map((p) => pocketDefs[p.kind].letter + (p.divided ? '+' : '')).join(',');
}

export function serialisePockets(layout: PocketLayout): string {
  return `${serialiseStack(layout.front)}|${serialiseStack(layout.back)}`;
}

function parseStack(raw: string): Pocket[] {
  return raw
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
    .flatMap((token) => {
      const kind = byLetter[token[0]];
      if (!kind) return []; // unknown letter: dropped silently
      return [{ kind, divided: token.slice(1) === '+' }];
    });
}

/** Returns undefined when the parameter is absent, so the schema can apply its default. */
export function parsePockets(raw: string | null): PocketLayout | undefined {
  if (raw === null) return undefined;
  const [front = '', back = ''] = raw.split('|');
  return { front: parseStack(front), back: parseStack(back) };
}

/** The ready-made layout this one equals, or null for a custom layout. */
export function matchPocketPreset(layout: PocketLayout): PocketPresetCode | null {
  const key = serialisePockets(layout);
  return pocketPresetList.find((p) => serialisePockets(p.layout) === key)?.code ?? null;
}
