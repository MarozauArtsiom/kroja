// app/page.tsx
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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Reasons />
        <Sizes />
        <Leather />
        {/* S5 Patina: hidden — no year-old photograph exists */}
        {sections.process !== false && <Process />}
        <Included />
        {/* S8 Reviews: hidden — real reviews only, never invented */}
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <CartDrawer />
    </>
  );
}
