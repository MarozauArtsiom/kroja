// components/landing/Footer.tsx
import { copy } from '@/content/copy';

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="container-content flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xl text-ink">{copy.brand.name}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">{copy.footer.line}</p>
        </div>
        <div className="text-sm text-muted">
          <p>{copy.brand.city}</p>
          <p className="mt-1">hello@kroja.example</p>
          <p className="mt-3 text-xs">© {new Date().getFullYear()} KROJA. {copy.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
