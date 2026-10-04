// components/landing/illustrations/RefillIllustration.tsx
// The core argument: one cover, many paper refills. Drawn inline so the captions are translated.
'use client';

import { colors, threadHex } from '@/lib/data';
import { INK, MUTED, LINE, PAPER } from '@/lib/schematic-tokens';
import { useI18n } from '@/components/i18n/I18nProvider';

/** Three sheets, each offset from the one behind it. */
const SHEETS = [
  { x: 262, y: 52 },
  { x: 272, y: 66 },
  { x: 282, y: 80 },
];

export default function RefillIllustration({ className }: { className?: string }) {
  const { dict } = useI18n();
  const t = dict.illustrations;
  const leather = colors.cognac.hex;
  const stitch = threadHex('linen', leather);

  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={t.refill}>
      <rect x="30" y="60" width="150" height="200" rx="5" fill={leather} stroke={INK} strokeWidth="1.5" />
      <rect x="42" y="72" width="126" height="176" rx="3" fill="none" stroke={stitch}
            strokeWidth="1.3" strokeDasharray="4 4" />
      <text x="105" y="284" textAnchor="middle" fontSize="11" fill={INK}
            fontFamily="system-ui, sans-serif">{t.refillCover}</text>

      <path d="M 200 160 L 240 160 M 228 150 L 240 160 L 228 170" fill="none" stroke={MUTED}
            strokeWidth="1.6" strokeLinecap="round" />

      <g>
        {SHEETS.map((s) => (
          <rect key={s.x} x={s.x} y={s.y} width="100" height="140" rx="3" fill={PAPER}
                stroke={INK} strokeWidth="1" />
        ))}
        <g stroke={LINE} strokeWidth="0.9">
          {[110, 130, 150, 170].map((y) => (
            <line key={y} x1="294" y1={y} x2="370" y2={y} />
          ))}
        </g>
      </g>
      <text x="332" y="248" textAnchor="middle" fontSize="11" fill={INK}
            fontFamily="system-ui, sans-serif">{t.refillMany}</text>
    </svg>
  );
}
