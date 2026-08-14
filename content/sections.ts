// content/sections.ts

/**
 * Landing section visibility.
 * Turn a section on only when the required photography actually exists.
 */
export const sections = {
  /** S5 Patina before/after — needs a photo of a year-old piece. Does not exist yet. */
  patina: false,
  /** S6 Process — 'full' needs 6 process shots, 'compact' needs 2. */
  process: 'compact' as 'full' | 'compact' | false,
  /** S8 Reviews — real reviews only. Never invent them. */
  reviews: false,
} as const;
