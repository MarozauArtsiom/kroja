// components/ui/FlagIcon.tsx
import type { SupportedLocale } from '@/types/i18n';

interface Props {
  locale: SupportedLocale;
  className?: string;
}

export default function FlagIcon({ locale, className = 'w-5 h-3.5' }: Props) {
  switch (locale) {
    case 'en':
      // United Kingdom / English Flag
      return (
        <svg viewBox="0 0 60 30" className={`inline-block shrink-0 rounded-xs shadow-xs ${className}`} aria-hidden="true">
          <clipPath id="uk-clip">
            <rect width="60" height="30" />
          </clipPath>
          <g clipPath="url(#uk-clip)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      );

    case 'pl':
      // Polish Flag (White / Red)
      return (
        <svg viewBox="0 0 60 38" className={`inline-block shrink-0 rounded-xs border border-line/40 shadow-xs ${className}`} aria-hidden="true">
          <rect width="60" height="19" fill="#FFFFFF" />
          <rect y="19" width="60" height="19" fill="#DC143C" />
        </svg>
      );

    case 'de':
      // German Flag (Black / Red / Gold)
      return (
        <svg viewBox="0 0 60 36" className={`inline-block shrink-0 rounded-xs shadow-xs ${className}`} aria-hidden="true">
          <rect width="60" height="12" fill="#000000" />
          <rect y="12" width="60" height="12" fill="#DD0000" />
          <rect y="24" width="60" height="12" fill="#FFCE00" />
        </svg>
      );

    case 'by':
      // Belarusian White-Red-White (⚪🔴⚪) Flag
      return (
        <svg viewBox="0 0 60 36" className={`inline-block shrink-0 rounded-xs border border-line/40 shadow-xs ${className}`} aria-hidden="true">
          <rect width="60" height="12" fill="#FFFFFF" />
          <rect y="12" width="60" height="12" fill="#E4161C" />
          <rect y="24" width="60" height="12" fill="#FFFFFF" />
        </svg>
      );

    case 'uk':
      // Ukrainian Flag (Blue / Yellow)
      return (
        <svg viewBox="0 0 60 38" className={`inline-block shrink-0 rounded-xs shadow-xs ${className}`} aria-hidden="true">
          <rect width="60" height="19" fill="#0057B7" />
          <rect y="19" width="60" height="19" fill="#FFD700" />
        </svg>
      );

    default:
      return null;
  }
}
