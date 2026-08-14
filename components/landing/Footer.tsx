// components/landing/Footer.tsx
'use client';

import { useI18n } from '@/components/i18n/I18nProvider';

export default function Footer() {
  const { dict } = useI18n();

  return (
    <footer className="border-t border-line py-12">
      <div className="container-content flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xl text-ink">{dict.brand.name}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">{dict.footer.line}</p>
        </div>
        <div className="text-sm text-muted">
          <p>{dict.brand.city}</p>
          <p className="mt-1">hello@kroja.example</p>
          <p className="mt-3 text-xs">
            © {new Date().getFullYear()} {dict.brand.name}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
