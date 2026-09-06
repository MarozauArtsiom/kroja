// app/[lang]/page.tsx
import { sections } from '@/content/sections';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import Reasons from '@/components/landing/Reasons';
import Sizes from '@/components/landing/Sizes';
import Leather from '@/components/landing/Leather';
import Process from '@/components/landing/Process';
import Included from '@/components/landing/Included';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';
import StickyCta from '@/components/landing/StickyCta';
import CartDrawer from '@/components/cart/CartDrawer';
import { getDictionary } from '@/content/i18n';
import type { SupportedLocale } from '@/types/i18n';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    title: { absolute: `${dict.brand.name} — ${dict.hero.title}` },
    description: dict.hero.subtitle,
    openGraph: {
      title: `${dict.brand.name} — ${dict.hero.title}`,
      description: dict.hero.subtitle,
      images: ['/illustrations/hero.svg'],
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: dict.brand.name,
    description: dict.hero.subtitle,
    address: { '@type': 'PostalAddress', addressLocality: 'Kraków', addressCountry: 'PL' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Reasons />
        <Sizes />
        <Leather />
        {sections.process !== false && <Process />}
        <Included />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <CartDrawer />
    </>
  );
}
