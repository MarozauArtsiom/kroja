// components/landing/illustrations/StitchIllustration.tsx
// The saddle stitch: two threads cross through every hole, so the seam holds if one breaks.
// Drawn inline, not loaded as an image, because the text inside has to follow the page language.
'use client';

import { colors, threadHex } from '@/lib/data';
import { INK, MUTED } from '@/lib/schematic-tokens';
import { useI18n } from '@/components/i18n/I18nProvider';

const HOLES = [60, 120, 180, 240, 300, 360];

export default function StitchIllustration({ className }: { className?: string }) {
  const { dict } = useI18n();
  const t = dict.illustrations;
  const leather = colors.cognac.hex;
  const threadA = threadHex('linen', leather);

  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label={t.stitch}>
      <rect x="0" y="120" width="400" height="80" fill={leather} stroke={INK} strokeWidth="1.4" />

      <g fill={INK}>
        {HOLES.map((cx) => (
          <circle key={cx} cx={cx} cy="160" r="4" />
        ))}
      </g>

      {/* two threads crossing through every hole */}
      <path
        d="M 30 132 Q 60 160 120 132 Q 150 118 180 132 Q 210 160 240 132 Q 270 118 300 132 Q 330 160 380 132"
        fill="none" stroke={threadA} strokeWidth="2.6" strokeLinecap="round"
      />
      <path
        d="M 30 188 Q 60 160 120 188 Q 150 202 180 188 Q 210 160 240 188 Q 270 202 300 188 Q 330 160 380 188"
        fill="none" stroke={MUTED} strokeWidth="2.6" strokeLinecap="round"
      />

      <text x="20" y="44" fontSize="13" fill={INK} fontFamily="Georgia, serif">{t.stitchTitle}</text>
      <text x="20" y="66" fontSize="11" fill={MUTED} fontFamily="system-ui, sans-serif">{t.stitchLine1}</text>
      <text x="20" y="82" fontSize="11" fill={MUTED} fontFamily="system-ui, sans-serif">{t.stitchLine2}</text>

      <line x1="240" y1="230" x2="240" y2="176" stroke={MUTED} strokeWidth="0.9" />
      <text x="200" y="250" fontSize="10" fill={MUTED} fontFamily="system-ui, sans-serif">{t.stitchPoint}</text>
    </svg>
  );
}
