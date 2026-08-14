// components/configurator/useConfigurator.ts
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { Configuration, PricedConfiguration } from '@/types/config';
import { configFromSearchParams, configToSearchParams } from '@/lib/config-url';
import { resolveConfiguration, getStock, getProductionDays } from '@/lib/availability';
import { calculatePrice } from '@/lib/pricing';
import { previewKey } from '@/lib/assets';
import { useToast } from '@/components/ui/Toast';

/** Changing these two axes writes a history entry. Everything else uses replace. */
const HISTORY_KEYS: Array<keyof Configuration> = ['size', 'leather'];

export function useConfigurator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const { config, warnings } = useMemo(
    () => configFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const priced: PricedConfiguration = useMemo(() => {
    const price = calculatePrice(config);
    return {
      ...config,
      totalMinor: price.totalMinor,
      currency: 'PLN',
      productionDays: getProductionDays(config.leather, config.color),
      stock: getStock(config.leather, config.color),
      previewKey: previewKey(config.leather, config.color),
    };
  }, [config]);

  const breakdown = useMemo(() => calculatePrice(config), [config]);

  const update = useCallback(
    (patch: Partial<Configuration>) => {
      const candidate: Configuration = { ...config, ...patch };
      const { config: resolved, changes } = resolveConfiguration(candidate);

      changes.forEach((message) => showToast(message));

      const params = configToSearchParams(resolved);
      const url = `${pathname}?${params.toString()}`;

      const writesHistory = Object.keys(patch).some((key) =>
        HISTORY_KEYS.includes(key as keyof Configuration),
      );

      if (writesHistory) {
        router.push(url, { scroll: false });
      } else {
        router.replace(url, { scroll: false });
      }
    },
    [config, pathname, router, showToast],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { config, priced, breakdown, warnings, update, reset };
}
