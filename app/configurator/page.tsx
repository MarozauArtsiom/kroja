import { Suspense } from 'react';
import ConfiguratorClient from '@/components/configurator/ConfiguratorClient';

export const metadata = {
  title: 'Build your notebook — KROJA',
  description: 'Choose size, leather, colour, thread and engraving.',
};

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={<div className="container-content section">Loading…</div>}>
      <ConfiguratorClient />
    </Suspense>
  );
}
