// lib/assets.ts
import type { Configuration, Angle, LeatherCode, ColorCode } from '@/types/config';

/**
 * Switch to 'photo' once real photography exists in /public/previews.
 * Everything else in the app adapts automatically.
 */
export const ASSET_MODE: 'schematic' | 'photo' = 'schematic';

/** Show the "technical drawing" note and NOT IN FRAME badge. Turn off with photos. */
export const SHOW_SCHEMATIC_NOTES = ASSET_MODE === 'schematic';

/** NOTE: size is deliberately not part of the key. */
export function previewKey(leather: LeatherCode, color: ColorCode): string {
  return `${leather}_${color}`;
}

export function previewFilename(
  leather: LeatherCode,
  color: ColorCode,
  angle: Angle,
): string {
  return `${previewKey(leather, color)}_${angle}.webp`;
}

export type PreviewSource =
  | { kind: 'schematic'; config: Configuration; angle: Angle; filename: string }
  | { kind: 'photo'; src: string; alt: string };

export function getPreview(config: Configuration, angle: Angle): PreviewSource {
  const filename = previewFilename(config.leather, config.color, angle);

  // 'back' is never photographed: the elastic knot and the strap anchor are drawn
  // by the site, so this angle stays schematic even after photography arrives.
  if (ASSET_MODE === 'schematic' || angle === 'back') {
    return { kind: 'schematic', config, angle, filename };
  }

  return {
    kind: 'photo',
    src: `/previews/${filename}`,
    alt: `Naked Skin notebook cover, ${config.leather} leather, ${config.color}, ${angle} view`,
  };
}
