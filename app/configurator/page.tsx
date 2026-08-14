import { Suspense } from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ConfiguratorClient from '@/components/configurator/ConfiguratorClient';

export const metadata = {
  title: 'Build your notebook — KROJA',
  description: 'Choose size, leather, colour, thread and engraving.',
};

export default function ConfiguratorPage() {
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
