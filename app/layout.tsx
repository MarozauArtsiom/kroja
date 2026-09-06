import type { Metadata } from 'next';
import { Newsreader, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

import { en } from '@/content/i18n/dict/en';

const display = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nakedskin.vercel.app'),
  title: {
    default: `${en.brand.name} — ${en.brand.tagline}`,
    template: `%s — ${en.brand.name}`,
  },
  description: en.meta.siteDescription,
  openGraph: {
    type: 'website',
    siteName: en.brand.name,
    title: `${en.brand.name} — ${en.brand.tagline}`,
    description: en.meta.ogDescription,
    images: ['/illustrations/hero.svg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
