// lib/format.ts

/** 30000 -> "300 zł". Minor units in, display string out. */
export function formatPrice(minor: number): string {
  const major = minor / 100;
  const rounded = Number.isInteger(major) ? major.toString() : major.toFixed(2);
  return `${rounded} zł`;
}

/** 3000 -> "+30 zł". Used next to paid options. */
export function formatDelta(minor: number): string {
  if (minor === 0) return '';
  return `+${formatPrice(minor)}`;
}

/** [148, 210] -> "148 × 210 mm" */
export function formatDimensions([w, h]: [number, number], unit = 'mm'): string {
  return `${w} × ${h} ${unit}`;
}

/** 210 -> "210 g" */
export function formatWeight(grams: number, unit = 'g'): string {
  return `${grams} ${unit}`;
}

/** 1.8 -> "1.8 mm" */
export function formatThickness(mm: number, unit = 'mm'): string {
  return `${mm} ${unit}`;
}

/**
 * Replaces {name} placeholders in a dictionary string.
 * fill('Up to {max} slots', { max: 3 }) -> 'Up to 3 slots'
 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}
