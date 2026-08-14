# TASKS 1 — Фундамент и данные (EPIC 0, EPIC 1)

Задачи T-001 … T-024. Выполнять строго по порядку.

---

# EPIC 0 — Фундамент

## T-001 — Инициализация Next.js + TypeScript

**Depends on:** —
**Estimate:** 0.5ч
**Files:** весь корень проекта

### Business
Пустой каркас, на который дальше всё навешивается.

### Steps

1. Выполнить:
```bash
npx create-next-app@latest kroja --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-turbopack
cd kroja
```
2. Установить дополнительные зависимости:
```bash
npm install zod zustand clsx
```
3. Открыть `tsconfig.json` и убедиться, что там есть:
```json
"strict": true,
"paths": { "@/*": ["./*"] }
```
Если `strict` = false — исправить на `true`.

4. Удалить весь демо-контент из `app/page.tsx`, оставить:
```tsx
export default function Home() {
  return <main>KROJA</main>;
}
```
5. Удалить `app/favicon.ico` — свой добавим в T-111.

### Do NOT
- ❌ Не устанавливать ничего кроме `zod`, `zustand`, `clsx`
- ❌ Не включать Turbopack
- ❌ Не создавать папку `src/`

### Acceptance
- [ ] `npm run dev` запускается, на `localhost:3000` виден текст «KROJA»
- [ ] `npm run build` проходит без ошибок
- [ ] В `package.json` ровно те зависимости, что перечислены в `BACKLOG.md`, раздел 1.2
- [ ] `tsconfig.json` содержит `"strict": true`

---

## T-002 — Tailwind и дизайн-токены

**Depends on:** T-001
**Estimate:** 1ч
**Files:** `tailwind.config.ts`

### Business
Единая палитра бренда. Все цвета в проекте берутся только отсюда — это гарантирует, что сайт выглядит как один продукт, а не как набор экранов.

### Code

Заменить содержимое `tailwind.config.ts` целиком:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1C1917',        // основной текст, линии схем
        'ink-soft': '#57534E', // вторичный текст
        muted: '#8A7F72',      // подписи, мелкий текст
        paper: '#FAF7F2',      // фон страницы
        'paper-2': '#F2EDE4',  // фон карточек и секций
        line: '#DED5C7',       // рамки, разделители
        accent: '#8B4A2B',     // кнопки, ссылки, акценты
        'accent-dark': '#6E3A22',
        alert: '#A63D2F',      // плашка NOT IN FRAME, ошибки
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
        prose: '68ch',
      },
      spacing: {
        section: '6rem',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Do NOT
- ❌ Не добавлять плагины Tailwind
- ❌ Не менять названия токенов — они используются во всех последующих задачах

### Acceptance
- [ ] `npm run build` проходит
- [ ] Класс `bg-paper` применяется и даёт цвет `#FAF7F2`
- [ ] Класс `text-accent` даёт `#8B4A2B`

---

## T-003 — Шрифты и глобальные стили

**Depends on:** T-002
**Estimate:** 1ч
**Files:** `app/layout.tsx`, `app/globals.css`

### Business
Типографика — главный носитель премиального впечатления, потому что фотографий почти нет. Три гарнитуры: заголовки — с характером, интерфейс — нейтральная, имена файлов — моноширинная.

### Code

`app/layout.tsx`:

```tsx
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
  title: 'KROJA — Handmade leather notebooks',
  description:
    'Refillable leather notebook covers, hand-stitched in Kraków. Choose your size, leather and colour.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
```

`app/globals.css` — заменить содержимое целиком:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem; /* высота sticky-шапки */
  }

  h1, h2, h3 {
    font-family: var(--font-display), Georgia, serif;
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  h1 { @apply text-4xl md:text-6xl leading-[1.05]; }
  h2 { @apply text-3xl md:text-4xl leading-tight; }
  h3 { @apply text-xl md:text-2xl leading-snug; }

  p  { @apply leading-relaxed; }

  :focus-visible {
    outline: 2px solid theme('colors.accent');
    outline-offset: 2px;
  }
}

@layer components {
  .container-content {
    @apply mx-auto w-full max-w-content px-5 md:px-8;
  }

  .section {
    @apply py-16 md:py-24;
  }

  .label {
    @apply text-xs uppercase tracking-[0.12em] text-muted;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Do NOT
- ❌ Не подключать шрифты через `<link>` или `@import` — только `next/font`
- ❌ Не добавлять другие CSS-файлы

### Acceptance
- [ ] Заголовок `<h1>` отображается серифной гарнитурой
- [ ] Обычный текст — Inter
- [ ] В DevTools нет запросов к `fonts.googleapis.com` в рантайме
- [ ] `npm run build` проходит

---

## T-004 — Структура папок и заглушки страниц

**Depends on:** T-003
**Estimate:** 0.5ч
**Files:** папки + 3 файла страниц

### Steps

1. Создать пустые папки:
```
components/ui
components/schematic
components/configurator
components/cart
components/landing
components/shotlist
content
lib
types
store
public/photos
```
2. В каждой папке создать файл `.gitkeep` (пустой), чтобы git их сохранил.

3. Создать `app/configurator/page.tsx`:
```tsx
export default function ConfiguratorPage() {
  return <main className="container-content section">Configurator</main>;
}
```

4. Создать `app/shotlist/page.tsx`:
```tsx
export default function ShotlistPage() {
  return <main className="container-content section">Shot list</main>;
}
```

### Acceptance
- [ ] Открывается `/configurator` и показывает «Configurator»
- [ ] Открывается `/shotlist` и показывает «Shot list»
- [ ] Все папки из списка существуют
- [ ] `npm run build` проходит

---

# EPIC 1 — Данные и логика

> ⚠️ Все файлы этого эпика — **чистые данные и чистые функции**. Ни одного React-компонента. Ни одного обращения к DOM.

## T-010 — Типы

**Depends on:** T-004
**Estimate:** 1ч
**Files:** создать `types/config.ts`

### Business
Единственное определение того, из чего состоит блокнот. Все остальные файлы ссылаются сюда. Опечатка в коде цвета будет поймана компилятором, а не пользователем.

### Code

```ts
// types/config.ts

export type SizeCode = 'a6' | 'b6' | 'standard' | 'a5';

export type LeatherCode = 'veg-tan' | 'crazy-horse' | 'pull-up';

export type ColorCode =
  | 'natural' | 'cognac' | 'chestnut'
  | 'olive' | 'black' | 'navy' | 'burgundy';

export type ThreadCode = 'natural' | 'tonal' | 'contrast';

export type CordCode = 'black' | 'brown' | 'olive' | 'burgundy';

export type InsertType = 'plain' | 'ruled' | 'dot';

export type EngravingFont = 'serif' | 'sans';

export type EngravingPosition = 'bottom-right' | 'spine';

export type Angle = 'front' | 'open' | 'detail';

export type StockStatus = 'in_stock' | 'made_to_order' | 'unavailable';

export interface Engraving {
  /** Trimmed, max 20 characters. Never contains only whitespace. */
  text: string;
  font: EngravingFont;
  position: EngravingPosition;
}

export interface InsertSelection {
  type: InsertType;
  /** 0..4 */
  qty: number;
}

/** Everything the user picks. This is the single source of truth for a product. */
export interface Configuration {
  size: SizeCode;
  leather: LeatherCode;
  color: ColorCode;
  thread: ThreadCode;
  cord: CordCode;
  engraving: Engraving | null;
  inserts: InsertSelection[];
  giftBox: boolean;
}

/** Configuration plus everything derived from it. Never stored, always computed. */
export interface PricedConfiguration extends Configuration {
  /** Total in minor units (grosz). 35900 === 359.00 zł */
  totalMinor: number;
  currency: 'PLN';
  productionDays: number;
  stock: StockStatus;
  /** `${leather}_${color}` — NOTE: size is intentionally NOT part of this key */
  previewKey: string;
}

export interface CartItem {
  /** Stable hash of the normalised configuration. Used to merge duplicates. */
  id: string;
  config: PricedConfiguration;
  qty: number;
  addedAt: number;
}
```

### Do NOT
- ❌ Не добавлять поле `size` в `previewKey`. Это принципиально: одна и та же обложка в разных размерах на фото неотличима, и включение размера умножило бы объём съёмки в 4 раза
- ❌ Не использовать `enum` — только union-типы строк

### Acceptance
- [ ] Файл компилируется
- [ ] `import type { Configuration } from '@/types/config'` работает из любого файла

---

## T-011 — Размеры

**Depends on:** T-010
**Estimate:** 0.5ч
**Files:** создать `content/sizes.ts`

### Business
Четыре формата блокнота. Габариты в мм нужны и для карточек выбора, и для схемы масштаба — покупатель не может подержать блокнот в руках, поэтому размер объясняется числами и чертежом.

⚠️ **Цена сейчас одна для всех размеров: 300 zł (`30000` грошей).** Это временное решение до расчёта юнит-экономики. Не «исправлять» и не придумывать разные цены по размерам.

### Code

```ts
// content/sizes.ts
import type { SizeCode } from '@/types/config';

export interface SizeDef {
  code: SizeCode;
  name: string;
  /** Cover dimensions when closed, [width, height] in mm */
  coverMm: [number, number];
  /** Paper insert dimensions, [width, height] in mm */
  insertMm: [number, number];
  weightG: number;
  insertCapacity: number;
  basePriceMinor: number;
  useCase: string;
  order: number;
}

export const sizes: Record<SizeCode, SizeDef> = {
  a6: {
    code: 'a6',
    name: 'A6 Pocket',
    coverMm: [112, 158],
    insertMm: [105, 148],
    weightG: 120,
    insertCapacity: 2,
    basePriceMinor: 30000,
    useCase: 'Lists and quick notes on the move',
    order: 1,
  },
  b6: {
    code: 'b6',
    name: 'B6 Compact',
    coverMm: [132, 186],
    insertMm: [125, 176],
    weightG: 160,
    insertCapacity: 3,
    basePriceMinor: 30000,
    useCase: 'Everyday carry, the middle ground',
    order: 2,
  },
  standard: {
    code: 'standard',
    name: 'Standard',
    coverMm: [118, 220],
    insertMm: [110, 210],
    weightG: 180,
    insertCapacity: 4,
    basePriceMinor: 30000,
    useCase: 'Travel notebook format, sketching on the go',
    order: 3,
  },
  a5: {
    code: 'a5',
    name: 'A5 Large',
    coverMm: [155, 220],
    insertMm: [148, 210],
    weightG: 210,
    insertCapacity: 4,
    basePriceMinor: 30000,
    useCase: 'Desk work, journaling, long-form notes',
    order: 4,
  },
};

export const sizeList: SizeDef[] = Object.values(sizes).sort((a, b) => a.order - b.order);

export const DEFAULT_SIZE: SizeCode = 'a5';
```

### Acceptance
- [ ] `sizeList` возвращает 4 элемента в порядке a6, b6, standard, a5
- [ ] `sizes.a5.basePriceMinor === 30000`
- [ ] У всех четырёх размеров `basePriceMinor === 30000`

---

## T-012 — Типы кожи

**Depends on:** T-010
**Estimate:** 1ч
**Files:** создать `content/leathers.ts`

### Business
Три типа кожи — главная ось выбора и главный аргумент цены. Поле `schematicHatch` определяет, какой штриховкой кожа обозначается на чертеже: без этого смена типа кожи на превью была бы невидима, и ось выглядела бы бессмысленной.

### Code

```ts
// content/leathers.ts
import type { LeatherCode, ColorCode, SizeCode } from '@/types/config';

export type HatchPattern = 'diagonal-fine' | 'diagonal-coarse' | 'cross-hatch';

export interface LeatherDef {
  code: LeatherCode;
  name: string;
  origin: string;
  tanning: string;
  thicknessMm: number;
  priceDeltaMinor: number;
  schematicHatch: HatchPattern;
  /** Short description for the configurator */
  character: string;
  /** Longer description for the landing page */
  description: string;
  ageing: { m6: string; m12: string; m36: string };
  /** 1..5 for the comparison table */
  scratchResistance: number;
  patinaSpeed: number;
  softness: number;
  availableColors: ColorCode[];
  availableSizes: SizeCode[];
  order: number;
}

export const leathers: Record<LeatherCode, LeatherDef> = {
  'veg-tan': {
    code: 'veg-tan',
    name: 'Vegetable-tanned',
    origin: 'Tuscany, Italy',
    tanning: 'Vegetable, tannins from tree bark',
    thicknessMm: 1.8,
    priceDeltaMinor: 0,
    schematicHatch: 'diagonal-fine',
    character: 'Firm and smooth. Darkens with sunlight and use.',
    description:
      'Tanned the slow way, with tree bark rather than chemicals. It starts pale and firm, and darkens into a deep honey tone over the first year. The most alive of the three.',
    ageing: {
      m6: 'Noticeably darker where hands touch it most',
      m12: 'Even honey tone, first soft creases along the spine',
      m36: 'Deep amber, fully broken in, holds its shape',
    },
    scratchResistance: 2,
    patinaSpeed: 5,
    softness: 2,
    availableColors: ['natural', 'cognac', 'chestnut', 'black'],
    availableSizes: ['a6', 'b6', 'standard', 'a5'],
    order: 1,
  },
  'crazy-horse': {
    code: 'crazy-horse',
    name: 'Crazy Horse',
    origin: 'Poland',
    tanning: 'Chrome-free, wax-pulled surface',
    thicknessMm: 2.0,
    priceDeltaMinor: 3000,
    schematicHatch: 'diagonal-coarse',
    character: 'Waxed surface. Scratches lighten and rub back out.',
    description:
      'A waxed finish that lightens where it bends or scratches, then rubs back with a thumb. Every mark is temporary, which makes it the most forgiving of the three.',
    ageing: {
      m6: 'A map of light streaks where it flexes',
      m12: 'Surface settles, wax evens out, marks less visible',
      m36: 'Soft and dense, a worn-in look that reads as character',
    },
    scratchResistance: 4,
    patinaSpeed: 3,
    softness: 3,
    availableColors: ['cognac', 'chestnut', 'olive', 'black', 'navy'],
    availableSizes: ['a6', 'b6', 'standard', 'a5'],
    order: 2,
  },
  'pull-up': {
    code: 'pull-up',
    name: 'Pull-up',
    origin: 'Italy',
    tanning: 'Oil-impregnated, aniline finish',
    thicknessMm: 1.6,
    priceDeltaMinor: 5000,
    schematicHatch: 'cross-hatch',
    character: 'Oil-rich and soft. Colour shifts where it bends.',
    description:
      'Saturated with oil, so the colour lifts wherever the leather bends. Softer than the others from day one, and mottled rather than uniform.',
    ageing: {
      m6: 'Bends already lighter than flat areas',
      m12: 'Rich contrast between worn and untouched surfaces',
      m36: 'Supple, slouched, deeply personal to its owner',
    },
    scratchResistance: 3,
    patinaSpeed: 4,
    softness: 5,
    availableColors: ['cognac', 'black', 'burgundy'],
    availableSizes: ['b6', 'standard', 'a5'],
    order: 3,
  },
};

export const leatherList: LeatherDef[] = Object.values(leathers).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_LEATHER: LeatherCode = 'veg-tan';
```

### Do NOT
- ❌ `pull-up` намеренно не имеет размера `a6` — это тестовый случай для логики конфликтов в T-020. Не «исправлять»

### Acceptance
- [ ] `leatherList` возвращает 3 элемента
- [ ] `leathers['pull-up'].availableSizes` не содержит `'a6'`
- [ ] У каждой кожи заполнены все три поля `ageing`

---

## T-013 — Цвета, нити, шнуры

**Depends on:** T-010
**Estimate:** 0.5ч
**Files:** создать `content/colors.ts`, `content/threads.ts`, `content/cords.ts`

### Business
`order` у цветов решает две задачи: порядок в палитре и приоритет при автоподмене, когда выбранный цвет недоступен в новой коже.

### Code

`content/colors.ts`:
```ts
// content/colors.ts
import type { ColorCode } from '@/types/config';

export interface ColorDef {
  code: ColorCode;
  name: string;
  /** UI only: the swatch dot and the schematic colour chip.
   *  This is NOT the real leather colour — real colour comes from photography. */
  hex: string;
  /** Lower number = higher priority when auto-substituting an unavailable colour */
  order: number;
}

export const colors: Record<ColorCode, ColorDef> = {
  cognac:   { code: 'cognac',   name: 'Cognac',   hex: '#8B4A2B', order: 1 },
  chestnut: { code: 'chestnut', name: 'Chestnut', hex: '#5C3A21', order: 2 },
  natural:  { code: 'natural',  name: 'Natural',  hex: '#C9A97E', order: 3 },
  olive:    { code: 'olive',    name: 'Olive',    hex: '#4A4B32', order: 4 },
  navy:     { code: 'navy',     name: 'Navy',     hex: '#2A3345', order: 5 },
  burgundy: { code: 'burgundy', name: 'Burgundy', hex: '#5A222B', order: 6 },
  black:    { code: 'black',    name: 'Black',    hex: '#1C1917', order: 7 },
};

export const colorList: ColorDef[] = Object.values(colors).sort((a, b) => a.order - b.order);

export const DEFAULT_COLOR: ColorCode = 'cognac';
```

`content/threads.ts`:
```ts
// content/threads.ts
import type { ThreadCode } from '@/types/config';

export interface ThreadDef {
  code: ThreadCode;
  name: string;
  /** Used for the dashed stitch line on the schematic */
  hex: string;
  description: string;
  order: number;
}

export const threads: Record<ThreadCode, ThreadDef> = {
  natural:  { code: 'natural',  name: 'Natural linen', hex: '#C9B79A', description: 'Undyed linen thread', order: 1 },
  tonal:    { code: 'tonal',    name: 'Tonal',         hex: '#6B4A33', description: 'Matches the leather', order: 2 },
  contrast: { code: 'contrast', name: 'Contrast',      hex: '#2A3345', description: 'Deliberately visible stitching', order: 3 },
};

export const threadList: ThreadDef[] = Object.values(threads).sort((a, b) => a.order - b.order);

export const DEFAULT_THREAD: ThreadCode = 'natural';
```

`content/cords.ts`:
```ts
// content/cords.ts
import type { CordCode } from '@/types/config';

export interface CordDef {
  code: CordCode;
  name: string;
  hex: string;
  order: number;
}

export const cords: Record<CordCode, CordDef> = {
  black:    { code: 'black',    name: 'Black',    hex: '#1C1917', order: 1 },
  brown:    { code: 'brown',    name: 'Brown',    hex: '#5C3A21', order: 2 },
  olive:    { code: 'olive',    name: 'Olive',    hex: '#4A4B32', order: 3 },
  burgundy: { code: 'burgundy', name: 'Burgundy', hex: '#5A222B', order: 4 },
};

export const cordList: CordDef[] = Object.values(cords).sort((a, b) => a.order - b.order);

export const DEFAULT_CORD: CordCode = 'black';
```

### Acceptance
- [ ] `colorList[0].code === 'cognac'`
- [ ] Все три файла компилируются
- [ ] Все семь цветов присутствуют

---

## T-014 — Матрица наличия

**Depends on:** T-012, T-013
**Estimate:** 1ч
**Files:** создать `content/availability.ts`

### Business
Это управляющий документ **и сайта, и фотосъёмки**. Комбинация со статусом `unavailable` не показывается покупателю как доступная и **не попадает в список кадров** — снимать то, что не продаётся, незачем. Владелец бизнеса меняет наличие правкой этого файла, без разработчика.

### Code

```ts
// content/availability.ts
import type { LeatherCode, ColorCode, StockStatus } from '@/types/config';

/** Key format: `${leather}_${color}` */
export type StockKey = string;

export function stockKey(leather: LeatherCode, color: ColorCode): StockKey {
  return `${leather}_${color}`;
}

/**
 * MANUAL STOCK CONTROL.
 * This is the only file to edit when leather stock changes.
 * A key missing from this map is treated as 'unavailable'.
 */
export const stock: Record<StockKey, StockStatus> = {
  // veg-tan
  'veg-tan_natural': 'in_stock',
  'veg-tan_cognac': 'in_stock',
  'veg-tan_chestnut': 'in_stock',
  'veg-tan_black': 'made_to_order',
  // crazy-horse
  'crazy-horse_cognac': 'in_stock',
  'crazy-horse_chestnut': 'in_stock',
  'crazy-horse_olive': 'made_to_order',
  'crazy-horse_black': 'in_stock',
  'crazy-horse_navy': 'made_to_order',
  // pull-up
  'pull-up_cognac': 'in_stock',
  'pull-up_black': 'in_stock',
  'pull-up_burgundy': 'unavailable',
};

export const productionDays: Record<Exclude<StockStatus, 'unavailable'>, number> = {
  in_stock: 5,
  made_to_order: 14,
};
```

### Do NOT
- ❌ Не добавлять комбинации, которых нет в `availableColors` соответствующей кожи
- ❌ `pull-up_burgundy` намеренно `unavailable` — это тестовый случай для UI. Не менять

### Acceptance
- [ ] `stockKey('veg-tan', 'cognac') === 'veg-tan_cognac'`
- [ ] В `stock` ровно 12 ключей
- [ ] Ровно один ключ имеет статус `unavailable`

---

## T-015 — Цены

**Depends on:** T-010
**Estimate:** 0.5ч
**Files:** создать `content/pricing.ts`

### Business
Все доплаты в одном месте. Базовая цена зависит от размера (в `sizes.ts`), надбавка за кожу — в `leathers.ts`, здесь — фиксированные опции.

### Code

```ts
// content/pricing.ts
import type { InsertType } from '@/types/config';

export const CURRENCY = 'PLN' as const;

/** All amounts in minor units (grosz). 4000 === 40.00 zł */
export const ENGRAVING_MINOR = 4000;
export const GIFT_BOX_MINOR = 3500;

export const insertPriceMinor: Record<InsertType, number> = {
  plain: 2500,
  ruled: 2500,
  dot: 2500,
};

export const insertNames: Record<InsertType, string> = {
  plain: 'Plain',
  ruled: 'Ruled',
  dot: 'Dot grid',
};

export const MAX_INSERTS_PER_TYPE = 4;
export const MAX_ENGRAVING_LENGTH = 20;
```

### Acceptance
- [ ] Все значения — целые числа
- [ ] `ENGRAVING_MINOR === 4000`

---

## T-016 — Требования к кадрам

**Depends on:** T-010
**Estimate:** 0.5ч
**Files:** создать `content/shots.ts`

### Business
Это текст технического задания фотографу. Он выводится и на схемах в конструкторе (выносками), и на странице `/shotlist`. Один источник — значит, они не разойдутся.

### Code

```ts
// content/shots.ts
import type { Angle } from '@/types/config';

export interface AngleSpec {
  angle: Angle;
  name: string;
  /** CSS aspect-ratio value, e.g. '4 / 5' */
  ratio: string;
  /** Numeric ratio for SVG viewBox calculations: width / height */
  ratioValue: number;
  /** Shown as callouts on the schematic */
  mustShow: string[];
  /** One-line description of the framing */
  framing: string;
}

export const angleSpecs: Record<Angle, AngleSpec> = {
  front: {
    angle: 'front',
    name: 'Front',
    ratio: '4 / 5',
    ratioValue: 0.8,
    mustShow: ['Leather grain', 'Stitch line', 'Burnished edge', 'Overall silhouette'],
    framing: 'Closed cover, slight angle, whole object in frame',
  },
  open: {
    angle: 'open',
    name: 'Open',
    ratio: '4 / 3',
    ratioValue: 1.3333,
    mustShow: ['How inserts attach', 'Inner side of the leather', 'Elastic retention'],
    framing: 'Cover opened flat, inserts in place, shot from above',
  },
  detail: {
    angle: 'detail',
    name: 'Detail',
    ratio: '1 / 1',
    ratioValue: 1,
    mustShow: ['Stitch density', 'Edge finish', 'Close grain'],
    framing: 'Corner of the cover filling the frame',
  },
};

export const angleList: AngleSpec[] = [
  angleSpecs.front,
  angleSpecs.open,
  angleSpecs.detail,
];

/** Rules that apply to every single product shot. Shown on /shotlist. */
export const globalShotRules: string[] = [
  'No cord and no engraving in frame — both are composited in code',
  'Identical angle, light, distance and background within one angle group',
  'One neutral background across the whole matrix',
  'At least 2400 px on the long side before compression',
  'No retouching of the leather texture',
  'Shoot one size only — size is shown on the site by a diagram, not by photography',
  'Deliver original files, not messenger-compressed images',
];

/** Text shown on every schematic so it cannot be misread as a finished photo */
export const NOT_IN_FRAME = 'NOT IN FRAME: cord, engraving, packaging, props';
```

### Acceptance
- [ ] `angleList` возвращает 3 элемента в порядке front, open, detail
- [ ] `globalShotRules` содержит 7 строк

---

## T-017 — Флаги секций лендинга

**Depends on:** —
**Estimate:** 0.25ч
**Files:** создать `content/sections.ts`

### Business
Секции лендинга, для которых нет фотографий, **скрываются целиком**, а не показываются с серыми плашками. Пустая плашка на странице, которая должна выглядеть как работающий магазин, разрушает впечатление сильнее, чем отсутствие секции.

### Code

```ts
// content/sections.ts

/**
 * Landing section visibility.
 * Turn a section on only when the required photography actually exists.
 */
export const sections = {
  /** S5 Patina before/after — needs a photo of a year-old piece. Does not exist yet. */
  patina: false,
  /** S6 Process — 'full' needs 6 process shots, 'compact' needs 2. */
  process: 'compact' as 'full' | 'compact' | false,
  /** S8 Reviews — real reviews only. Never invent them. */
  reviews: false,
} as const;
```

### Acceptance
- [ ] `sections.patina === false`
- [ ] `sections.process === 'compact'`

---

## T-018 — Все тексты

**Depends on:** T-010
**Estimate:** 3ч
**Files:** создать `content/copy.ts`

### Business
Все строки интерфейса в одном файле. Это готовит проект к добавлению польской и немецкой версий без правки компонентов. Тексты лендинга — финальные, тексты конструктора — рабочие.

### Steps

1. Создать файл со структурой ниже
2. **Не сокращать и не переписывать тексты** — они финальные для лендинга
3. Компоненты в дальнейших задачах импортируют строки отсюда, а не хардкодят

### Code

```ts
// content/copy.ts

export const copy = {
  brand: {
    name: 'KROJA',
    tagline: 'Handmade leather notebooks',
    city: 'Kraków, Poland',
  },

  nav: {
    materials: 'Materials',
    craft: 'Craft',
    faq: 'FAQ',
    build: 'Build yours',
    shotlist: 'Shot list',
    cart: 'Cart',
  },

  hero: {
    title: 'A notebook cover that outlives the notebook',
    subtitle:
      'Refillable covers, hand-stitched in Kraków from full-grain leather. Change the paper as often as you like. Keep the cover for years.',
    cta: 'Build yours',
    ctaSecondary: 'See the leather',
    trust: 'Handmade in Kraków · Ships across the EU · Made to order',
  },

  reasons: {
    title: 'Three reasons this costs more than a notebook',
    items: [
      {
        title: 'Hand saddle stitch',
        body:
          'Two needles, one thread, every stitch locked against the next. If the thread is cut somewhere in the middle, the seam holds instead of unravelling. A machine cannot do this.',
      },
      {
        title: 'Leather that improves',
        body:
          'Full-grain leather does not wear out the way coated leather does. It darkens, softens and takes on the marks of how you use it. The second year looks better than the first.',
      },
      {
        title: 'The paper is the consumable',
        body:
          'Fill an insert, take it out, put a new one in. The cover stays. One object instead of a shelf of half-used notebooks.',
      },
    ],
  },

  sizes: {
    title: 'Four sizes',
    subtitle: 'Shown to scale. The silhouette on the right is a phone, 150 × 70 mm.',
    capacity: 'Holds up to',
    inserts: 'inserts',
    build: 'Build this size',
  },

  leather: {
    title: 'Three leathers',
    subtitle:
      'All three are full-grain. They differ in how they are tanned, and that changes everything about how they age.',
    comparison: 'Compare',
    scratchResistance: 'Scratch resistance',
    patinaSpeed: 'Patina speed',
    softness: 'Softness',
    thickness: 'Thickness',
    origin: 'Origin',
    ageingTitle: 'How it ages',
    m6: 'After 6 months',
    m12: 'After a year',
    m36: 'After three years',
    build: 'Build with this leather',
    notDefect: {
      title: 'This is not a defect',
      body:
        'Full-grain leather keeps the surface the animal had. That means healed scars, insect marks, growth wrinkles and uneven colour across a single hide. We do not sand these away, because sanding away the grain is what makes cheap leather cheap. If you want a perfectly uniform surface, this is the wrong product and we would rather you knew now.',
    },
    careTitle: 'Care',
    careBody:
      'Nothing, most of the time. Wipe dust with a dry cloth. Once or twice a year, a thin coat of neutral leather balm if it feels dry. Never soak it, never dry it on a radiator, never use household cleaners.',
  },

  process: {
    title: 'How it is made',
    subtitle: 'Six steps, one pair of hands, about four hours per cover.',
    steps: [
      { title: 'Cutting', body: 'The hide is read for scars and stretch, then cut by hand around them.' },
      { title: 'Skiving', body: 'Edges are thinned so folds sit flat instead of bulking up.' },
      { title: 'Marking', body: 'Stitch holes are spaced by hand with a pricking iron.' },
      { title: 'Saddle stitch', body: 'Two needles, crossing through every hole. This is the slow part.' },
      { title: 'Edge finishing', body: 'Edges are sanded, dyed and burnished until they are smooth.' },
      { title: 'Finish', body: 'A light coat of balm, hardware set, final inspection.' },
    ],
  },

  included: {
    title: 'What arrives',
    items: [
      'The leather cover, hand-stitched and finished',
      'Paper inserts of your choice',
      'Elastic cord in your chosen colour',
      'A care card',
      'A plain box, no plastic',
    ],
    compatibility:
      'The cover also fits standard inserts from Moleskine Cahier, Leuchtturm1917 and Traveler’s Notebook, in the matching size.',
    timeTitle: 'Time',
    timeBody:
      'Every cover is cut and stitched after you order it. In-stock leather ships in about 5 working days. Made-to-order leather takes up to 14.',
  },

  faq: {
    title: 'Questions',
    items: [
      {
        q: 'Why does this cost more than a notebook from a shop?',
        a: 'Because you are not buying paper. You are buying the cover, and it is made by one person in about four hours from a hide that costs more per square metre than most finished notebooks. The paper inside costs a few złoty and is meant to be replaced.',
      },
      {
        q: 'Will the leather smell?',
        a: 'Yes, of leather, strongly at first. Vegetable-tanned leather smells the most. It settles over a few weeks.',
      },
      {
        q: 'Will it scratch?',
        a: 'Yes. Crazy Horse hides scratches best — most rub out with a thumb. Vegetable-tanned keeps them, which is the point: the surface becomes a record of use.',
      },
      {
        q: 'What happens when the paper runs out?',
        a: 'You buy new inserts, from us or from anyone else. The cover holds standard sizes.',
      },
      {
        q: 'Do inserts from other brands fit?',
        a: 'Yes. Moleskine Cahier, Leuchtturm1917 and Traveler’s Notebook inserts all fit in the matching size.',
      },
      {
        q: 'How long does delivery take within the EU?',
        a: 'Production first: 5 working days for in-stock leather, up to 14 for made-to-order. Shipping then takes 2–5 working days depending on the country.',
      },
      {
        q: 'Can I return it?',
        a: 'Return terms are being finalised before the first batch opens. Engraved covers are made for one person and cannot be resold, so they are treated differently from plain ones. Exact terms will be published before any order is taken.',
      },
      {
        q: 'Where does the leather come from?',
        a: 'Vegetable-tanned from Tuscany, Crazy Horse from a Polish tannery, Pull-up from Italy. All full-grain, all from tanneries that work with the food industry’s by-product.',
      },
      {
        q: 'Is this a good gift?',
        a: 'It is the most common reason people buy it. Add engraving, add the gift box, and it arrives ready to hand over.',
      },
    ],
  },

  finalCta: {
    title: 'Build the one you would actually use',
    body: 'Size, leather, colour, thread, engraving. Two minutes.',
    cta: 'Build yours',
  },

  configurator: {
    title: 'Build your notebook',
    steps: {
      size: 'Size',
      leather: 'Leather',
      color: 'Colour',
      details: 'Thread and cord',
      engraving: 'Engraving',
      inserts: 'Inserts',
      giftBox: 'Gift box',
    },
    thread: 'Thread',
    cord: 'Elastic cord',
    engravingPlaceholder: 'Your name or initials',
    engravingHint: 'Up to 20 characters. Letters, numbers, spaces, full stops and hyphens.',
    engravingPositionLabel: 'Position',
    engravingFontLabel: 'Style',
    engravingPositions: { 'bottom-right': 'Bottom right', spine: 'Spine' },
    engravingFonts: { serif: 'Serif', sans: 'Sans' },
    giftBoxLabel: 'Add a gift box and card',
    addToCart: 'Add to cart',
    readyIn: 'Ready in',
    workingDays: 'working days',
    madeToOrder: 'Made to order',
    unavailable: 'Currently unavailable',
    notAvailableIn: 'Not available in',
    notifyMe: 'Notify me when available',
    schematicNote:
      'This is a technical drawing, not a photograph. It shows what has to be photographed, not what the leather looks like.',
    sizeNote:
      'Size is shown by this diagram, not by photography — one photo per leather and colour covers every size.',
    restoreTitle: 'Continue where you left off?',
    restoreYes: 'Restore',
    restoreNo: 'Start fresh',
    conflictBanner:
      'That combination is not available, so we selected the closest match.',
  },

  cart: {
    title: 'Your notebook',
    empty: 'Nothing here yet.',
    edit: 'Edit',
    remove: 'Remove',
    total: 'Total',
    engravingConfirmTitle: 'Check your engraving',
    engravingConfirmBody:
      'Engraving is permanent. Check the spelling now — it cannot be changed after the piece is made.',
    engravingConfirmEdit: 'Edit',
    engravingConfirmOk: 'Confirm and add',
  },

  reserve: {
    title: 'First batch opens soon',
    body:
      'We are not taking payment yet. Leave your email and we will write to you first when the first batch opens, with 15% off.',
    placeholder: 'your@email.com',
    button: 'Reserve this configuration',
    success: 'Reserved. We will write to you before anyone else.',
    error: 'Something went wrong. Try again in a moment.',
  },

  shotlist: {
    title: 'Shot list',
    subtitle: 'Everything that needs to be photographed, and how.',
    totalLabel: 'shots total',
    productShots: 'Product matrix',
    storyShots: 'Story shots',
    rules: 'Rules for every product shot',
    legend: 'Hatch legend',
    print: 'Print',
    exportMd: 'Export markdown',
    exportCsv: 'Export CSV',
    generated: 'Generated',
  },

  footer: {
    line: 'Refillable leather notebook covers, hand-stitched in Kraków.',
    rights: 'All rights reserved.',
  },
} as const;
```

### Do NOT
- ❌ Не переписывать тексты «покороче». Они финальные
- ❌ Не добавлять восклицательные знаки и маркетинговые эпитеты

### Acceptance
- [ ] Файл компилируется
- [ ] `copy.faq.items` содержит 9 вопросов
- [ ] `copy.process.steps` содержит 6 шагов

---

## T-019 — Расчёт цены

**Depends on:** T-011, T-015
**Estimate:** 1ч
**Files:** создать `lib/pricing.ts`

### Business
Одна функция, считающая цену. Используется и в конструкторе, и в корзине — расхождение цен между экранами невозможно по конструкции.

### Code

```ts
// lib/pricing.ts
import type { Configuration } from '@/types/config';
import { sizes } from '@/content/sizes';
import { leathers } from '@/content/leathers';
import {
  ENGRAVING_MINOR,
  GIFT_BOX_MINOR,
  insertPriceMinor,
} from '@/content/pricing';

export interface PriceBreakdown {
  baseMinor: number;
  leatherMinor: number;
  engravingMinor: number;
  insertsMinor: number;
  giftBoxMinor: number;
  totalMinor: number;
}

export function hasEngraving(config: Configuration): boolean {
  return !!config.engraving && config.engraving.text.trim().length > 0;
}

export function calculatePrice(config: Configuration): PriceBreakdown {
  const baseMinor = sizes[config.size].basePriceMinor;
  const leatherMinor = leathers[config.leather].priceDeltaMinor;
  const engravingMinor = hasEngraving(config) ? ENGRAVING_MINOR : 0;

  const insertsMinor = config.inserts.reduce(
    (sum, item) => sum + insertPriceMinor[item.type] * item.qty,
    0,
  );

  const giftBoxMinor = config.giftBox ? GIFT_BOX_MINOR : 0;

  return {
    baseMinor,
    leatherMinor,
    engravingMinor,
    insertsMinor,
    giftBoxMinor,
    totalMinor: baseMinor + leatherMinor + engravingMinor + insertsMinor + giftBoxMinor,
  };
}
```

### Do NOT
- ❌ Не использовать дробные числа
- ❌ Гравировка из одних пробелов **не** оплачивается — за это отвечает `hasEngraving`

### Acceptance
- [ ] Конфигурация A5 + veg-tan без опций даёт `totalMinor === 30000`
- [ ] Добавление crazy-horse даёт `33000`
- [ ] Гравировка `'   '` (пробелы) не добавляет 4000

---

## T-020 — Доступность и разрешение конфликтов

**Depends on:** T-014
**Estimate:** 2ч
**Files:** создать `lib/availability.ts`

### Business
Ключевое бизнес-правило: **недоступная опция не исчезает, а показывается затемнённой с причиной.** Исчезающие опции ломают понимание — человек не видит, что изменилось, и теряет доверие к интерфейсу.

Второе правило: при смене кожи приоритет у **размера**, а не у цвета. Размер выбирают осознанно, цвет — эмоционально, поэтому подменяем цвет.

### Code

```ts
// lib/availability.ts
import type {
  LeatherCode, ColorCode, SizeCode, StockStatus, Configuration,
} from '@/types/config';
import { leathers } from '@/content/leathers';
import { colors, colorList } from '@/content/colors';
import { stock, stockKey, productionDays } from '@/content/availability';

export type OptionState =
  | { kind: 'available'; status: 'in_stock' | 'made_to_order' }
  | { kind: 'unavailable'; reason: string }
  | { kind: 'not-in-leather'; reason: string };

export function getStock(leather: LeatherCode, color: ColorCode): StockStatus {
  return stock[stockKey(leather, color)] ?? 'unavailable';
}

export function getProductionDays(leather: LeatherCode, color: ColorCode): number {
  const s = getStock(leather, color);
  if (s === 'unavailable') return productionDays.made_to_order;
  return productionDays[s];
}

/** Can this leather be made in this size at all? */
export function isSizeAvailableInLeather(leather: LeatherCode, size: SizeCode): boolean {
  return leathers[leather].availableSizes.includes(size);
}

/** Does this leather exist in this colour at all (regardless of stock)? */
export function isColorInLeather(leather: LeatherCode, color: ColorCode): boolean {
  return leathers[leather].availableColors.includes(color);
}

/** Full UI state of a colour swatch for a given leather. */
export function getColorState(leather: LeatherCode, color: ColorCode): OptionState {
  if (!isColorInLeather(leather, color)) {
    return {
      kind: 'not-in-leather',
      reason: `Not available in ${leathers[leather].name}`,
    };
  }
  const s = getStock(leather, color);
  if (s === 'unavailable') {
    return { kind: 'unavailable', reason: 'Currently unavailable' };
  }
  return { kind: 'available', status: s };
}

/** Full UI state of a leather card for a given size. */
export function getLeatherState(leather: LeatherCode, size: SizeCode): OptionState {
  if (!isSizeAvailableInLeather(leather, size)) {
    return {
      kind: 'not-in-leather',
      reason: `Not available in this size`,
    };
  }
  return { kind: 'available', status: 'in_stock' };
}

/** Is a colour selectable right now (exists in leather AND in stock)? */
export function isColorSelectable(leather: LeatherCode, color: ColorCode): boolean {
  return getColorState(leather, color).kind === 'available';
}

/**
 * Best replacement colour when the current one cannot be used.
 * Priority order comes from colors.order (lower = higher priority).
 * Returns null only if the leather has no selectable colour at all.
 */
export function findClosestColor(leather: LeatherCode): ColorCode | null {
  const candidates = colorList
    .filter((c) => isColorSelectable(leather, c.code))
    .sort((a, b) => a.order - b.order);
  return candidates[0]?.code ?? null;
}

export interface ResolveResult {
  config: Configuration;
  /** Human-readable messages about what was changed and why. Empty if nothing changed. */
  changes: string[];
}

/**
 * Takes any configuration (possibly invalid) and returns the closest valid one.
 * NEVER throws. NEVER returns an invalid configuration.
 */
export function resolveConfiguration(input: Configuration): ResolveResult {
  const changes: string[] = [];
  let { leather, color, size } = input;

  // Rule 1: size wins over leather.
  // If the leather cannot be made in this size, switch to a leather that can.
  if (!isSizeAvailableInLeather(leather, size)) {
    const fallback = Object.values(leathers)
      .sort((a, b) => a.order - b.order)
      .find((l) => l.availableSizes.includes(size));
    if (fallback) {
      changes.push(
        `Leather changed to ${fallback.name} — ${leathers[leather].name} is not made in this size`,
      );
      leather = fallback.code;
    }
  }

  // Rule 2: colour is substituted if it does not exist in the leather or is out of stock.
  if (!isColorSelectable(leather, color)) {
    const replacement = findClosestColor(leather);
    if (replacement) {
      changes.push(
        `Colour changed to ${colors[replacement].name} — ${colors[color].name} is not available in ${leathers[leather].name}`,
      );
      color = replacement;
    }
  }

  return { config: { ...input, leather, color, size }, changes };
}
```

### Do NOT
- ❌ Функция `resolveConfiguration` **не должна бросать исключения** ни при каких входных данных
- ❌ Не менять приоритет: размер важнее кожи, кожа важнее цвета

### Acceptance
- [ ] `getColorState('pull-up', 'olive').kind === 'not-in-leather'`
- [ ] `getColorState('pull-up', 'burgundy').kind === 'unavailable'`
- [ ] `getColorState('veg-tan', 'cognac').kind === 'available'`
- [ ] `resolveConfiguration` с `{ size: 'a6', leather: 'pull-up', … }` возвращает другую кожу и одно сообщение в `changes`
- [ ] `findClosestColor('pull-up')` возвращает `'cognac'`

---

## T-021 — Zod-схема конфигурации

**Depends on:** T-010
**Estimate:** 1.5ч
**Files:** создать `lib/config-schema.ts`

### Business
Защита от битых данных из трёх источников: URL, localStorage, тело запроса API. Схема **никогда не падает** — на каждом поле стоит `.catch()`, который подставляет значение по умолчанию.

### Code

```ts
// lib/config-schema.ts
import { z } from 'zod';
import type { Configuration } from '@/types/config';
import { DEFAULT_SIZE } from '@/content/sizes';
import { DEFAULT_LEATHER } from '@/content/leathers';
import { DEFAULT_COLOR } from '@/content/colors';
import { DEFAULT_THREAD } from '@/content/threads';
import { DEFAULT_CORD } from '@/content/cords';
import { MAX_ENGRAVING_LENGTH, MAX_INSERTS_PER_TYPE } from '@/content/pricing';

/** Latin, Polish, Cyrillic letters, digits, space, dot, hyphen, ampersand. */
export const ENGRAVING_ALLOWED_RE =
  /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻа-яА-ЯёЁ .\-&]*$/;

/** Strips every character that is not allowed. Used on every keystroke. */
export function sanitizeEngraving(raw: string): string {
  return raw
    .split('')
    .filter((ch) => ENGRAVING_ALLOWED_RE.test(ch))
    .join('')
    .slice(0, MAX_ENGRAVING_LENGTH);
}

export const engravingSchema = z
  .object({
    text: z.string().max(MAX_ENGRAVING_LENGTH).catch(''),
    font: z.enum(['serif', 'sans']).catch('serif'),
    position: z.enum(['bottom-right', 'spine']).catch('bottom-right'),
  })
  .nullable()
  .catch(null);

export const insertSchema = z.object({
  type: z.enum(['plain', 'ruled', 'dot']).catch('dot'),
  qty: z.number().int().min(0).max(MAX_INSERTS_PER_TYPE).catch(1),
});

export const configSchema = z.object({
  size: z.enum(['a6', 'b6', 'standard', 'a5']).catch(DEFAULT_SIZE),
  leather: z.enum(['veg-tan', 'crazy-horse', 'pull-up']).catch(DEFAULT_LEATHER),
  color: z
    .enum(['natural', 'cognac', 'chestnut', 'olive', 'black', 'navy', 'burgundy'])
    .catch(DEFAULT_COLOR),
  thread: z.enum(['natural', 'tonal', 'contrast']).catch(DEFAULT_THREAD),
  cord: z.enum(['black', 'brown', 'olive', 'burgundy']).catch(DEFAULT_CORD),
  engraving: engravingSchema,
  inserts: z.array(insertSchema).max(3).catch([{ type: 'dot', qty: 1 }]),
  giftBox: z.boolean().catch(false),
});

export const DEFAULT_CONFIG: Configuration = {
  size: DEFAULT_SIZE,
  leather: DEFAULT_LEATHER,
  color: DEFAULT_COLOR,
  thread: DEFAULT_THREAD,
  cord: DEFAULT_CORD,
  engraving: null,
  inserts: [{ type: 'dot', qty: 1 }],
  giftBox: false,
};

/**
 * Parses anything into a valid Configuration.
 * Also normalises engraving: whitespace-only text becomes null.
 * NEVER throws.
 */
export function parseConfig(input: unknown): Configuration {
  const result = configSchema.safeParse(input);
  const parsed = result.success ? result.data : DEFAULT_CONFIG;

  let engraving = parsed.engraving;
  if (engraving) {
    const clean = sanitizeEngraving(engraving.text).trim();
    engraving = clean.length > 0 ? { ...engraving, text: clean } : null;
  }

  return { ...parsed, engraving } as Configuration;
}
```

### Do NOT
- ❌ Не использовать `.parse()` — только `.safeParse()`
- ❌ Не убирать `.catch()` ни с одного поля

### Acceptance
- [ ] `parseConfig({})` возвращает `DEFAULT_CONFIG`
- [ ] `parseConfig(null)` не бросает исключение
- [ ] `parseConfig({ size: 'xl' })` возвращает `size: 'a5'`
- [ ] `sanitizeEngraving('AB🔥CD')` возвращает `'ABCD'`
- [ ] `sanitizeEngraving('a'.repeat(50))` возвращает строку длиной 20
- [ ] Гравировка из одних пробелов превращается в `null`

---

## T-022 — Состояние конфигурации в URL

**Depends on:** T-021, T-020
**Estimate:** 2ч
**Files:** создать `lib/config-url.ts`

### Business
URL — единственный источник истины для конфигурации. Это даёт четыре вещи: пользователь может отправить ссылку («покажу жене, что беру»), конфигурация восстанавливается из корзины, с лендинга можно попасть в конструктор с предвыбранным размером, и работает кнопка «назад» в браузере.

### Code

```ts
// lib/config-url.ts
import type { Configuration, InsertSelection } from '@/types/config';
import { parseConfig, DEFAULT_CONFIG } from './config-schema';
import { resolveConfiguration } from './availability';

export interface ParsedUrlConfig {
  config: Configuration;
  /** Messages about substitutions made because the URL asked for something impossible */
  warnings: string[];
}

/** Serialises inserts as `2:dot,1:ruled` */
function serialiseInserts(inserts: InsertSelection[]): string {
  return inserts
    .filter((i) => i.qty > 0)
    .map((i) => `${i.qty}:${i.type}`)
    .join(',');
}

function parseInserts(raw: string | null): InsertSelection[] | undefined {
  if (!raw) return undefined;
  const parts = raw.split(',').filter(Boolean);
  const result: InsertSelection[] = [];
  for (const part of parts) {
    const [qtyRaw, typeRaw] = part.split(':');
    const qty = Number.parseInt(qtyRaw, 10);
    if (Number.isNaN(qty)) continue;
    result.push({ type: typeRaw as InsertSelection['type'], qty });
  }
  return result.length > 0 ? result : undefined;
}

/**
 * Reads a configuration out of URL search params.
 * Unknown params are ignored. Invalid values fall back to defaults.
 * Impossible combinations are resolved to the closest valid one and reported in warnings.
 * NEVER throws.
 */
export function configFromSearchParams(
  params: URLSearchParams | Record<string, string | undefined>,
): ParsedUrlConfig {
  const get = (key: string): string | null => {
    if (params instanceof URLSearchParams) return params.get(key);
    return params[key] ?? null;
  };

  const engravingText = get('engraving');

  const raw = {
    size: get('size') ?? undefined,
    leather: get('leather') ?? undefined,
    color: get('color') ?? undefined,
    thread: get('thread') ?? undefined,
    cord: get('cord') ?? undefined,
    engraving: engravingText
      ? {
          text: engravingText,
          font: get('font') ?? undefined,
          position: get('pos') ?? undefined,
        }
      : null,
    inserts: parseInserts(get('inserts')),
    giftBox: get('box') === '1',
  };

  const parsed = parseConfig(raw);
  const { config, changes } = resolveConfiguration(parsed);

  return { config, warnings: changes };
}

/**
 * Serialises a configuration into search params.
 * Only writes values that differ from the default, to keep URLs short and shareable.
 */
export function configToSearchParams(config: Configuration): URLSearchParams {
  const p = new URLSearchParams();

  p.set('size', config.size);
  p.set('leather', config.leather);
  p.set('color', config.color);

  if (config.thread !== DEFAULT_CONFIG.thread) p.set('thread', config.thread);
  if (config.cord !== DEFAULT_CONFIG.cord) p.set('cord', config.cord);

  if (config.engraving && config.engraving.text.trim()) {
    p.set('engraving', config.engraving.text);
    p.set('font', config.engraving.font);
    p.set('pos', config.engraving.position);
  }

  const inserts = serialiseInserts(config.inserts);
  if (inserts) p.set('inserts', inserts);

  if (config.giftBox) p.set('box', '1');

  return p;
}

export function configToQueryString(config: Configuration): string {
  return `?${configToSearchParams(config).toString()}`;
}
```

### Do NOT
- ❌ Не бросать исключения ни при каких входных данных
- ❌ Не записывать в URL значения по умолчанию для нити, шнура и коробки — URL должен оставаться коротким

### Acceptance
- [ ] `configFromSearchParams(new URLSearchParams(''))` возвращает дефолтную конфигурацию и пустой `warnings`
- [ ] `configFromSearchParams(new URLSearchParams('size=xl&color=turquoise'))` не падает и возвращает валидную конфигурацию
- [ ] `configFromSearchParams(new URLSearchParams('leather=pull-up&color=olive'))` возвращает непустой `warnings`
- [ ] Обратный ход: `configFromSearchParams(configToSearchParams(cfg)).config` равно `cfg` для любой валидной `cfg`
- [ ] Параметр `utm_source=test` игнорируется молча

---

## T-023 — Резолвер изображений

**Depends on:** T-010
**Estimate:** 0.5ч
**Files:** создать `lib/assets.ts`

### Business
Прослойка между компонентами и картинками. Сейчас отдаёт схему, после фотосъёмки — фотографию. Замена — переключение одной константы, ни один компонент не переписывается.

### Code

```ts
// lib/assets.ts
import type { Configuration, Angle, LeatherCode, ColorCode } from '@/types/config';

/**
 * Switch to 'photo' once real photography exists in /public/previews.
 * Everything else in the app adapts automatically.
 */
export const ASSET_MODE: 'schematic' | 'photo' = 'schematic';

/** Show the "technical drawing" note and NOT IN FRAME badge. Turn off with photos. */
export const SHOW_SCHEMATIC_NOTES = ASSET_MODE === 'schematic';

/** NOTE: size is deliberately not part of the key. */
export function previewKey(leather: LeatherCode, color: ColorCode): string {
  return `${leather}_${color}`;
}

export function previewFilename(
  leather: LeatherCode,
  color: ColorCode,
  angle: Angle,
): string {
  return `${previewKey(leather, color)}_${angle}.webp`;
}

export type PreviewSource =
  | { kind: 'schematic'; config: Configuration; angle: Angle; filename: string }
  | { kind: 'photo'; src: string; alt: string };

export function getPreview(config: Configuration, angle: Angle): PreviewSource {
  const filename = previewFilename(config.leather, config.color, angle);

  if (ASSET_MODE === 'schematic') {
    return { kind: 'schematic', config, angle, filename };
  }

  return {
    kind: 'photo',
    src: `/previews/${filename}`,
    alt: `KROJA notebook cover, ${config.leather} leather, ${config.color}, ${angle} view`,
  };
}
```

### Acceptance
- [ ] `previewFilename('crazy-horse', 'cognac', 'front') === 'crazy-horse_cognac_front.webp'`
- [ ] `getPreview(cfg, 'front').kind === 'schematic'`
- [ ] Смена размера в конфигурации **не** меняет `filename`

---

## T-024 — Форматирование

**Depends on:** T-015
**Estimate:** 0.5ч
**Files:** создать `lib/format.ts`

### Code

```ts
// lib/format.ts

/** 30000 -> "300 zł". Minor units in, display string out. */
export function formatPrice(minor: number): string {
  const major = minor / 100;
  const rounded = Number.isInteger(major) ? major.toString() : major.toFixed(2);
  return `${rounded} zł`;
}

/** 3000 -> "+30 zł". Used next to paid options. */
export function formatDelta(minor: number): string {
  if (minor === 0) return '';
  return `+${formatPrice(minor)}`;
}

/** [148, 210] -> "148 × 210 mm" */
export function formatDimensions([w, h]: [number, number]): string {
  return `${w} × ${h} mm`;
}

/** 210 -> "210 g" */
export function formatWeight(grams: number): string {
  return `${grams} g`;
}

/** 1.8 -> "1.8 mm" */
export function formatThickness(mm: number): string {
  return `${mm} mm`;
}
```

### Do NOT
- ❌ Не использовать `Intl.NumberFormat` — оно даёт разные пробелы в разных средах и ломает snapshot-тесты
- ❌ Не использовать дюймы, унции и любые имперские единицы нигде в проекте

### Acceptance
- [ ] `formatPrice(30000) === '300 zł'`
- [ ] `formatPrice(30050) === '300.50 zł'`
- [ ] `formatDelta(0) === ''`
- [ ] `formatDimensions([148, 210]) === '148 × 210 mm'`

---

## T-025 — Единая точка импорта данных

**Depends on:** T-011 … T-018
**Estimate:** 0.25ч
**Files:** создать `lib/data.ts`

### Business
Один файл, через который весь проект получает данные. Позже источник данных поменяется, и правка будет в одном месте вместо десяти.

Сейчас это просто реэкспорт. Никакой логики здесь нет и быть не должно.

### Code

```ts
// lib/data.ts
// Single import point for all content data.
// Components and lib functions import from here, never from content/* directly.

export { sizes, sizeList, DEFAULT_SIZE } from '@/content/sizes';
export type { SizeDef } from '@/content/sizes';

export { leathers, leatherList, DEFAULT_LEATHER } from '@/content/leathers';
export type { LeatherDef, HatchPattern } from '@/content/leathers';

export { colors, colorList, DEFAULT_COLOR } from '@/content/colors';
export type { ColorDef } from '@/content/colors';

export { threads, threadList, DEFAULT_THREAD } from '@/content/threads';
export type { ThreadDef } from '@/content/threads';

export { cords, cordList, DEFAULT_CORD } from '@/content/cords';
export type { CordDef } from '@/content/cords';

export { stock, stockKey, productionDays } from '@/content/availability';

export {
  CURRENCY,
  ENGRAVING_MINOR,
  GIFT_BOX_MINOR,
  insertPriceMinor,
  insertNames,
  MAX_INSERTS_PER_TYPE,
  MAX_ENGRAVING_LENGTH,
} from '@/content/pricing';

export { angleSpecs, angleList, globalShotRules, NOT_IN_FRAME } from '@/content/shots';
export type { AngleSpec } from '@/content/shots';

export { sections } from '@/content/sections';
export { copy } from '@/content/copy';
```

### Do NOT
- ❌ Не писать здесь никакой логики — только реэкспорт
- ❌ Не делать функции асинхронными
- ❌ Не создавать интерфейсы, абстракции и репозитории

### Acceptance
- [ ] `import { sizes, copy } from '@/lib/data'` работает
- [ ] В файле нет ни одной функции
- [ ] `npm run build` проходит

---

## Контрольная точка EPIC 0–1

Перед переходом к `TASKS-2`:

- [ ] `npm run build` проходит
- [ ] В `content/` девять файлов, в `lib/` шесть файлов, в `types/` один
- [ ] Ни одного React-компонента в `lib/` и `content/`
- [ ] Ни одного `any` в проекте
- [ ] Ни одного числа с плавающей точкой в расчётах цен
