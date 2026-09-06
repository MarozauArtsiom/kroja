// store/cart.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PricedConfiguration, Configuration } from '@/types/config';

/** Deterministic key for a configuration. Order of inserts must not matter. */
export function configHash(config: Configuration): string {
  const inserts = [...config.inserts]
    .filter((i) => i.qty > 0)
    .sort((a, b) => a.type.localeCompare(b.type))
    .map((i) => `${i.type}:${i.qty}`)
    .join(',');

  const embossing = config.embossing?.text.trim()
    ? `${config.embossing.text.trim()}|${config.embossing.font}|${config.embossing.position}`
    : '';

  // Band colour only matters when the band is actually there.
  const closure = config.closure === 'elastic' ? `elastic:${config.elasticColor}` : config.closure;

  return [
    config.size,
    config.leather,
    config.color,
    config.thread,
    closure,
    config.penHolder,
    `cards:${config.cardSlots}`,
    embossing,
    inserts,
    config.giftBox ? 'box' : '',
  ].join('__');
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (config: PricedConfiguration) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  totalMinor: () => number;
  totalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (config) => {
        const id = configHash(config);
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return {
            items: [...state.items, { id, config, qty: 1, addedAt: Date.now() }],
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      totalMinor: () =>
        get().items.reduce((sum, i) => sum + i.config.totalMinor * i.qty, 0),

      totalCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'nakedskin:cart',
      // Version 1 stored configurations with leathers that no longer exist. Drop them.
      version: 2,
      migrate: () => ({ items: [] }) as unknown as CartState,
      // Do not persist UI state
      partialize: (state) => ({ items: state.items }) as CartState,
    },
  ),
);
