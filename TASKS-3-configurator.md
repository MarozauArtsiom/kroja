# TASKS 3 — Конструктор (EPIC 4)

Задачи T-050 … T-061. Это ядро продукта.

---

> ⚠️ **Порядок важен.** T-048 и T-049 идут первыми, потому что на них ссылается sticky-панель конструктора (T-058). Если сделать их позже, сборка упадёт на отсутствующем импорте.

## T-048 — Стор корзины

**Depends on:** T-010, T-019, T-025
**Estimate:** 2ч
**Files:** создать `store/cart.ts`

### Business
Две одинаковые конфигурации складываются в одну позицию с количеством 2. Две разные — две отдельные позиции. Сравнение идёт по хешу нормализованной конфигурации: порядок вкладышей и пробелы в гравировке не должны создавать «разные» товары.

Корзина переживает перезагрузку страницы.

### Code

```ts
// store/cart.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PricedConfiguration, Configuration } from '@/types/config';

/** Deterministic key for a configuration. Order of inserts and stray spaces must not matter. */
export function configHash(config: Configuration): string {
  const inserts = [...config.inserts]
    .filter((i) => i.qty > 0)
    .sort((a, b) => a.type.localeCompare(b.type))
    .map((i) => `${i.type}:${i.qty}`)
    .join(',');

  const engraving = config.engraving?.text.trim()
    ? `${config.engraving.text.trim()}|${config.engraving.font}|${config.engraving.position}`
    : '';

  return [
    config.size,
    config.leather,
    config.color,
    config.thread,
    config.cord,
    engraving,
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
      name: 'kroja:cart',
      // Do not persist UI state
      partialize: (state) => ({ items: state.items }) as CartState,
    },
  ),
);
```

### Do NOT
- ❌ Не сохранять `isOpen` в localStorage — иначе корзина откроется сама при следующем визите
- ❌ Не хранить цены отдельно от конфигурации

### Acceptance
- [ ] Добавление одинаковой конфигурации дважды даёт одну позицию с `qty: 2`
- [ ] Добавление конфигурации с другим цветом даёт вторую позицию
- [ ] Гравировка `'ANNA'` и `' ANNA '` дают одну и ту же позицию
- [ ] Перезагрузка страницы сохраняет содержимое корзины
- [ ] После перезагрузки корзина закрыта

---

## T-049 — Модалка подтверждения гравировки

**Depends on:** T-034, T-018
**Estimate:** 1.5ч
**Files:** создать `components/configurator/EngravingConfirmModal.tsx`

### Business
Единственное место в проекте, где мы **намеренно ставим препятствие**. Цена ошибки максимальная: гравировку нельзя переделать после изготовления. Текст показывается крупно, тем же шрифтом, который выбран.

### Code

```tsx
// components/configurator/EngravingConfirmModal.tsx
'use client';

import type { EngravingFont } from '@/types/config';
import { copy } from '@/content/copy';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  open: boolean;
  text: string;
  font: EngravingFont;
  onEdit: () => void;
  onConfirm: () => void;
}

export default function EngravingConfirmModal({ open, text, font, onEdit, onConfirm }: Props) {
  return (
    <Modal
      open={open}
      title={copy.cart.engravingConfirmTitle}
      onClose={onEdit}
      footer={
        <>
          <Button variant="secondary" onClick={onEdit}>
            {copy.cart.engravingConfirmEdit}
          </Button>
          <Button onClick={onConfirm}>{copy.cart.engravingConfirmOk}</Button>
        </>
      }
    >
      <p
        className={`mb-4 border border-line bg-paper-2 p-6 text-center text-2xl text-ink ${
          font === 'serif' ? 'font-display' : 'font-sans'
        }`}
      >
        {text}
      </p>
      <p>{copy.cart.engravingConfirmBody}</p>
    </Modal>
  );
}
```

### Acceptance
- [ ] Модалка появляется только когда гравировка непустая
- [ ] Текст показан крупно выбранным шрифтом
- [ ] «Edit» закрывает модалку и не добавляет товар
- [ ] «Confirm» добавляет товар и открывает корзину

---

## T-050 — Хук useConfigurator

**Depends on:** T-022, T-019, T-020
**Estimate:** 3ч
**Files:** создать `components/configurator/useConfigurator.ts`

### Business

Вся логика конструктора в одном хуке. Ключевые бизнес-правила:

1. **URL — единственный источник истины.** Состояние не дублируется в React-стейте, чтобы не рассинхронизироваться.
2. **История браузера пишется только при смене размера и кожи.** Если писать при каждом клике по свотчу, кнопка «назад» превратится в отмотку тридцати переключений цвета, и человек не сможет вернуться на лендинг.
3. **Конфигурация всегда валидна.** Любое изменение прогоняется через `resolveConfiguration`, и если оно порождает конфликт — подставляется ближайшее валидное значение, а пользователю показывается сообщение.

### Code

```ts
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
```

### Do NOT
- ❌ Не хранить конфигурацию в `useState` параллельно с URL
- ❌ Не вызывать `router.push` при смене цвета, нити, шнура, гравировки, вкладышей, коробки
- ❌ Не убирать `{ scroll: false }` — иначе при каждом клике страница будет прыгать наверх

### Acceptance
- [ ] Смена цвета обновляет URL, но не добавляет запись в историю
- [ ] Смена размера добавляет запись в историю
- [ ] Кнопка «назад» после 10 кликов по цветам уводит на предыдущую страницу, а не отматывает цвета
- [ ] Смена кожи, при которой текущий цвет недоступен, показывает тост и подставляет другой цвет
- [ ] Страница не скроллится вверх при изменениях

---

## T-051 — Каркас страницы конструктора

**Depends on:** T-050, T-045
**Estimate:** 2ч
**Files:** изменить `app/configurator/page.tsx`, создать `components/configurator/ConfiguratorClient.tsx`

### Business
Двухколоночная раскладка: слева sticky-превью, справа колонка выбора, снизу sticky-панель с ценой.

### ⚠️ Важно: каркас создаётся со слотами-заглушками

Селекторы появятся в задачах T-052 … T-057. Чтобы сборка не падала, **сейчас на их месте стоят комментарии-маркеры**. Каждая следующая задача заменяет свой маркер одной строкой.

Маркеры выглядят так и должны остаться в файле дословно:
```
{/* SLOT: SizeSelector */}
```

### Code

`app/configurator/page.tsx`:
```tsx
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
```

`components/configurator/ConfiguratorClient.tsx`:
```tsx
// components/configurator/ConfiguratorClient.tsx
'use client';

import { ToastProvider } from '@/components/ui/Toast';
import { copy } from '@/lib/data';
import { formatPrice } from '@/lib/format';
import { useConfigurator } from './useConfigurator';
import Preview from './Preview';

function Inner() {
  const { config, priced, warnings, update } = useConfigurator();

  return (
    <>
      <main className="container-content pb-32 pt-8">
        <h1 className="mb-8 text-3xl md:text-4xl">{copy.configurator.title}</h1>

        {warnings.length > 0 && (
          <div className="mb-6 rounded-sm border border-line bg-paper-2 p-4 text-sm text-ink-soft">
            {copy.configurator.conflictBanner}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          {/* Left: preview, sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Preview config={config} />
          </div>

          {/* Right: options. Each SLOT is filled by a later task. */}
          <div className="flex flex-col gap-10">
            {/* SLOT: SizeSelector */}
            {/* SLOT: LeatherSelector */}
            {/* SLOT: ColorSelector */}
            {/* SLOT: DetailsSelector */}
            {/* SLOT: EngravingInput */}
            {/* SLOT: InsertsSelector */}
          </div>
        </div>
      </main>

      {/* Temporary price bar. Replaced by StickyBar in T-058. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur">
        <div className="container-content flex h-[72px] items-center">
          <p className="text-lg font-medium">{formatPrice(priced.totalMinor)}</p>
        </div>
      </div>

      {/* SLOT: StickyBar */}
    </>
  );
}

export default function ConfiguratorClient() {
  return (
    <ToastProvider>
      <Inner />
    </ToastProvider>
  );
}
```

### Do NOT
- ❌ Не удалять комментарии-маркеры `{/* SLOT: ... */}` — по ним работают следующие задачи
- ❌ Не забыть `<Suspense>` — без него `useSearchParams` уронит сборку
- ❌ Не импортировать компоненты, которых ещё нет

### Acceptance
- [ ] `/configurator` открывается, слева превью, справа пусто
- [ ] Внизу видна временная панель с ценой
- [ ] Все шесть маркеров `SLOT:` присутствуют в файле
- [ ] `npm run build` проходит

---

## T-052 — SizeSelector

**Depends on:** T-051, T-032
**Estimate:** 1ч
**Files:** создать `components/configurator/SizeSelector.tsx`

### Code

```tsx
// components/configurator/SizeSelector.tsx
'use client';

import type { Configuration, SizeCode } from '@/types/config';
import { sizeList } from '@/content/sizes';
import { copy } from '@/content/copy';
import { formatDimensions, formatPrice } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function SizeSelector({ config, onChange }: Props) {
  return (
    <section>
      <h2 className="label mb-3">{copy.configurator.steps.size}</h2>
      <OptionCardGroup
        label="Size"
        columns="grid-cols-2"
        value={config.size}
        onChange={(v) => onChange({ size: v as SizeCode })}
        items={sizeList.map((s) => ({
          value: s.code,
          title: s.name,
          meta: `${formatDimensions(s.coverMm)} · ${s.insertCapacity} inserts`,
          delta: formatPrice(s.basePriceMinor),
        }))}
      />
    </section>
  );
}
```

### Подключение к странице

В `components/configurator/ConfiguratorClient.tsx` заменить строку

```
{/* SLOT: SizeSelector */}
```

на

```tsx
<SizeSelector config={config} onChange={update} />
```

и добавить импорт вверху файла:

```tsx
import SizeSelector from './SizeSelector';
```

### Acceptance
- [ ] Четыре карточки, у каждой габариты в мм, вместимость и цена
- [ ] Клик меняет размер, превью и схема габаритов обновляются
- [ ] Компонент виден на странице `/configurator`
- [ ] `npm run build` проходит

---

## T-053 — LeatherSelector

**Depends on:** T-051, T-032
**Estimate:** 1.5ч
**Files:** создать `components/configurator/LeatherSelector.tsx`

### Business
Карточка кожи, недоступной в текущем размере (например Pull-up при выбранном A6), **показывается затемнённой с причиной**, а не исчезает. Клик по ней не проходит.

### Code

```tsx
// components/configurator/LeatherSelector.tsx
'use client';

import type { Configuration, LeatherCode } from '@/types/config';
import { leatherList } from '@/content/leathers';
import { copy } from '@/content/copy';
import { formatDelta, formatThickness } from '@/lib/format';
import { getLeatherState } from '@/lib/availability';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import HatchDefs, { hatchUrl } from '@/components/schematic/HatchDefs';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

/** Small hatch preview so the leather cards are visually distinct */
function HatchChip({ pattern }: { pattern: Parameters<typeof hatchUrl>[0] }) {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-full">
      <HatchDefs />
      <rect x="0" y="0" width="60" height="24" fill={hatchUrl(pattern)} stroke="#DED5C7" strokeWidth="0.8" />
    </svg>
  );
}

export default function LeatherSelector({ config, onChange }: Props) {
  return (
    <section>
      <h2 className="label mb-3">{copy.configurator.steps.leather}</h2>
      <OptionCardGroup
        label="Leather"
        columns="grid-cols-1 sm:grid-cols-3"
        value={config.leather}
        onChange={(v) => onChange({ leather: v as LeatherCode })}
        items={leatherList.map((l) => {
          const state = getLeatherState(l.code, config.size);
          const disabled = state.kind !== 'available';
          return {
            value: l.code,
            title: l.name,
            meta: `${formatThickness(l.thicknessMm)} · ${l.character}`,
            delta: formatDelta(l.priceDeltaMinor),
            visual: <HatchChip pattern={l.schematicHatch} />,
            disabled,
            disabledReason: disabled ? state.reason : undefined,
          };
        })}
      />
    </section>
  );
}
```

### Подключение к странице

В `components/configurator/ConfiguratorClient.tsx` заменить строку

```
{/* SLOT: LeatherSelector */}
```

на

```tsx
<LeatherSelector config={config} onChange={update} />
```

и добавить импорт вверху файла:

```tsx
import LeatherSelector from './LeatherSelector';
```

### Acceptance
- [ ] При выбранном размере A6 карточка Pull-up затемнена и подписана «Not available in this size»
- [ ] Клик по затемнённой карточке ничего не меняет
- [ ] У каждой карточки видна своя штриховка
- [ ] Надбавка за кожу отображается как `+30 zł`
- [ ] Компонент виден на странице `/configurator`
- [ ] `npm run build` проходит

---

## T-054 — ColorSelector

**Depends on:** T-051, T-031
**Estimate:** 2ч
**Files:** создать `components/configurator/ColorSelector.tsx`

### Business
Три состояния свотча, каждое со своим объяснением:
- доступен — обычный вид
- под заказ — обычный вид + подпись «Made to order», срок изготовления вырастает с 5 до 14 дней
- недоступен — затемнён, штриховка, причина текстом; клик открывает форму «сообщить, когда появится»

### Code

```tsx
// components/configurator/ColorSelector.tsx
'use client';

import { useState } from 'react';
import type { Configuration, ColorCode } from '@/types/config';
import { colorList } from '@/content/colors';
import { copy } from '@/content/copy';
import { getColorState } from '@/lib/availability';
import SwatchGroup from '@/components/ui/SwatchGroup';
import NotifyStockForm from './NotifyStockForm';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function ColorSelector({ config, onChange }: Props) {
  const [notifyColor, setNotifyColor] = useState<ColorCode | null>(null);

  const items = colorList.map((c) => {
    const state = getColorState(config.leather, c.code);
    if (state.kind === 'available') {
      return {
        value: c.code,
        label: c.name,
        hex: c.hex,
        state: state.status === 'made_to_order' ? ('made-to-order' as const) : ('available' as const),
      };
    }
    return {
      value: c.code,
      label: c.name,
      hex: c.hex,
      state: 'disabled' as const,
      note: state.reason,
    };
  });

  function handleChange(value: string) {
    const code = value as ColorCode;
    const state = getColorState(config.leather, code);
    if (state.kind === 'available') {
      onChange({ color: code });
    } else if (state.kind === 'unavailable') {
      // Out of stock, but the colour does exist in this leather — offer to be notified.
      setNotifyColor(code);
    }
    // 'not-in-leather' → do nothing at all
  }

  return (
    <section>
      <h2 className="label mb-3">{copy.configurator.steps.color}</h2>
      <SwatchGroup label="Colour" items={items} value={config.color} onChange={handleChange} />
      {notifyColor && (
        <NotifyStockForm
          leather={config.leather}
          color={notifyColor}
          onClose={() => setNotifyColor(null)}
        />
      )}
    </section>
  );
}
```

### Do NOT
- ❌ Не скрывать цвета, отсутствующие в выбранной коже
- ❌ Не выбирать цвет со статусом `unavailable`

### Подключение к странице

В `components/configurator/ConfiguratorClient.tsx` заменить строку

```
{/* SLOT: ColorSelector */}
```

на

```tsx
<ColorSelector config={config} onChange={update} />
```

и добавить импорт вверху файла:

```tsx
import ColorSelector from './ColorSelector';
```

### Acceptance
- [ ] При коже Pull-up цвета Olive и Navy затемнены с подписью «Not available in Pull-up»
- [ ] При коже Pull-up цвет Burgundy затемнён с подписью «Currently unavailable»
- [ ] Клик по Burgundy открывает форму подписки, конфигурация не меняется
- [ ] Клик по Olive ничего не делает
- [ ] Цвет Olive при коже Crazy Horse доступен и подписан «Made to order»
- [ ] Компонент виден на странице `/configurator`
- [ ] `npm run build` проходит

---

## T-055 — DetailsSelector (нить и шнур)

**Depends on:** T-051, T-031
**Estimate:** 1ч
**Files:** создать `components/configurator/DetailsSelector.tsx`

### Business
Нить видна на чертеже — она задаёт цвет пунктира шва. Шнур на чертеже **не рисуется намеренно**: он накладывается на фотографию программно, поэтому в кадре его быть не должно. Это одно из главных сообщений мока мастеру.

### Code

```tsx
// components/configurator/DetailsSelector.tsx
'use client';

import type { Configuration, ThreadCode, CordCode } from '@/types/config';
import { threadList } from '@/content/threads';
import { cordList } from '@/content/cords';
import { copy } from '@/content/copy';
import SwatchGroup from '@/components/ui/SwatchGroup';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function DetailsSelector({ config, onChange }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="label mb-3">{copy.configurator.thread}</h2>
        <SwatchGroup
          label="Thread"
          value={config.thread}
          onChange={(v) => onChange({ thread: v as ThreadCode })}
          items={threadList.map((t) => ({
            value: t.code,
            label: t.name,
            hex: t.hex,
            state: 'available' as const,
          }))}
        />
      </div>

      <div>
        <h2 className="label mb-3">{copy.configurator.cord}</h2>
        <SwatchGroup
          label="Elastic cord"
          value={config.cord}
          onChange={(v) => onChange({ cord: v as CordCode })}
          items={cordList.map((c) => ({
            value: c.code,
            label: c.name,
            hex: c.hex,
            state: 'available' as const,
          }))}
        />
        <p className="mt-2 text-xs text-muted">
          The cord is composited onto the photograph, which is why it is not drawn on the
          technical drawing and must not appear in the shot.
        </p>
      </div>
    </section>
  );
}
```

### Подключение к странице

В `components/configurator/ConfiguratorClient.tsx` заменить строку

```
{/* SLOT: DetailsSelector */}
```

на

```tsx
<DetailsSelector config={config} onChange={update} />
```

и добавить импорт вверху файла:

```tsx
import DetailsSelector from './DetailsSelector';
```

### Acceptance
- [ ] Смена нити меняет цвет пунктира шва на чертеже
- [ ] Смена шнура не меняет чертёж
- [ ] Под шнуром видно объяснение, почему он не нарисован
- [ ] Компонент виден на странице `/configurator`
- [ ] `npm run build` проходит

---

## T-056 — EngravingInput

**Depends on:** T-051, T-021
**Estimate:** 2.5ч
**Files:** создать `components/configurator/EngravingInput.tsx`

### Business
Гравировка — главный драйвер эмоциональной ценности и, вероятно, самая частая опция. Требования:
- Максимум 20 символов, лишнее обрезается на вводе
- Недопустимые символы (эмодзи, спецсимволы) не вводятся вовсе
- Живое превью на чертеже с задержкой 120 мс — чтобы не перерисовывать на каждую букву
- Текст из одних пробелов = пусто, доплата не начисляется
- Счётчик символов, краснеет на 18+

### Code

```tsx
// components/configurator/EngravingInput.tsx
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Configuration, EngravingFont, EngravingPosition } from '@/types/config';
import { copy } from '@/content/copy';
import { ENGRAVING_MINOR, MAX_ENGRAVING_LENGTH } from '@/content/pricing';
import { sanitizeEngraving } from '@/lib/config-schema';
import { formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const DEBOUNCE_MS = 120;

export default function EngravingInput({ config, onChange }: Props) {
  const [text, setText] = useState(config.engraving?.text ?? '');

  // Keep local state in sync when config changes from outside (e.g. URL restore)
  useEffect(() => {
    setText(config.engraving?.text ?? '');
  }, [config.engraving?.text]);

  // Debounced push into the configuration
  useEffect(() => {
    const timer = setTimeout(() => {
      const clean = text.trim();
      if (clean.length === 0) {
        if (config.engraving !== null) onChange({ engraving: null });
        return;
      }
      if (clean !== config.engraving?.text) {
        onChange({
          engraving: {
            text: clean,
            font: config.engraving?.font ?? 'serif',
            position: config.engraving?.position ?? 'bottom-right',
          },
        });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const count = text.length;
  const nearLimit = count >= 18;

  return (
    <section>
      <h2 className="label mb-3">
        {copy.configurator.steps.engraving}
        <span className="ml-2 normal-case tracking-normal text-accent">
          {formatDelta(ENGRAVING_MINOR)}
        </span>
      </h2>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(sanitizeEngraving(e.target.value))}
        placeholder={copy.configurator.engravingPlaceholder}
        maxLength={MAX_ENGRAVING_LENGTH}
        aria-describedby="engraving-hint"
        className="h-11 w-full rounded-sm border border-line bg-paper px-3 text-base text-ink placeholder:text-muted focus:border-ink"
      />

      <div className="mt-1.5 flex items-start justify-between gap-4">
        <p id="engraving-hint" className="text-xs text-muted">
          {copy.configurator.engravingHint}
        </p>
        <span className={clsx('shrink-0 font-mono text-xs', nearLimit ? 'text-alert' : 'text-muted')}>
          {count} / {MAX_ENGRAVING_LENGTH}
        </span>
      </div>

      {text.trim().length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="label mb-2 block">{copy.configurator.engravingFontLabel}</span>
            <div className="flex gap-2">
              {(['serif', 'sans'] as EngravingFont[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() =>
                    onChange({
                      engraving: {
                        text: text.trim(),
                        font: f,
                        position: config.engraving?.position ?? 'bottom-right',
                      },
                    })
                  }
                  className={clsx(
                    'h-9 flex-1 rounded-sm border text-sm transition-colors duration-150',
                    config.engraving?.font === f ? 'border-ink bg-paper-2' : 'border-line',
                  )}
                >
                  {copy.configurator.engravingFonts[f]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label mb-2 block">{copy.configurator.engravingPositionLabel}</span>
            <div className="flex gap-2">
              {(['bottom-right', 'spine'] as EngravingPosition[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    onChange({
                      engraving: {
                        text: text.trim(),
                        font: config.engraving?.font ?? 'serif',
                        position: p,
                      },
                    })
                  }
                  className={clsx(
                    'h-9 flex-1 rounded-sm border text-xs transition-colors duration-150',
                    config.engraving?.position === p ? 'border-ink bg-paper-2' : 'border-line',
                  )}
                >
                  {copy.configurator.engravingPositions[p]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
```

### Do NOT
- ❌ Не начислять доплату за строку из одних пробелов
- ❌ Не обновлять URL на каждое нажатие клавиши — только через debounce
- ❌ Не показывать выбор шрифта и позиции, пока поле пустое

### Подключение к странице

В `components/configurator/ConfiguratorClient.tsx` заменить строку

```
{/* SLOT: EngravingInput */}
```

на

```tsx
<EngravingInput config={config} onChange={update} />
```

и добавить импорт вверху файла:

```tsx
import EngravingInput from './EngravingInput';
```

### Acceptance
- [ ] Ввод эмодзи не проходит
- [ ] Вставка текста длиннее 20 символов обрезается до 20
- [ ] Счётчик краснеет начиная с 18 символов
- [ ] Строка из пробелов не добавляет 40 zł к цене
- [ ] Текст появляется на чертеже в зоне гравировки
- [ ] Смена позиции на «spine» перемещает зону на чертеже
- [ ] Компонент виден на странице `/configurator`
- [ ] `npm run build` проходит

---

## T-057 — InsertsSelector и подарочная коробка

**Depends on:** T-051
**Estimate:** 1.5ч
**Files:** создать `components/configurator/InsertsSelector.tsx`

### Business
Количество вкладышей видно на чертеже в ракурсе `open` — это делает ось осмысленной. Максимум ограничен вместимостью выбранного размера: A6 держит 2 вкладыша, A5 — четыре.

### Code

```tsx
// components/configurator/InsertsSelector.tsx
'use client';

import type { Configuration, InsertType } from '@/types/config';
import { sizes } from '@/content/sizes';
import { copy } from '@/content/copy';
import { insertNames, insertPriceMinor, GIFT_BOX_MINOR } from '@/content/pricing';
import { formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const TYPES: InsertType[] = ['plain', 'ruled', 'dot'];

export default function InsertsSelector({ config, onChange }: Props) {
  const capacity = sizes[config.size].insertCapacity;
  const totalQty = config.inserts.reduce((s, i) => s + i.qty, 0);

  function setQty(type: InsertType, qty: number) {
    const others = config.inserts.filter((i) => i.type !== type);
    const othersTotal = others.reduce((s, i) => s + i.qty, 0);
    const clamped = Math.max(0, Math.min(qty, capacity - othersTotal));
    const next = clamped > 0 ? [...others, { type, qty: clamped }] : others;
    onChange({ inserts: next });
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="label mb-1">{copy.configurator.steps.inserts}</h2>
        <p className="mb-3 text-xs text-muted">
          Up to {capacity} in this size. {totalQty} selected.
        </p>

        <div className="space-y-2">
          {TYPES.map((type) => {
            const current = config.inserts.find((i) => i.type === type)?.qty ?? 0;
            const canAdd = totalQty < capacity;
            return (
              <div
                key={type}
                className="flex items-center justify-between rounded-sm border border-line p-3"
              >
                <div>
                  <span className="text-sm text-ink">{insertNames[type]}</span>
                  <span className="ml-2 text-xs text-accent">
                    {formatDelta(insertPriceMinor[type])} each
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Remove one ${insertNames[type]} insert`}
                    disabled={current === 0}
                    onClick={() => setQty(type, current - 1)}
                    className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-sm" aria-live="polite">
                    {current}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add one ${insertNames[type]} insert`}
                    disabled={!canAdd}
                    onClick={() => setQty(type, current + 1)}
                    className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-sm border border-line p-3">
        <span className="text-sm text-ink">
          {copy.configurator.giftBoxLabel}
          <span className="ml-2 text-xs text-accent">{formatDelta(GIFT_BOX_MINOR)}</span>
        </span>
        <input
          type="checkbox"
          checked={config.giftBox}
          onChange={(e) => onChange({ giftBox: e.target.checked })}
          className="h-5 w-5 accent-[#8B4A2B]"
        />
      </label>
    </section>
  );
}
```

### Подключение к странице

В `components/configurator/ConfiguratorClient.tsx` заменить строку

```
{/* SLOT: InsertsSelector */}
```

на

```tsx
<InsertsSelector config={config} onChange={update} />
```

и добавить импорт вверху файла:

```tsx
import InsertsSelector from './InsertsSelector';
```

### Acceptance
- [ ] При размере A6 нельзя добавить больше 2 вкладышей суммарно
- [ ] Кнопки «+» блокируются при достижении лимита
- [ ] Изменение количества меняет цену
- [ ] На чертеже в ракурсе `open` количество линий-страниц соответствует выбору
- [ ] Компонент виден на странице `/configurator`
- [ ] `npm run build` проходит

---

## T-058 — StickyBar

**Depends on:** T-048, T-049, T-051, T-019
**Estimate:** 1.5ч
**Files:** создать `components/configurator/StickyBar.tsx`

### Business
Цена и срок изготовления всегда на экране. Срок обязан быть виден **до** добавления в корзину: узнать о 14 днях ожидания на этапе оплаты — типичная причина отказа.

Изменение цены подсвечивается на 600 мс, чтобы связь «действие → цена» была очевидна.

### Code

```tsx
// components/configurator/StickyBar.tsx
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { PricedConfiguration } from '@/types/config';
import { copy } from '@/content/copy';
import { formatPrice } from '@/lib/format';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';
import EngravingConfirmModal from './EngravingConfirmModal';

export default function StickyBar({ priced }: { priced: PricedConfiguration }) {
  const [highlight, setHighlight] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    setHighlight(true);
    const timer = setTimeout(() => setHighlight(false), 600);
    return () => clearTimeout(timer);
  }, [priced.totalMinor]);

  const hasEngraving = !!priced.engraving && priced.engraving.text.trim().length > 0;

  function handleAdd() {
    if (hasEngraving) {
      setConfirmOpen(true);
      return;
    }
    addItem(priced);
    openCart();
  }

  function confirmAdd() {
    setConfirmOpen(false);
    addItem(priced);
    openCart();
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur">
        <div className="container-content flex h-[72px] items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)]">
          <div>
            <p
              className={clsx(
                'text-lg font-medium transition-colors duration-300',
                highlight ? 'text-accent' : 'text-ink',
              )}
              aria-live="polite"
            >
              {formatPrice(priced.totalMinor)}
            </p>
            <p className="text-xs text-muted">
              {priced.stock === 'made_to_order' && `${copy.configurator.madeToOrder} · `}
              {copy.configurator.readyIn} {priced.productionDays} {copy.configurator.workingDays}
            </p>
          </div>

          <Button size="lg" onClick={handleAdd}>
            {copy.configurator.addToCart}
          </Button>
        </div>
      </div>

      <EngravingConfirmModal
        open={confirmOpen}
        text={priced.engraving?.text ?? ''}
        font={priced.engraving?.font ?? 'serif'}
        onEdit={() => setConfirmOpen(false)}
        onConfirm={confirmAdd}
      />
    </>
  );
}
```

### Подключение к странице

В `ConfiguratorClient.tsx`:
1. **Удалить** временный блок с комментарием `{/* Temporary price bar. Replaced by StickyBar in T-058. */}` целиком
2. Заменить `{/* SLOT: StickyBar */}` на `<StickyBar priced={priced} />`
3. Добавить импорт `import StickyBar from './StickyBar';`
4. Убрать ставший ненужным импорт `formatPrice`, если он больше не используется

### Do NOT
- ❌ Не прятать срок изготовления
- ❌ Не убирать `pb-[env(safe-area-inset-bottom)]` — на iPhone панель залезет под системную полосу

### Acceptance
- [ ] Панель видна на любом скролле
- [ ] Цена подсвечивается при изменении и возвращается к обычному цвету
- [ ] Срок 14 дней показывается для комбинаций «под заказ»
- [ ] Высота панели 72 px

---

## T-059 — Тосты конфликтов

**Depends on:** T-050, T-035
**Estimate:** 2ч
**Files:** проверка интеграции, изменений кода может не потребоваться

### Steps

1. Убедиться, что `ConfiguratorClient` обёрнут в `ToastProvider` (сделано в T-051)
2. Убедиться, что `useConfigurator` вызывает `showToast` для каждого сообщения из `resolveConfiguration` (сделано в T-050)
3. Проверить сценарии вручную:

| Действие | Ожидаемый тост |
|---|---|
| Выбрать Crazy Horse + Navy, затем сменить кожу на Pull-up | «Colour changed to Cognac — Navy is not available in Pull-up» |
| Выбрать размер A6, затем попытаться выбрать Pull-up | Карточка Pull-up затемнена, клик не проходит, тоста нет |
| Открыть `/configurator?leather=pull-up&color=olive` | Баннер конфликта вверху страницы + подмена цвета |

4. Если тост не показывается — проверить, что `showToast` вызывается **после** обновления URL, а не до

### Acceptance
- [ ] Все три сценария из таблицы работают
- [ ] Тост исчезает сам через 4 секунды
- [ ] Два конфликта подряд дают два тоста

---

## T-060 — Восстановление из localStorage

**Depends on:** T-050
**Estimate:** 1ч
**Files:** создать `components/configurator/RestoreBanner.tsx`, изменить `ConfiguratorClient.tsx`

### Business
Последняя конфигурация сохраняется, но **не восстанавливается автоматически**: человек мог прийти за другим. Вместо этого показывается предложение с двумя кнопками.

### Code

```tsx
// components/configurator/RestoreBanner.tsx
'use client';

import { useEffect, useState } from 'react';
import type { Configuration } from '@/types/config';
import { copy } from '@/content/copy';
import { parseConfig } from '@/lib/config-schema';
import Button from '@/components/ui/Button';

const KEY = 'kroja:last-config';

export function saveConfig(config: Configuration) {
  try {
    localStorage.setItem(KEY, JSON.stringify(config));
  } catch {
    // Storage may be unavailable (private mode). Failing silently is correct here.
  }
}

interface Props {
  /** True when the URL had no configuration params at all */
  isFreshVisit: boolean;
  onRestore: (config: Configuration) => void;
}

export default function RestoreBanner({ isFreshVisit, onRestore }: Props) {
  const [saved, setSaved] = useState<Configuration | null>(null);

  useEffect(() => {
    if (!isFreshVisit) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSaved(parseConfig(JSON.parse(raw)));
    } catch {
      setSaved(null);
    }
  }, [isFreshVisit]);

  if (!saved) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-line bg-paper-2 p-4">
      <p className="text-sm text-ink">{copy.configurator.restoreTitle}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setSaved(null)}>
          {copy.configurator.restoreNo}
        </Button>
        <Button size="sm" onClick={() => { onRestore(saved); setSaved(null); }}>
          {copy.configurator.restoreYes}
        </Button>
      </div>
    </div>
  );
}
```

В `ConfiguratorClient.tsx` добавить:
- вызов `saveConfig(config)` в `useEffect` при каждом изменении конфигурации
- `isFreshVisit` = `searchParams.toString() === ''`
- `onRestore={(c) => update(c)}`

### Do NOT
- ❌ Не восстанавливать конфигурацию автоматически, без спроса
- ❌ Не падать, если `localStorage` недоступен

### Acceptance
- [ ] После настройки и перезагрузки `/configurator` без параметров появляется баннер
- [ ] «Restore» восстанавливает конфигурацию
- [ ] «Start fresh» убирает баннер и оставляет дефолт
- [ ] Заход по ссылке с параметрами баннер не показывает

---

## T-061 — NotifyStockForm

**Depends on:** T-054, T-034
**Estimate:** 1ч
**Files:** создать `components/configurator/NotifyStockForm.tsx`

### Business
Клик по недоступному цвету не тратится впустую: собираем email и фиксируем, какой комбинации не хватает. Это прямые данные о том, какую кожу закупать в первую очередь.

### Code

```tsx
// components/configurator/NotifyStockForm.tsx
'use client';

import { useState } from 'react';
import type { LeatherCode, ColorCode } from '@/types/config';
import { leathers } from '@/content/leathers';
import { colors } from '@/content/colors';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  leather: LeatherCode;
  color: ColorCode;
  onClose: () => void;
}

export default function NotifyStockForm({ leather, color, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!email.includes('@')) return;
    await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'stock-notify', email, leather, color }),
    }).catch(() => {});
    setSent(true);
  }

  return (
    <Modal
      open
      title={`${colors[color].name} in ${leathers[leather].name}`}
      onClose={onClose}
      footer={
        sent ? (
          <Button onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={submit}>Notify me</Button>
          </>
        )
      }
    >
      {sent ? (
        <p>We will write to you as soon as this combination is back.</p>
      ) : (
        <>
          <p className="mb-3">
            This combination is out of stock. Leave your email and we will tell you when it is
            back.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="h-11 w-full rounded-sm border border-line bg-paper px-3 text-base"
          />
        </>
      )}
    </Modal>
  );
}
```

### Acceptance
- [ ] Клик по недоступному цвету открывает модалку
- [ ] Отправка показывает подтверждение
- [ ] Конфигурация при этом не меняется
- [ ] Ошибка сети не ломает интерфейс

---

## Контрольная точка EPIC 4

Пройти вручную три сценария:

**A. Себе, десктоп.** Открыть `/configurator` → сменить кожу на Crazy Horse → перебрать 5 цветов → ввести гравировку → положить в корзину.
Проверить: мгновенность чертежа, читаемость цены, корректность имени файла.

**B. В подарок, телефон.** Открыть на 360 px → выбрать размер → выбрать цвет → **скопировать URL** → открыть в новой вкладке.
Проверить: конфигурация восстановилась полностью, sticky-панель не перекрыта клавиатурой.

**C. Ломающий.** Открыть `/configurator?size=xl&leather=pull-up&color=olive&engraving=🔥🔥🔥&utm_source=test` → быстро перещёлкать 10 свотчей → нажать «назад» → добавить одну конфигурацию дважды → перезагрузить.
Проверить: страница не упала, подстановка сработала, «назад» ушёл на предыдущую страницу, в корзине одна позиция с `qty: 2`, корзина пережила перезагрузку.

- [ ] Все три сценария проходят
- [ ] `npm run build` без ошибок
