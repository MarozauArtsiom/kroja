// app/[lang]/configurator/page.tsx
import { Suspense } from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ConfiguratorClient from '@/components/configurator/ConfiguratorClient';
import { getDictionary } from '@/content/i18n';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    title: dict.configurator.title,
    description: dict.hero.subtitle,
  };
}

export default function LocalizedConfiguratorPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container-content section">Loading…</div>}>
        <ConfiguratorClient />
      </Suspense>
      <Footer />
      <CartDrawer />
    </>
  );
}
