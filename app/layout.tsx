import type { Metadata } from 'next';
import { Newsreader, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
    default: 'Naked Skin — Handmade leather notebook covers',
    template: '%s — Naked Skin',
  },
  description:
    'Refillable full-grain leather notebook covers, hand-stitched in Kraków. Choose size, leather, colour, closure and embossing. Ships across the EU.',
  openGraph: {
    type: 'website',
    siteName: 'Naked Skin',
    title: 'Naked Skin — Handmade leather notebook covers',
    description: 'Hand-stitched in Kraków. Built to your specification.',
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
