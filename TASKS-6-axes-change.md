# TASKS 6 — Новые оси конструктора (EPIC 9)

Задачи T-120 … T-144. Бизнес-требования — `kroja-spec/17-axes-change.md` (ID вида L-1, K-3 ссылаются туда). Ход работ — `STATUS.md`.

**Что делаем одной фразой:** кожа `veg-tan / crazy-horse / pull-up` → `smooth / croc / suede`; нить → «в тон» или цвет; гравировка → тиснение на 2 буквы; шнур → застёжка (резинка / латунная пряжка / нет); новые оси — карманы для карт и держатель ручки; на схемах появляется ракурс `back` с узелком резинки. Фотосъёмки нет — всё рисуется SVG.

---

> ⚠️ **Три правила этого эпика — читать до первой строки кода.**
>
> **1. Красная зона.** Между T-120 и T-142 полная сборка **падает** — старые компоненты ссылаются на удалённые поля. Это ожидаемо. Проверка на каждой задаче волн A и B — только по своим файлам:
> ```bash
> npx tsc --noEmit --pretty false 2>&1 | grep "<путь/к/файлу/задачи>"
> ```
> Пусто = задача в порядке. Полная зелёная `npm run build` обязательна в T-143 и T-144.
>
> **2. Код в блоках `Code` копируется дословно.** Он написан так, чтобы состыковаться между задачами. Если кажется, что можно лучше, — нельзя.
>
> **3. Волны.** Волна A (T-120…T-131) — строго по порядку, один агент. Волна B (T-132…T-142) — задачи независимы, можно параллельно разными агентами, у каждой свои файлы. Волна C (T-143, T-144) — по порядку, после всей волны B. Перед началом любой задачи — посмотреть `STATUS.md`: задача не должна быть 🔧 у другого агента, все `Depends on` должны быть ✅.

---

## Волна A — типы, данные, логика

---

## T-120 — Типы конфигурации

**Depends on:** — (первая задача эпика)
**Estimate:** 0.5ч
**Files:** заменить `types/config.ts`
**Требования:** L-1, L-6, T-1, E-1, E-2, C-1, P-1, K-1, K-3

### Business
Всё, что пользователь выбирает, описано одним типом `Configuration`. Меняем его один раз здесь — дальше `tsc` сам покажет каждое место, которое нужно обновить. Поэтому эта задача идёт первой и делается целиком, без «пока оставлю старое поле».

### Code

```ts
// types/config.ts

export type SizeCode = 'a6' | 'b6' | 'standard' | 'a5';

export type LeatherCode = 'smooth' | 'croc' | 'suede';

export type ColorCode =
  | 'natural' | 'cognac' | 'chestnut'
  | 'olive' | 'black' | 'navy' | 'burgundy'
  | 'sand' | 'graphite';

/** 'tonal' = the thread takes the leather colour. Everything else is a fixed thread colour. */
export type ThreadCode = 'tonal' | 'linen' | 'cream' | 'black' | 'brown' | 'navy';

export type ClosureCode = 'elastic' | 'buckle' | 'none';

export type ElasticColorCode = 'black' | 'brown' | 'olive' | 'burgundy';

export type PenHolderCode = 'none' | 'slim' | 'wide';

export type InsertType = 'plain' | 'ruled' | 'dot';

export type EmbossingFont = 'serif' | 'sans';

export type EmbossingPosition = 'bottom-right' | 'spine';

/** 'back' is schematic-only. The photo matrix uses front / open / detail. */
export type Angle = 'front' | 'back' | 'open' | 'detail';

export type StockStatus = 'in_stock' | 'made_to_order' | 'unavailable';

export interface Embossing {
  /** 1–2 uppercase letters, Latin or Cyrillic. Never empty, never whitespace. */
  text: string;
  font: EmbossingFont;
  position: EmbossingPosition;
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
  closure: ClosureCode;
  /** Only meaningful when closure === 'elastic'. Always present to keep the type simple. */
  elasticColor: ElasticColorCode;
  penHolder: PenHolderCode;
  /** 0..sizes[size].cardSlotsMax. The per-size limit is enforced in lib/availability.ts */
  cardSlots: number;
  embossing: Embossing | null;
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
- ❌ Не оставлять старые типы (`CordCode`, `Engraving`, `EngravingFont`) «для совместимости». Их нет.
- ❌ Не делать `elasticColor` опциональным. Всегда есть, по умолчанию `black`.

### Acceptance
- [ ] В файле нет слов `engraving`, `cord`, `veg-tan`, `crazy-horse`, `pull-up`
- [ ] `grep -c "" types/config.ts` ≈ 80 строк
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "types/config.ts"` — пусто

---

## T-121 — Данные: размеры, цвета, кожи

**Depends on:** T-120
**Estimate:** 1ч
**Files:** заменить `content/sizes.ts`, `content/colors.ts`, `content/leathers.ts`
**Требования:** L-1…L-8, C-2

### Business
Три новые кожи, два временных цвета, максимум карманов у каждого размера. Тексты по коже — черновики с пометкой `DRAFT`: мастер заменит.

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
  /** Max card slots inside the front cover. See kroja-spec/17-axes-change.md §4 for the maths. */
  cardSlotsMax: number;
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
    cardSlotsMax: 2,
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
    cardSlotsMax: 3,
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
    cardSlotsMax: 3,
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
    cardSlotsMax: 4,
    basePriceMinor: 30000,
    useCase: 'Desk work, journaling, long-form notes',
    order: 4,
  },
};

export const sizeList: SizeDef[] = Object.values(sizes).sort((a, b) => a.order - b.order);

export const DEFAULT_SIZE: SizeCode = 'a5';
```

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
  // TEMPORARY — placeholders until the maker confirms the real palette.
  sand:     { code: 'sand',     name: 'Sand',     hex: '#D9C7A7', order: 8 },
  graphite: { code: 'graphite', name: 'Graphite', hex: '#3B3A38', order: 9 },
};

export const colorList: ColorDef[] = Object.values(colors).sort((a, b) => a.order - b.order);

export const DEFAULT_COLOR: ColorCode = 'cognac';
```

```ts
// content/leathers.ts
import type { LeatherCode, ColorCode, SizeCode } from '@/types/config';

export type HatchPattern = 'diagonal-fine' | 'croc-scale' | 'stipple';

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

/**
 * "Everything is available" until the maker confirms real stock.
 * To restrict a leather later, edit its availableColors / availableSizes — nothing else.
 */
const ALL_COLORS: ColorCode[] = [
  'natural', 'cognac', 'chestnut', 'olive', 'black', 'navy', 'burgundy', 'sand', 'graphite',
];
const ALL_SIZES: SizeCode[] = ['a6', 'b6', 'standard', 'a5'];

// DRAFT: origin, tanning, thickness and all texts are placeholders until the maker confirms them.
export const leathers: Record<LeatherCode, LeatherDef> = {
  smooth: {
    code: 'smooth',
    name: 'Smooth leather',
    origin: 'European tannery',
    tanning: 'Vegetable-tanned',
    thicknessMm: 1.8,
    priceDeltaMinor: 0,
    schematicHatch: 'diagonal-fine',
    character: 'Even, closed grain. Ages evenly.',
    description:
      'A clean, even surface with a fine natural grain. The most classic of the three: it takes embossing crisply and darkens evenly with use.',
    ageing: {
      m6: 'Slightly darker where hands touch it most',
      m12: 'Even, warmer tone, soft sheen on the edges',
      m36: 'Deep, uniform patina; holds its shape',
    },
    scratchResistance: 3,
    patinaSpeed: 3,
    softness: 3,
    availableColors: ALL_COLORS,
    availableSizes: ALL_SIZES,
    order: 1,
  },
  croc: {
    code: 'croc',
    name: 'Croc-embossed leather',
    origin: 'European tannery',
    tanning: 'Vegetable-tanned, plate-embossed',
    thicknessMm: 1.8,
    priceDeltaMinor: 1000,
    schematicHatch: 'croc-scale',
    character: 'Crocodile-pattern relief pressed into cowhide.',
    description:
      'Full-grain cowhide pressed with a crocodile-scale plate. The relief hides small scratches and gives the cover a formal, structured look. No exotic skins are used.',
    ageing: {
      m6: 'Scale tops polish slightly from handling',
      m12: 'Contrast between raised and recessed areas grows',
      m36: 'Glossy ridges, matte valleys — a deep two-tone relief',
    },
    scratchResistance: 4,
    patinaSpeed: 2,
    softness: 2,
    availableColors: ALL_COLORS,
    availableSizes: ALL_SIZES,
    order: 2,
  },
  suede: {
    code: 'suede',
    name: 'Suede',
    origin: 'European tannery',
    tanning: 'Chrome-free split',
    thicknessMm: 1.6,
    priceDeltaMinor: 2000,
    schematicHatch: 'stipple',
    character: 'Soft, velvety nap. Warm to the touch.',
    description:
      'The flesh side of the hide, buffed to a fine velvet nap. The softest and warmest of the three. It marks easily and that is its character — brush it and the nap recovers.',
    ageing: {
      m6: 'Nap flattens where fingers rest',
      m12: 'Colour deepens, surface becomes smoother',
      m36: 'Worn-in, slightly glossy in high-touch areas',
    },
    scratchResistance: 2,
    patinaSpeed: 4,
    softness: 5,
    availableColors: ALL_COLORS,
    availableSizes: ALL_SIZES,
    order: 3,
  },
};

export const leatherList: LeatherDef[] = Object.values(leathers).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_LEATHER: LeatherCode = 'smooth';
```

### Do NOT
- ❌ Не удалять `availableColors` / `availableSizes` «раз всё доступно». Это механизм на будущее (X-9).
- ❌ Не выдумывать другие hex для `sand` и `graphite`.

### Acceptance
- [ ] `sizes.a6.cardSlotsMax === 2`, `b6 → 3`, `standard → 3`, `a5 → 4`
- [ ] В `colors` девять записей
- [ ] В `leathers` три записи, `DEFAULT_LEATHER === 'smooth'`
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "content/sizes.ts\|content/colors.ts\|content/leathers.ts"` — пусто

---

## T-122 — Данные: нить, резинка, застёжка, держатель, цены

**Depends on:** T-121
**Estimate:** 1ч
**Files:** заменить `content/threads.ts`, `content/pricing.ts`; создать `content/elastic.ts`, `content/closures.ts`, `content/pen-holders.ts`; **удалить** `content/cords.ts`
**Требования:** T-1…T-4, K-1, K-2, K-6, P-1…P-3, C-4, E-5, §8

### Business
Каждая ось — свой маленький файл данных с кодами, порядком и тем, что нужно интерфейсу. Все надбавки — в `pricing.ts` целыми грошами.

### Code

```ts
// content/threads.ts
import type { ThreadCode } from '@/types/config';

export interface ThreadDef {
  code: ThreadCode;
  name: string;
  /** null = take the leather colour (the 'tonal' mode) */
  hex: string | null;
  /** All threads are free today. Field exists so a single colour can get a surcharge later. */
  priceMinor: number;
  order: number;
}

// TEMPORARY palette — replaced with the maker's real threads later.
export const threads: Record<ThreadCode, ThreadDef> = {
  tonal: { code: 'tonal', name: 'Match the leather', hex: null,      priceMinor: 0, order: 1 },
  linen: { code: 'linen', name: 'Natural linen',     hex: '#C9B79A', priceMinor: 0, order: 2 },
  cream: { code: 'cream', name: 'Cream',             hex: '#EFE6D3', priceMinor: 0, order: 3 },
  black: { code: 'black', name: 'Black',             hex: '#1C1917', priceMinor: 0, order: 4 },
  brown: { code: 'brown', name: 'Brown',             hex: '#5C3A21', priceMinor: 0, order: 5 },
  navy:  { code: 'navy',  name: 'Navy',              hex: '#2A3345', priceMinor: 0, order: 6 },
};

export const threadList: ThreadDef[] = Object.values(threads).sort((a, b) => a.order - b.order);

export const DEFAULT_THREAD: ThreadCode = 'tonal';

/** Fixed. Shown as a fact, never chosen. */
export const THREAD_THICKNESS_MM = 0.5;

/** Colour to draw the stitch with. 'tonal' resolves to the leather colour. */
export function threadHex(code: ThreadCode, leatherColorHex: string): string {
  return threads[code].hex ?? leatherColorHex;
}
```

```ts
// content/elastic.ts
import type { ElasticColorCode } from '@/types/config';

export interface ElasticColorDef {
  code: ElasticColorCode;
  name: string;
  hex: string;
  order: number;
}

export const elasticColors: Record<ElasticColorCode, ElasticColorDef> = {
  black:    { code: 'black',    name: 'Black',    hex: '#1C1917', order: 1 },
  brown:    { code: 'brown',    name: 'Brown',    hex: '#5C3A21', order: 2 },
  olive:    { code: 'olive',    name: 'Olive',    hex: '#4A4B32', order: 3 },
  burgundy: { code: 'burgundy', name: 'Burgundy', hex: '#5A222B', order: 4 },
};

export const elasticColorList: ElasticColorDef[] = Object.values(elasticColors).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_ELASTIC_COLOR: ElasticColorCode = 'black';
```

```ts
// content/pricing.ts
import type { InsertType } from '@/types/config';

export const CURRENCY = 'PLN' as const;

/** All amounts in minor units (grosz). 4000 === 40.00 zł */
export const EMBOSSING_MINOR = 4000;
export const GIFT_BOX_MINOR = 3500;
/** Flat fee for having card slots at all. Count and notebook size do not change it. */
export const CARD_SLOTS_MINOR = 1000;
/** Flat fee for a pen loop, either loop size. */
export const PEN_HOLDER_MINOR = 2000;
/** Solid brass buckle instead of the elastic band. */
export const BUCKLE_MINOR = 13000;

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
export const MAX_EMBOSSING_LENGTH = 2;
/** Absolute upper bound for the URL parser. The per-size limit is sizes[size].cardSlotsMax. */
export const MAX_CARD_SLOTS = 4;
```

```ts
// content/closures.ts
import type { ClosureCode } from '@/types/config';
import { BUCKLE_MINOR } from './pricing';

export interface ClosureDef {
  code: ClosureCode;
  priceMinor: number;
  order: number;
}

export const closures: Record<ClosureCode, ClosureDef> = {
  elastic: { code: 'elastic', priceMinor: 0,            order: 1 },
  buckle:  { code: 'buckle',  priceMinor: BUCKLE_MINOR, order: 2 },
  none:    { code: 'none',    priceMinor: 0,            order: 3 },
};

export const closureList: ClosureDef[] = Object.values(closures).sort((a, b) => a.order - b.order);

export const DEFAULT_CLOSURE: ClosureCode = 'elastic';

/** Schematic colour of the solid-brass buckle. One finish only. */
export const BRASS_HEX = '#B08D57';
```

```ts
// content/pen-holders.ts
import type { PenHolderCode } from '@/types/config';

export interface PenHolderDef {
  code: PenHolderCode;
  /** Inner diameter of the loop, mm. DRAFT until the maker measures the real loops. */
  minMm: number;
  maxMm: number;
  order: number;
}

export const penHolders: Record<PenHolderCode, PenHolderDef> = {
  none: { code: 'none', minMm: 0,  maxMm: 0,  order: 1 },
  slim: { code: 'slim', minMm: 0,  maxMm: 10, order: 2 },
  wide: { code: 'wide', minMm: 10, maxMm: 13, order: 3 },
};

export const penHolderList: PenHolderDef[] = Object.values(penHolders).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_PEN_HOLDER: PenHolderCode = 'none';
```

### Steps
1. Записать пять файлов выше.
2. `git rm content/cords.ts`.

### Do NOT
- ❌ Не переименовывать `cords.ts` в `elastic.ts` через `git mv` с правками — проще удалить и создать.
- ❌ Не добавлять цену в `pen-holders.ts` или `closures.ts` числом. Только через константы `pricing.ts`.

### Acceptance
- [ ] `content/cords.ts` не существует
- [ ] `threads.tonal.hex === null`, `threadHex('tonal', '#123456') === '#123456'`
- [ ] `closures.buckle.priceMinor === 13000`
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "content/threads\|content/elastic\|content/closures\|content/pen-holders\|content/pricing"` — пусто

---

## T-123 — Данные: наличие и ракурсы

**Depends on:** T-122
**Estimate:** 0.5ч
**Files:** заменить `content/availability.ts`, `content/shots.ts`
**Требования:** L-5, K-3, §9

### Business
Всё в наличии — 27 пар кожа × цвет со статусом `in_stock`. Это единственный файл, который правится, когда мастер скажет реальные остатки. Ракурс `back` появляется в `angleSpecs`, но **не** в фото-матрице `angleList`: фотографировать заднюю обложку без резинки нечего, а резинка рисуется.

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
 * Today everything is in stock — until the maker confirms real quantities.
 */
export const stock: Record<StockKey, StockStatus> = {
  // smooth
  'smooth_natural': 'in_stock',
  'smooth_cognac': 'in_stock',
  'smooth_chestnut': 'in_stock',
  'smooth_olive': 'in_stock',
  'smooth_black': 'in_stock',
  'smooth_navy': 'in_stock',
  'smooth_burgundy': 'in_stock',
  'smooth_sand': 'in_stock',
  'smooth_graphite': 'in_stock',
  // croc
  'croc_natural': 'in_stock',
  'croc_cognac': 'in_stock',
  'croc_chestnut': 'in_stock',
  'croc_olive': 'in_stock',
  'croc_black': 'in_stock',
  'croc_navy': 'in_stock',
  'croc_burgundy': 'in_stock',
  'croc_sand': 'in_stock',
  'croc_graphite': 'in_stock',
  // suede
  'suede_natural': 'in_stock',
  'suede_cognac': 'in_stock',
  'suede_chestnut': 'in_stock',
  'suede_olive': 'in_stock',
  'suede_black': 'in_stock',
  'suede_navy': 'in_stock',
  'suede_burgundy': 'in_stock',
  'suede_sand': 'in_stock',
  'suede_graphite': 'in_stock',
};

export const productionDays: Record<Exclude<StockStatus, 'unavailable'>, number> = {
  in_stock: 5,
  made_to_order: 14,
};
```

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
  back: {
    angle: 'back',
    name: 'Back',
    ratio: '4 / 5',
    ratioValue: 0.8,
    mustShow: ['Elastic knot and two holes', 'Strap anchor when a buckle is chosen', 'Pen loop on the spine'],
    framing: 'Closed cover seen from the back, whole object in frame',
  },
  open: {
    angle: 'open',
    name: 'Open',
    ratio: '4 / 3',
    ratioValue: 1.3333,
    mustShow: ['How inserts attach', 'Inner side of the leather', 'Card slots when chosen'],
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

/** Photo-matrix angles. 'back' is schematic-only: the band and knot are drawn, nothing to photograph. */
export const angleList: AngleSpec[] = [
  angleSpecs.front,
  angleSpecs.open,
  angleSpecs.detail,
];

/** Tabs in the configurator preview. */
export const schematicAngleList: AngleSpec[] = [
  angleSpecs.front,
  angleSpecs.back,
  angleSpecs.open,
  angleSpecs.detail,
];

/** Rules that apply to every single product shot. Kept for the future shoot. Shown on /shotlist. */
export const globalShotRules: string[] = [
  'No elastic band, no embossing, no pen loop, no card slots and no buckle in frame — all are drawn by the site',
  'Identical angle, light, distance and background within one angle group',
  'One neutral background across the whole matrix',
  'At least 2400 px on the long side before compression',
  'No retouching of the leather texture',
  'Shoot one size only — size is shown on the site by a diagram, not by photography',
  'Deliver original files, not messenger-compressed images',
];

/** Text shown on every schematic so it cannot be misread as a finished photo */
export const SCHEMATIC_NOTE = 'SCHEMATIC DRAWING — not a photograph. Colours are approximate.';
```

### Do NOT
- ❌ Не добавлять `back` в `angleList`. Только в `schematicAngleList`.
- ❌ Не оставлять константу `NOT_IN_FRAME` — она заменена на `SCHEMATIC_NOTE`.

### Acceptance
- [ ] `Object.keys(stock).length === 27`
- [ ] `angleList.length === 3`, `schematicAngleList.length === 4`
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "content/availability\|content/shots"` — пусто

---

## T-124 — Фасад данных и форматирование

**Depends on:** T-123
**Estimate:** 0.5ч
**Files:** заменить `lib/data.ts`; изменить `lib/format.ts`; **удалить** `content/copy.ts`
**Требования:** X-3, X-9

### Business
`lib/data.ts` — единственная точка импорта данных для компонентов (так задумано в T-025). Новые компоненты этого эпика импортируют **только** из `@/lib/data`. `content/copy.ts` мёртв после i18n — удаляем. `fill()` подставляет `{max}`, `{count}` в строки словаря, чтобы ни одна фраза не собиралась в компоненте из кусков.

### Code

```ts
// lib/data.ts
// Single import point for all content data.
// Components import from here, never from content/* directly.

export { sizes, sizeList, DEFAULT_SIZE } from '@/content/sizes';
export type { SizeDef } from '@/content/sizes';

export { leathers, leatherList, DEFAULT_LEATHER } from '@/content/leathers';
export type { LeatherDef, HatchPattern } from '@/content/leathers';

export { colors, colorList, DEFAULT_COLOR } from '@/content/colors';
export type { ColorDef } from '@/content/colors';

export { threads, threadList, DEFAULT_THREAD, THREAD_THICKNESS_MM, threadHex } from '@/content/threads';
export type { ThreadDef } from '@/content/threads';

export { elasticColors, elasticColorList, DEFAULT_ELASTIC_COLOR } from '@/content/elastic';
export type { ElasticColorDef } from '@/content/elastic';

export { closures, closureList, DEFAULT_CLOSURE, BRASS_HEX } from '@/content/closures';
export type { ClosureDef } from '@/content/closures';

export { penHolders, penHolderList, DEFAULT_PEN_HOLDER } from '@/content/pen-holders';
export type { PenHolderDef } from '@/content/pen-holders';

export { stock, stockKey, productionDays } from '@/content/availability';

export {
  CURRENCY,
  EMBOSSING_MINOR,
  GIFT_BOX_MINOR,
  CARD_SLOTS_MINOR,
  PEN_HOLDER_MINOR,
  BUCKLE_MINOR,
  insertPriceMinor,
  insertNames,
  MAX_INSERTS_PER_TYPE,
  MAX_EMBOSSING_LENGTH,
  MAX_CARD_SLOTS,
} from '@/content/pricing';

export {
  angleSpecs,
  angleList,
  schematicAngleList,
  globalShotRules,
  SCHEMATIC_NOTE,
} from '@/content/shots';
export type { AngleSpec } from '@/content/shots';

export { sections } from '@/content/sections';
```

В `lib/format.ts` **добавить в конец** файла:

```ts
/**
 * Replaces {name} placeholders in a dictionary string.
 * fill('Up to {max} slots', { max: 3 }) -> 'Up to 3 slots'
 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}
```

### Steps
1. Заменить `lib/data.ts`.
2. Дописать `fill` в `lib/format.ts`.
3. `git rm content/copy.ts`.

### Acceptance
- [ ] `content/copy.ts` не существует
- [ ] `grep -rn "content/copy" app components lib content` — пусто
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "lib/data.ts\|lib/format.ts"` — пусто

---

## T-125 — Расчёт цены

**Depends on:** T-124
**Estimate:** 0.5ч
**Files:** заменить `lib/pricing.ts`
**Требования:** §8, C-4, P-2, K-1

### Code

```ts
// lib/pricing.ts
import type { Configuration } from '@/types/config';
import { sizes } from '@/content/sizes';
import { leathers } from '@/content/leathers';
import { threads } from '@/content/threads';
import { closures } from '@/content/closures';
import {
  EMBOSSING_MINOR,
  GIFT_BOX_MINOR,
  CARD_SLOTS_MINOR,
  PEN_HOLDER_MINOR,
  insertPriceMinor,
} from '@/content/pricing';

export interface PriceBreakdown {
  baseMinor: number;
  leatherMinor: number;
  threadMinor: number;
  closureMinor: number;
  penHolderMinor: number;
  cardSlotsMinor: number;
  embossingMinor: number;
  insertsMinor: number;
  giftBoxMinor: number;
  totalMinor: number;
}

export function hasEmbossing(config: Configuration): boolean {
  return !!config.embossing && config.embossing.text.trim().length > 0;
}

export function calculatePrice(config: Configuration): PriceBreakdown {
  const baseMinor = sizes[config.size].basePriceMinor;
  const leatherMinor = leathers[config.leather].priceDeltaMinor;
  const threadMinor = threads[config.thread].priceMinor;
  const closureMinor = closures[config.closure].priceMinor;
  const penHolderMinor = config.penHolder === 'none' ? 0 : PEN_HOLDER_MINOR;
  const cardSlotsMinor = config.cardSlots > 0 ? CARD_SLOTS_MINOR : 0;
  const embossingMinor = hasEmbossing(config) ? EMBOSSING_MINOR : 0;

  const insertsMinor = config.inserts.reduce(
    (sum, item) => sum + insertPriceMinor[item.type] * item.qty,
    0,
  );

  const giftBoxMinor = config.giftBox ? GIFT_BOX_MINOR : 0;

  return {
    baseMinor,
    leatherMinor,
    threadMinor,
    closureMinor,
    penHolderMinor,
    cardSlotsMinor,
    embossingMinor,
    insertsMinor,
    giftBoxMinor,
    totalMinor:
      baseMinor +
      leatherMinor +
      threadMinor +
      closureMinor +
      penHolderMinor +
      cardSlotsMinor +
      embossingMinor +
      insertsMinor +
      giftBoxMinor,
  };
}
```

### Acceptance
- [ ] Конфигурация по умолчанию (A5, smooth, tonal, elastic, без опций, 1 dot-вкладыш) → `totalMinor === 32500`
- [ ] Та же + `closure: 'buckle'` → `45500`; + `cardSlots: 3` → `46500`; + `penHolder: 'wide'` → `48500`
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "lib/pricing.ts"` — пусто

---

## T-126 — Zod-схема и санитайзер тиснения

**Depends on:** T-124
**Estimate:** 1ч
**Files:** заменить `lib/config-schema.ts`
**Требования:** E-2, E-3, X-1, C-1

### Business
Парсер никогда не бросает исключение и никогда не возвращает невалидную конфигурацию. Тиснение: только заглавные буквы латиницы и кириллицы, максимум две, строчные поднимаются автоматически. Лимит карманов по размеру здесь **не** проверяется — это делает `resolveConfiguration` (T-127), здесь только абсолютный потолок.

### Code

```ts
// lib/config-schema.ts
import { z } from 'zod';
import type { Configuration } from '@/types/config';
import { DEFAULT_SIZE } from '@/content/sizes';
import { DEFAULT_LEATHER } from '@/content/leathers';
import { DEFAULT_COLOR } from '@/content/colors';
import { DEFAULT_THREAD } from '@/content/threads';
import { DEFAULT_ELASTIC_COLOR } from '@/content/elastic';
import { DEFAULT_CLOSURE } from '@/content/closures';
import { DEFAULT_PEN_HOLDER } from '@/content/pen-holders';
import { MAX_EMBOSSING_LENGTH, MAX_INSERTS_PER_TYPE, MAX_CARD_SLOTS } from '@/content/pricing';

/**
 * One uppercase letter: Latin A–Z, Polish diacritics, Cyrillic А–Я plus Ё and the
 * Belarusian / Ukrainian letters Ў І Ї Є Ґ. Nothing else — no digits, no punctuation, no space.
 */
export const EMBOSSING_LETTER_RE = /^[A-ZĄĆĘŁŃÓŚŹŻА-ЯЁЎІЇЄҐ]$/;

/** Uppercases, drops every disallowed character, cuts to the max length. Used on every keystroke. */
export function sanitizeEmbossing(raw: string): string {
  return raw
    .toUpperCase()
    .split('')
    .filter((ch) => EMBOSSING_LETTER_RE.test(ch))
    .join('')
    .slice(0, MAX_EMBOSSING_LENGTH);
}

export const embossingSchema = z
  .object({
    text: z.string().max(MAX_EMBOSSING_LENGTH).catch(''),
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
  leather: z.enum(['smooth', 'croc', 'suede']).catch(DEFAULT_LEATHER),
  color: z
    .enum(['natural', 'cognac', 'chestnut', 'olive', 'black', 'navy', 'burgundy', 'sand', 'graphite'])
    .catch(DEFAULT_COLOR),
  thread: z.enum(['tonal', 'linen', 'cream', 'black', 'brown', 'navy']).catch(DEFAULT_THREAD),
  closure: z.enum(['elastic', 'buckle', 'none']).catch(DEFAULT_CLOSURE),
  elasticColor: z.enum(['black', 'brown', 'olive', 'burgundy']).catch(DEFAULT_ELASTIC_COLOR),
  penHolder: z.enum(['none', 'slim', 'wide']).catch(DEFAULT_PEN_HOLDER),
  cardSlots: z.number().int().min(0).max(MAX_CARD_SLOTS).catch(0),
  embossing: embossingSchema,
  inserts: z.array(insertSchema).max(3).catch([{ type: 'dot', qty: 1 }]),
  giftBox: z.boolean().catch(false),
});

export const DEFAULT_CONFIG: Configuration = {
  size: DEFAULT_SIZE,
  leather: DEFAULT_LEATHER,
  color: DEFAULT_COLOR,
  thread: DEFAULT_THREAD,
  closure: DEFAULT_CLOSURE,
  elasticColor: DEFAULT_ELASTIC_COLOR,
  penHolder: DEFAULT_PEN_HOLDER,
  cardSlots: 0,
  embossing: null,
  inserts: [{ type: 'dot', qty: 1 }],
  giftBox: false,
};

/**
 * Parses anything into a valid Configuration.
 * Also normalises embossing: after sanitising, an empty text becomes null.
 * NEVER throws.
 */
export function parseConfig(input: unknown): Configuration {
  const result = configSchema.safeParse(input);
  const parsed = result.success ? result.data : DEFAULT_CONFIG;

  let embossing = parsed.embossing;
  if (embossing) {
    const clean = sanitizeEmbossing(embossing.text);
    embossing = clean.length > 0 ? { ...embossing, text: clean } : null;
  }

  return { ...parsed, embossing } as Configuration;
}
```

### Do NOT
- ❌ Не оставлять `sanitizeEngraving` под старым именем. Одна функция — `sanitizeEmbossing`.
- ❌ Не добавлять цифры или `&` в регулярное выражение «на всякий случай».

### Acceptance
- [ ] `sanitizeEmbossing('ab') === 'AB'`, `sanitizeEmbossing('A1') === 'A'`, `sanitizeEmbossing('ёж') === 'ЁЖ'`, `sanitizeEmbossing('A B C') === 'AB'`, `sanitizeEmbossing('Łódź') === 'ŁÓ'`
- [ ] `parseConfig({ cardSlots: 9 }).cardSlots === 0` (потолок нарушен → catch → 0)
- [ ] `parseConfig({ leather: 'veg-tan' }).leather === 'smooth'`
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "lib/config-schema.ts"` — пусто

---

## T-127 — Совместимость и разрешение конфликтов

**Depends on:** T-126
**Estimate:** 1ч
**Files:** заменить `lib/availability.ts`
**Требования:** C-5, X-2, L-5

### Business
Четыре правила в одном месте, в этом порядке: размер побеждает кожу → цвет подставляется → вкладыши срезаются до вместимости размера → карманы срезаются до максимума размера. Каждое изменение — одна фраза в `changes`, из неё делается тост. Правила 3 и 4 новые; правило 3 закрывает дыру, когда ссылка `?size=a6&inserts=4:dot,4:plain` давала 8 вкладышей в A6.

### Code

```ts
// lib/availability.ts
import type {
  LeatherCode, ColorCode, SizeCode, StockStatus, Configuration, InsertSelection,
} from '@/types/config';
import { sizes } from '@/content/sizes';
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

/** Reduces insert quantities, last items first, until the total fits the capacity. */
function clampInserts(inserts: InsertSelection[], capacity: number): InsertSelection[] {
  let remaining = capacity;
  return inserts
    .map((item) => {
      const qty = Math.max(0, Math.min(item.qty, remaining));
      remaining -= qty;
      return { ...item, qty };
    })
    .filter((item) => item.qty > 0);
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
  let { leather, color, inserts, cardSlots } = input;
  const { size } = input;

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

  // Rule 3: paper inserts cannot exceed what the size holds.
  const capacity = sizes[size].insertCapacity;
  const totalInserts = inserts.reduce((sum, i) => sum + i.qty, 0);
  if (totalInserts > capacity) {
    inserts = clampInserts(inserts, capacity);
    changes.push(`Inserts reduced to ${capacity} — ${sizes[size].name} holds no more`);
  }

  // Rule 4: card slots cannot exceed what the size holds.
  const maxSlots = sizes[size].cardSlotsMax;
  if (cardSlots > maxSlots) {
    changes.push(`Card slots reduced to ${maxSlots} — ${sizes[size].name} holds no more`);
    cardSlots = maxSlots;
  }

  return { config: { ...input, leather, color, inserts, cardSlots }, changes };
}
```

### Acceptance
- [ ] `resolveConfiguration({ ...DEFAULT_CONFIG, size: 'a6', inserts: [{ type: 'dot', qty: 4 }, { type: 'plain', qty: 4 }] })` → `inserts` суммарно 2, одна запись в `changes`
- [ ] `resolveConfiguration({ ...DEFAULT_CONFIG, size: 'a6', cardSlots: 4 })` → `cardSlots === 2`, одна запись в `changes`
- [ ] Валидная конфигурация → `changes.length === 0`, объект не изменён
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "lib/availability.ts"` — пусто

---

## T-128 — Состояние в URL

**Depends on:** T-127
**Estimate:** 1ч
**Files:** заменить `lib/config-url.ts`
**Требования:** X-1

### Business
Параметры URL: `size leather color thread closure elastic pen cards emboss font pos inserts box`. Пишутся только отличия от умолчания, чтобы ссылка была короткой. `elastic` пишется только когда `closure=elastic`.

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

  const embossText = get('emboss');
  const cardsRaw = get('cards');

  const raw = {
    size: get('size') ?? undefined,
    leather: get('leather') ?? undefined,
    color: get('color') ?? undefined,
    thread: get('thread') ?? undefined,
    closure: get('closure') ?? undefined,
    elasticColor: get('elastic') ?? undefined,
    penHolder: get('pen') ?? undefined,
    cardSlots: cardsRaw ? Number.parseInt(cardsRaw, 10) : undefined,
    embossing: embossText
      ? {
          text: embossText,
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
  if (config.closure !== DEFAULT_CONFIG.closure) p.set('closure', config.closure);
  if (config.closure === 'elastic' && config.elasticColor !== DEFAULT_CONFIG.elasticColor) {
    p.set('elastic', config.elasticColor);
  }
  if (config.penHolder !== 'none') p.set('pen', config.penHolder);
  if (config.cardSlots > 0) p.set('cards', String(config.cardSlots));

  if (config.embossing && config.embossing.text.trim()) {
    p.set('emboss', config.embossing.text);
    p.set('font', config.embossing.font);
    p.set('pos', config.embossing.position);
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

### Acceptance
- [ ] `configFromSearchParams(new URLSearchParams('closure=buckle&pen=wide&cards=2&emboss=ab'))` → `closure:'buckle'`, `penHolder:'wide'`, `cardSlots:2`, `embossing.text:'AB'`
- [ ] `configFromSearchParams(new URLSearchParams('size=a6&cards=4'))` → `cardSlots:2`, одно предупреждение
- [ ] `configToSearchParams(DEFAULT_CONFIG).toString()` содержит только `size`, `leather`, `color`, `inserts`
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "lib/config-url.ts"` — пусто

---

## T-129 — Стор корзины

**Depends on:** T-128
**Estimate:** 0.5ч
**Files:** заменить `store/cart.ts`
**Требования:** X-4, X-5

### Business
Хеш позиции учитывает все новые оси. Ключ хранилища меняется на `nakedskin:cart`, версия persist — 2, старые корзины сбрасываются: в них лежат конфигурации с кожей, которой больше нет.

### Code

```ts
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
```

### Acceptance
- [ ] Две конфигурации, различающиеся только `cardSlots`, дают разные `id`
- [ ] `closure: 'buckle'` с `elasticColor: 'black'` и с `elasticColor: 'brown'` дают **одинаковый** `id`
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "store/cart.ts"` — пусто

---

## T-130 — Словарь: тип и английский

**Depends on:** T-129
**Estimate:** 2ч
**Files:** заменить `types/i18n.ts`, `content/i18n/dict/en.ts`
**Требования:** X-3, E-1, все тексты осей

### Business
Все новые строки — здесь. Ключи по осям типизированы кодами (`Record<ClosureCode, …>`), поэтому пропущенный перевод — ошибка компиляции, а не пустая строка на сайте. Плейсхолдеры `{max}`, `{count}`, `{name}`, `{mm}` подставляются через `fill()` — не разбивать фразы на куски в компонентах.

### Code

```ts
// types/i18n.ts
import type {
  Angle,
  ClosureCode,
  ColorCode,
  ElasticColorCode,
  EmbossingFont,
  EmbossingPosition,
  InsertType,
  LeatherCode,
  PenHolderCode,
  SizeCode,
  ThreadCode,
} from '@/types/config';

export type SupportedLocale = 'en' | 'pl' | 'de' | 'by' | 'uk';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flagId: string;
}

export interface LeatherCopy {
  description: string;
  character: string;
  origin: string;
  tanning: string;
  ageing: { m6: string; m12: string; m36: string };
}

export interface Dictionary {
  brand: {
    name: string;
    tagline: string;
    city: string;
  };
  nav: {
    materials: string;
    craft: string;
    faq: string;
    shotlist: string;
    build: string;
    cart: string;
    backToHome: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    trust: string;
  };
  reasons: {
    title: string;
    items: Array<{ title: string; body: string }>;
  };
  sizes: {
    title: string;
    subtitle: string;
    capacity: string;
    inserts: string;
    build: string;
    weight: string;
    cardSlots: string;
    upTo: string;
    useCases: Record<SizeCode, string>;
  };
  leather: {
    title: string;
    subtitle: string;
    origin: string;
    tanning: string;
    thickness: string;
    scratchResistance: string;
    patinaSpeed: string;
    softness: string;
    ageingTitle: string;
    m6: string;
    m12: string;
    m36: string;
    build: string;
    notDefect: { title: string; body: string };
    careTitle: string;
    careBody: string;
    schematicNote: string;
    descriptions: Record<LeatherCode, LeatherCopy>;
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; body: string }>;
    madeByHand: string;
  };
  included: {
    title: string;
    items: string[];
    compatibilityTitle: string;
    compatibility: string;
    timeTitle: string;
    timeBody: string;
    footerNote: string;
  };
  faq: {
    title: string;
    items: Array<{ q: string; a: string }>;
  };
  finalCta: {
    title: string;
    body: string;
    cta: string;
  };
  configurator: {
    title: string;
    steps: {
      size: string;
      leather: string;
      color: string;
      thread: string;
      closure: string;
      penHolder: string;
      cardSlots: string;
      embossing: string;
      inserts: string;
      giftBox: string;
    };
    /** Uses {mm} */
    threadThickness: string;
    embossingPlaceholder: string;
    /** Uses {max} */
    embossingHint: string;
    embossingNote: string;
    embossingPositionLabel: string;
    embossingFontLabel: string;
    embossingPositions: Record<EmbossingPosition, string>;
    embossingFonts: Record<EmbossingFont, string>;
    embossingConfirmTitle: string;
    embossingConfirmBody: string;
    embossingConfirmEdit: string;
    embossingConfirmOk: string;
    closures: Record<ClosureCode, { title: string; note: string }>;
    elasticColor: string;
    penHolders: Record<PenHolderCode, { title: string; meta: string }>;
    penHolderHelp: string;
    penHolderGuideLabel: string;
    /** Uses {max} and {count} */
    cardSlotsHint: string;
    cardSlotsMeta: string;
    cardSlotsInside: string;
    /** Uses {max} and {count} */
    insertsHint: string;
    /** Uses {name} */
    addOne: string;
    /** Uses {name} */
    removeOne: string;
    giftBoxLabel: string;
    addToCart: string;
    readyIn: string;
    workingDays: string;
    madeToOrder: string;
    inStock: string;
    conflictBanner: string;
    restorePrompt: string;
    restoreAction: string;
    notifyTitle: string;
    notifySubtitle: string;
    notifySuccess: string;
    notifyPlaceholder: string;
    notifySubmit: string;
  };
  cart: {
    title: string;
    empty: string;
    emptySubtitle: string;
    buildFirst: string;
    size: string;
    leather: string;
    color: string;
    thread: string;
    closure: string;
    penHolder: string;
    cardSlots: string;
    embossing: string;
    inserts: string;
    giftBox: string;
    elasticNote: string;
    qty: string;
    remove: string;
    edit: string;
    total: string;
    reserve: string;
    reserveTitle: string;
    reserveBody: string;
    reserveEmailPlaceholder: string;
    reserveSubmit: string;
    reserveSuccess: string;
    reserveSuccessBody: string;
    reserveError: string;
  };
  shotlist: {
    title: string;
    subtitle: string;
    postponedNote: string;
    totalLabel: string;
    generated: string;
    productShots: string;
    storyShots: string;
    rulesTitle: string;
    hatchLegendTitle: string;
    print: string;
    exportMd: string;
    exportCsv: string;
    mustShow: string;
    shotsCount: string;
    viewLabel: string;
  };
  footer: {
    line: string;
    rights: string;
  };
  notFound: {
    title: string;
    body: string;
    back: string;
  };
  colors: Record<ColorCode, string>;
  threads: Record<ThreadCode, string>;
  elasticColors: Record<ElasticColorCode, string>;
  insertTypes: Record<InsertType, string>;
  leatherNames: Record<LeatherCode, string>;
  angles: Record<Angle, string>;
}
```

```ts
// content/i18n/dict/en.ts
import type { Dictionary } from '@/types/i18n';

export const en: Dictionary = {
  brand: {
    name: 'Naked Skin',
    tagline: 'Handmade refillable leather notebooks',
    city: 'Kraków',
  },
  nav: {
    materials: 'Materials',
    craft: 'Craft',
    faq: 'FAQ',
    shotlist: 'Shot list',
    build: 'Build yours',
    cart: 'Cart',
    backToHome: '← Back to home',
  },
  hero: {
    title: 'A notebook that outlives its pages',
    subtitle:
      'Full-grain leather cover, hand-stitched in Kraków. Replace the paper when full. Keep the leather for decades.',
    cta: 'Build yours',
    ctaSecondary: 'Read about the leather',
    trust: 'Handmade in Kraków · Full-grain leather · Free EU shipping',
  },
  reasons: {
    title: 'Why one cover for life makes sense',
    items: [
      {
        title: 'Saddle-stitched by hand',
        body: 'Two needles, one thread, pulled through each hole from opposite sides. If one stitch ever breaks, the rest hold.',
      },
      {
        title: 'Standard refillable inserts',
        body: 'Holds two to four inserts on an elastic. When an insert is full, slide it out and put a new one in. Never buy a whole notebook again.',
      },
      {
        title: 'Full-grain leather only',
        body: 'The strongest, outermost layer of the hide. Not sanded, not corrected, not plastic-coated. It absorbs oils from your hands and darkens with age.',
      },
    ],
  },
  sizes: {
    title: 'Four sizes. Choose by how you carry it.',
    subtitle:
      'Every size uses the same full-grain leather, hand saddle-stitching with 0.5 mm thread and a replaceable elastic system.',
    capacity: 'Holds',
    inserts: 'inserts',
    build: 'Build this size →',
    weight: 'Weight',
    cardSlots: 'Card slots',
    upTo: 'up to',
    useCases: {
      a6: 'Lists and quick notes on the move. Fits any jacket or back pocket.',
      b6: 'Everyday carry — the middle ground between pocket and desk.',
      standard: 'The classic travel-notebook format. Narrow, tall, ideal for daily planning and lists.',
      a5: 'The workspace size. Takes standard A5 inserts for long-form writing and sketching.',
    },
  },
  leather: {
    title: 'Three leathers. Smooth, croc-embossed, suede.',
    subtitle:
      'All three are full-grain cowhide from European tanneries. Every hide has its own grain and slight variations in shade. No exotic skins are used.',
    origin: 'Origin',
    tanning: 'Tanning',
    thickness: 'Thickness',
    scratchResistance: 'Scratch resistance',
    patinaSpeed: 'Patina speed',
    softness: 'Softness',
    ageingTitle: 'How this leather ages',
    m6: 'At 6 months',
    m12: 'At 12 months',
    m36: 'At 3 years',
    build: 'Build with this leather →',
    notDefect: {
      title: 'This is not a defect',
      body: 'Smooth leather keeps small healed scars and fat wrinkles — the hide’s history. Croc-embossed leather shows slight differences in the scale pattern between pieces. Suede shows the direction of the nap and fingerprints that brush away. None of this is sanded down or painted over.',
    },
    careTitle: 'Care instructions',
    careBody:
      'Smooth and croc-embossed: condition once or twice a year with a beeswax balm, keep away from direct heat. Suede: brush with a soft suede brush, keep dry, never apply balm or oil — it flattens the nap.',
    schematicNote: 'Schematic hatch, not a photograph of the actual grain.',
    descriptions: {
      smooth: {
        description:
          'A clean, even surface with a fine natural grain. The most classic of the three: it takes embossing crisply and darkens evenly with use.',
        character: 'Even, closed grain. Ages evenly.',
        origin: 'European tannery',
        tanning: 'Vegetable-tanned',
        ageing: {
          m6: 'Slightly darker where hands touch it most.',
          m12: 'Even, warmer tone, soft sheen on the edges.',
          m36: 'Deep, uniform patina; holds its shape.',
        },
      },
      croc: {
        description:
          'Full-grain cowhide pressed with a crocodile-scale plate. The relief hides small scratches and gives the cover a formal, structured look. No exotic skins are used.',
        character: 'Crocodile-pattern relief pressed into cowhide.',
        origin: 'European tannery',
        tanning: 'Vegetable-tanned, plate-embossed',
        ageing: {
          m6: 'Scale tops polish slightly from handling.',
          m12: 'Contrast between raised and recessed areas grows.',
          m36: 'Glossy ridges, matte valleys — a deep two-tone relief.',
        },
      },
      suede: {
        description:
          'The flesh side of the hide, buffed to a fine velvet nap. The softest and warmest of the three. It marks easily and that is its character — brush it and the nap recovers.',
        character: 'Soft, velvety nap. Warm to the touch.',
        origin: 'European tannery',
        tanning: 'Chrome-free split',
        ageing: {
          m6: 'Nap flattens where fingers rest.',
          m12: 'Colour deepens, surface becomes smoother.',
          m36: 'Worn-in, slightly glossy in high-touch areas.',
        },
      },
    },
  },
  process: {
    title: 'How your cover is made',
    subtitle: 'One maker. One bench. Four hours per cover.',
    steps: [
      { title: 'Cutting', body: 'The hide is read for scars and stretch, then cut by hand around them.' },
      { title: 'Skiving', body: 'Edges are thinned so folds sit flat instead of bulking up.' },
      { title: 'Pricking', body: 'Holes are marked and punched by hand with a diamond pricking iron.' },
      { title: 'Saddle stitch', body: 'Two needles, one waxed thread, pulled through each hole from opposite sides.' },
      { title: 'Edge finishing', body: 'Edges are sanded, dyed and burnished until they are smooth.' },
      { title: 'Finish', body: 'A light coat of balm, hardware set, final inspection.' },
    ],
    madeByHand: 'Made by hand in Kraków, Poland',
  },
  included: {
    title: 'What arrives in the box',
    items: [
      'The leather cover, hand-stitched and finished',
      'Paper inserts of your choice',
      'The closure you configured: elastic band in your colour, brass buckle, or none',
      'A care card',
      'A plain box, no plastic',
    ],
    compatibilityTitle: 'Compatibility',
    compatibility:
      'The cover also fits standard inserts from Moleskine Cahier, Leuchtturm1917 and Traveler’s Notebook, in the matching size.',
    timeTitle: 'Production time',
    timeBody:
      'Every cover is cut and stitched after you order it. In-stock leather ships in about 5 working days. Made-to-order leather takes up to 14.',
    footerNote: 'Hand-cut, hand-stitched, finished to order.',
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Why does this cost more than a notebook from a shop?',
        a: 'Because you are not buying paper. You are buying the cover, and it is made by one person in about four hours from a hide that costs more per square metre than most finished notebooks. The paper inside costs a few złoty and is meant to be replaced.',
      },
      {
        q: 'Will the leather smell?',
        a: 'Yes, of leather, strongly at first. It settles over a few weeks.',
      },
      {
        q: 'Will it scratch?',
        a: 'Yes. Croc-embossed leather hides scratches best in its relief. Smooth leather keeps them, which is the point: the surface becomes a record of use. Suede marks easily and brushes back.',
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
        q: 'What is embossing?',
        a: 'Up to two letters pressed into the leather itself with a heated brass die. It is not a plate and not a sticker: it does not wear off and cannot be removed.',
      },
      {
        q: 'Can I remove the elastic band later?',
        a: 'No. The band passes through two holes in the back cover and is knotted on the outside. Without the band the holes remain. If you would rather have no holes, choose the brass buckle or no closure when you build it.',
      },
      {
        q: 'How long does delivery take within the EU?',
        a: 'Production first: 5 working days for in-stock leather, up to 14 for made-to-order. Shipping then takes 2–5 working days depending on the country.',
      },
      {
        q: 'Can I return it?',
        a: 'Return terms are being finalised before the first batch opens. Embossed covers are made for one person and cannot be resold, so they are treated differently from plain ones. Exact terms will be published before any order is taken.',
      },
      {
        q: 'Where does the leather come from?',
        a: 'All three leathers come from European tanneries that work with the food industry’s by-product. The exact tannery is printed on the care card that ships with your cover.',
      },
      {
        q: 'Is this a good gift?',
        a: 'It is the most common reason people buy it. Add embossing, add the gift box, and it arrives ready to hand over.',
      },
    ],
  },
  finalCta: {
    title: 'Build the one you would actually use',
    body: 'Size, leather, colour, thread, closure, embossing. Two minutes.',
    cta: 'Build yours',
  },
  configurator: {
    title: 'Build your notebook',
    steps: {
      size: 'Size',
      leather: 'Leather',
      color: 'Colour',
      thread: 'Thread',
      closure: 'Closure',
      penHolder: 'Pen loop',
      cardSlots: 'Card slots',
      embossing: 'Embossing',
      inserts: 'Inserts',
      giftBox: 'Gift box',
    },
    threadThickness: 'Thread is {mm} mm, saddle-stitched. Only the colour is yours to choose.',
    embossingPlaceholder: 'AB',
    embossingHint: 'Up to {max} letters, Latin or Cyrillic, capitals only.',
    embossingNote: 'Pressed into the leather itself — not a plate, not a sticker. It does not wear off and cannot be removed.',
    embossingPositionLabel: 'Position',
    embossingFontLabel: 'Style',
    embossingPositions: {
      'bottom-right': 'Bottom right',
      spine: 'Spine',
    },
    embossingFonts: {
      serif: 'Serif',
      sans: 'Sans',
    },
    embossingConfirmTitle: 'Check your embossing',
    embossingConfirmBody:
      'Embossed covers cannot be returned or exchanged. Please check the letters once more:',
    embossingConfirmEdit: 'Edit letters',
    embossingConfirmOk: 'Yes, it is correct',
    closures: {
      elastic: {
        title: 'Elastic band',
        note: 'The band passes through two holes in the back cover and is knotted on the outside. The knot is visible on the finished cover. It cannot be removed later — the holes would remain.',
      },
      buckle: {
        title: 'Brass buckle',
        note: 'Solid brass buckle, one finish. The strap is cut from the same leather in the same colour and wraps around the cover like a belt.',
      },
      none: {
        title: 'No closure',
        note: 'No hardware and no holes. The cover closes under its own weight.',
      },
    },
    elasticColor: 'Band colour',
    penHolders: {
      none: { title: 'No pen loop', meta: '' },
      slim: { title: 'Slim pen', meta: 'Ø up to 10 mm' },
      wide: { title: 'Wide pen', meta: 'Ø 10–13 mm' },
    },
    penHolderHelp:
      'Ballpoint, gel pen or a thin pencil — slim. Metal body, fountain pen or thick marker — wide. Not sure? Measure the widest part of the barrel and compare with the circles.',
    penHolderGuideLabel: 'Loop inner diameter, roughly actual size on a desktop screen.',
    cardSlotsHint: 'Up to {max} card slots in this size. {count} selected.',
    cardSlotsMeta: 'Fits standard 85.6 × 54 mm cards. One price for any number of slots.',
    cardSlotsInside: 'Inside the front cover',
    insertsHint: 'Up to {max} inserts in this size. {count} selected.',
    addOne: 'Add one {name}',
    removeOne: 'Remove one {name}',
    giftBoxLabel: 'Add a gift box and card',
    addToCart: 'Add to cart',
    readyIn: 'Ready in',
    workingDays: 'working days',
    madeToOrder: 'Made to order',
    inStock: 'In stock',
    conflictBanner: 'Your previous selection was adjusted to match availability.',
    restorePrompt: 'You have a saved configuration from a previous visit.',
    restoreAction: 'Restore',
    notifyTitle: 'Out of stock in this colour',
    notifySubtitle: 'Leave your email and we will notify you when this leather is back in the workshop.',
    notifySuccess: 'Thank you. We will let you know as soon as this colour is back in stock.',
    notifyPlaceholder: 'your@email.com',
    notifySubmit: 'Notify me',
  },
  cart: {
    title: 'Cart',
    empty: 'Your cart is empty',
    emptySubtitle: 'Start by choosing a size and leather in the configurator.',
    buildFirst: 'Build a notebook',
    size: 'Size',
    leather: 'Leather',
    color: 'Colour',
    thread: 'Thread',
    closure: 'Closure',
    penHolder: 'Pen loop',
    cardSlots: 'Card slots',
    embossing: 'Embossing',
    inserts: 'Inserts',
    giftBox: 'Gift box included',
    elasticNote: 'Elastic band: two holes in the back cover, knot on the outside. Not removable later.',
    qty: 'Qty',
    remove: 'Remove',
    edit: 'Edit',
    total: 'Total',
    reserve: 'Reserve from next batch',
    reserveTitle: 'Reserve your notebook',
    reserveBody:
      'We make every cover in batches. Enter your email to reserve your build from the next workshop run. No advance payment required.',
    reserveEmailPlaceholder: 'your@email.com',
    reserveSubmit: 'Confirm reservation',
    reserveSuccess: 'Reservation confirmed!',
    reserveSuccessBody: 'We have logged your order and will email you as soon as your batch is scheduled on the bench.',
    reserveError: 'Something went wrong. Please try again.',
  },
  shotlist: {
    title: 'Workshop shot list',
    subtitle: 'Exact product and landing frames required for the catalog.',
    postponedNote: 'Photography is postponed. The site runs on schematic drawings; this list is kept for the future shoot.',
    totalLabel: 'shots total',
    generated: 'Generated',
    productShots: 'Product matrix',
    storyShots: 'Story shots',
    rulesTitle: 'Global Rules for Every Product Shot',
    hatchLegendTitle: 'Leather Hatch Legend (Schematic Representation)',
    print: 'Print A4',
    exportMd: 'Export Markdown',
    exportCsv: 'Export CSV',
    mustShow: 'Must show',
    shotsCount: 'shots',
    viewLabel: 'View',
  },
  footer: {
    line: 'Handmade refillable leather notebook covers. Kraków, Poland.',
    rights: 'All rights reserved.',
  },
  notFound: {
    title: 'This page does not exist',
    body: 'It may have moved, or the link may be wrong.',
    back: 'Back to the start',
  },
  colors: {
    natural: 'Natural',
    cognac: 'Cognac',
    chestnut: 'Chestnut',
    olive: 'Olive',
    black: 'Black',
    navy: 'Navy',
    burgundy: 'Burgundy',
    sand: 'Sand',
    graphite: 'Graphite',
  },
  threads: {
    tonal: 'Match the leather',
    linen: 'Natural linen',
    cream: 'Cream',
    black: 'Black',
    brown: 'Brown',
    navy: 'Navy',
  },
  elasticColors: {
    black: 'Black',
    brown: 'Brown',
    olive: 'Olive',
    burgundy: 'Burgundy',
  },
  insertTypes: {
    plain: 'Plain',
    ruled: 'Ruled',
    dot: 'Dot grid',
  },
  leatherNames: {
    smooth: 'Smooth leather',
    croc: 'Croc-embossed',
    suede: 'Suede',
  },
  angles: {
    front: 'Front',
    back: 'Back',
    open: 'Open',
    detail: 'Detail',
  },
};
```

### Do NOT
- ❌ Не оставлять ключи `cords`, `engraving*`, `capacityLimit`, `conflictResolved`, `details`, `cord` — их нет в типе, `tsc` упадёт на лишнем свойстве.
- ❌ Не менять плейсхолдеры `{max}`, `{count}`, `{name}`, `{mm}`.

### Acceptance
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "types/i18n.ts\|dict/en.ts"` — пусто
- [ ] В `en.ts` нет слов `engraving`, `Engraving`, `cord`, `veg-tan`, `crazy-horse`, `pull-up`

---

## T-131 — Словари: польский, немецкий, белорусский, украинский

**Depends on:** T-130
**Estimate:** 3ч
**Files:** заменить `content/i18n/dict/pl.ts`, `de.ts`, `by.ts`, `uk.ts`
**Требования:** X-3

### Business
Четыре словаря приводятся к точной форме `en.ts`. Компилятор не пропустит ни лишний, ни отсутствующий ключ.

### Steps
1. Открыть `en.ts` из T-130 рядом с переводимым файлом.
2. Пройти сверху вниз. Для каждого ключа: если он есть в старом файле и текст не менялся в `en.ts` — оставить перевод; если ключ новый или английский текст изменился — перевести заново.
3. Особые места, где старые файлы **точно** расходятся с типом:
   - `sizes.useCases` — ключи должны быть `a6`, `b6`, `standard`, `a5` (в старых файлах `pocket`, `passport`, `regular`, `a5`).
   - `leather.descriptions` — ключи `smooth`, `croc`, `suede`; старые `veg-tan`, `crazy-horse`, `pull-up` удалить.
   - `configurator.steps` — новый состав, см. тип.
   - Удалить `configurator.cord`, все `configurator.engraving*`, `capacityLimit`, `conflictResolved`, `cart.cord`, `cart.engraving`, `cords`.
   - Добавить `sizes.cardSlots`, `sizes.upTo`, все `configurator.embossing*`, `closures`, `elasticColor`, `penHolders`, `penHolderHelp`, `penHolderGuideLabel`, `cardSlots*`, `insertsHint`, `addOne`, `removeOne`, `cart.closure/penHolder/cardSlots/embossing/elasticNote/reserveError`, `shotlist.postponedNote`, `elasticColors`, `insertTypes`, новые `colors`, `threads`, `leatherNames`, `angles.back`.
   - FAQ: 11 вопросов, в том же порядке, что в `en.ts`.
4. Плейсхолдеры `{max}`, `{count}`, `{name}`, `{mm}` оставить как есть, в том же месте фразы, где это естественно для языка.
5. Терминология: тиснение — pl *tłoczenie*, de *Prägung*, by *цісненне*, uk *тиснення*. Резинка — pl *gumka*, de *Gummiband*, by *гумка*, uk *гумка*. Пряжка — pl *klamra*, de *Schnalle*, by *спражка*, uk *пряжка*. Держатель ручки — pl *uchwyt na długopis*, de *Stiftschlaufe*, by *трымальнік для ручкі*, uk *тримач для ручки*. Карманы для карт — pl *kieszonki na karty*, de *Kartenfächer*, by *кішэні для картак*, uk *кишені для карток*.

### Do NOT
- ❌ Не переводить коды (`smooth`, `tonal`, `spine`) — только значения.
- ❌ Не оставлять английские значения «временно». Лучше короткий перевод, чем английский.

### Acceptance
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "content/i18n"` — пусто
- [ ] `grep -c "{max}" content/i18n/dict/*.ts` → в каждом файле 3 (embossingHint, cardSlotsHint, insertsHint)
- [ ] `grep -n "veg-tan\|crazy-horse\|pull-up\|engraving\|cords" content/i18n/dict/*.ts` — пусто

---

## Волна B — компоненты (параллельно)

> Каждая задача волны B трогает только свои файлы и зависит только от волны A. Разные агенты могут делать их одновременно. Импорты данных — **только** из `@/lib/data`.

---

## T-132 — Штриховки и чертёж обложки: четыре ракурса

**Depends on:** T-131
**Estimate:** 4ч
**Files:** заменить `components/schematic/HatchDefs.tsx`, `components/schematic/SchematicCover.tsx`
**Требования:** L-4, T-5, E-6, C-6, P-5, K-3, K-6, K-7, §9

### Business
Главная графика эпика. Всё, что пользователь выбрал, видно на чертеже: тип кожи — штриховкой, цвет — заливкой и чипом, нить — цветом пунктира, резинка — полосой спереди и узелком сзади, пряжка — ремешком и латунной рамкой, держатель — ручкой в петле на корешке, карманы — колонкой на внутренней створке, тиснение — буквами. Ракурс `back` новый: без него узелок резинки — главную «неожиданность» изделия — показать негде.

Координаты фиксированы и не зависят от размера блокнота: масштаб показывает `SizeDiagram`, не чертёж.

### Code

```tsx
// components/schematic/HatchDefs.tsx
import type { HatchPattern } from '@/lib/data';

const INK = '#1C1917';

export const hatchId: Record<HatchPattern, string> = {
  'diagonal-fine': 'hatch-fine',
  'croc-scale': 'hatch-croc',
  stipple: 'hatch-stipple',
};

export function hatchUrl(pattern: HatchPattern): string {
  return `url(#${hatchId[pattern]})`;
}

/**
 * Three leather textures as SVG patterns.
 * fine   — smooth leather: thin even diagonal lines
 * croc   — croc-embossed: brick-offset rounded plates, reads as scales
 * stipple— suede: dots of two sizes, reads as nap
 */
export default function HatchDefs({ scale = 1 }: { scale?: number }) {
  const s = scale;
  return (
    <defs>
      <pattern
        id="hatch-fine"
        width={4 * s}
        height={4 * s}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2={4 * s} stroke={INK} strokeWidth={0.5 * s} opacity="0.35" />
      </pattern>

      <pattern id="hatch-croc" width={16 * s} height={12 * s} patternUnits="userSpaceOnUse">
        <rect x={1 * s} y={1 * s} width={14 * s} height={4.5 * s} rx={2 * s}
              fill="none" stroke={INK} strokeWidth={0.8 * s} opacity="0.45" />
        <rect x={-7 * s} y={7 * s} width={14 * s} height={4.5 * s} rx={2 * s}
              fill="none" stroke={INK} strokeWidth={0.8 * s} opacity="0.45" />
        <rect x={9 * s} y={7 * s} width={14 * s} height={4.5 * s} rx={2 * s}
              fill="none" stroke={INK} strokeWidth={0.8 * s} opacity="0.45" />
      </pattern>

      <pattern id="hatch-stipple" width={6 * s} height={6 * s} patternUnits="userSpaceOnUse">
        <circle cx={1.5 * s} cy={1.5 * s} r={0.55 * s} fill={INK} opacity="0.4" />
        <circle cx={4.5 * s} cy={4.5 * s} r={0.55 * s} fill={INK} opacity="0.4" />
        <circle cx={4.5 * s} cy={1.5 * s} r={0.35 * s} fill={INK} opacity="0.25" />
        <circle cx={1.5 * s} cy={4.5 * s} r={0.35 * s} fill={INK} opacity="0.25" />
      </pattern>
    </defs>
  );
}
```

```tsx
// components/schematic/SchematicCover.tsx
import type { Configuration, Angle } from '@/types/config';
import {
  leathers,
  colors,
  threadHex,
  elasticColors,
  angleSpecs,
  SCHEMATIC_NOTE,
  BRASS_HEX,
} from '@/lib/data';
import { previewFilename } from '@/lib/assets';
import HatchDefs, { hatchUrl } from './HatchDefs';

interface Props {
  config: Configuration;
  angle: Angle;
  /** Small thumbnail: hide callouts, labels and file name */
  compact?: boolean;
}

const INK = '#1C1917';
const LINE = '#DED5C7';
const ALERT = '#A63D2F';
const MUTED = '#8A7F72';
const PAPER = '#FAF7F2';

/** Pen radius in drawing units. The wide loop must be visibly bigger than the slim one. */
const PEN_RADIUS = { slim: 7, wide: 9 } as const;

/** Card slot geometry in the 'open' view: card 85.6 × 54 mm drawn as 100 × 63, stacked with a 16 step. */
const SLOT_W = 100;
const SLOT_H = 63;
const SLOT_STEP = 16;
const SLOT_X = 80;
const SLOT_BOTTOM = 220;

export default function SchematicCover({ config, angle, compact = false }: Props) {
  const leather = leathers[config.leather];
  const color = colors[config.color];
  const spec = angleSpecs[angle];
  const hatch = hatchUrl(leather.schematicHatch);
  const fill = color.hex;
  const stitch = threadHex(config.thread, color.hex);
  const elastic = elasticColors[config.elasticColor].hex;
  const hasElastic = config.closure === 'elastic';
  const hasBuckle = config.closure === 'buckle';
  const hasPen = config.penHolder !== 'none';
  const penR = config.penHolder === 'wide' ? PEN_RADIUS.wide : PEN_RADIUS.slim;
  const penLabel = config.penHolder === 'wide' ? 'pen loop Ø 10–13 mm' : 'pen loop Ø up to 10 mm';
  const embossFont =
    config.embossing?.font === 'sans' ? 'Inter, system-ui, sans-serif' : 'Georgia, serif';
  const insertCount = Math.min(
    4,
    Math.max(1, config.inserts.reduce((sum, i) => sum + i.qty, 0)),
  );

  const labels = !compact && (
    <>
      <rect x="20" y="20" width="14" height="14" fill={fill} stroke={INK} strokeWidth="0.8" />
      <text x="42" y="31" fontSize="11" fill={INK}>{color.name}</text>
      <text x="20" y="50" fontSize="10" fill={MUTED}>{leather.name}</text>
    </>
  );

  /** A pen sitting in its loop on a spine strip centred at x = cx (front and back views). */
  const penLoop = (cx: number) => (
    <g>
      <rect x={cx - penR} y="196" width={penR * 2} height="108" rx={penR}
            fill={PAPER} stroke={INK} strokeWidth="1.2" />
      <rect x={cx - penR - 4} y="238" width={penR * 2 + 8} height="20" rx="3"
            fill={fill} stroke={INK} strokeWidth="1.2" />
      <rect x={cx - penR - 4} y="238" width={penR * 2 + 8} height="20" rx="3" fill={hatch} />
    </g>
  );

  /** Callout lines under the drawing in the 400×500 views. Max three lines. */
  const notes = (lines: string[]) =>
    !compact && (
      <>
        {lines.slice(0, 3).map((line, i) => (
          <text key={line} x="20" y={416 + i * 13} fontSize="9.5" fill={MUTED}>
            → {line}
          </text>
        ))}
        <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
      </>
    );

  const frontNotes: string[] = [];
  if (hasElastic) frontNotes.push('elastic band runs around the cover; knot is on the back');
  if (hasBuckle) frontNotes.push('solid brass buckle, strap in the cover leather');
  if (hasPen) frontNotes.push(penLabel);
  if (frontNotes.length === 0) frontNotes.push(...spec.mustShow.slice(0, 3));

  const backNotes: string[] = [];
  if (hasElastic) {
    backNotes.push('elastic knot on the outside — visible on the finished cover');
    backNotes.push('two holes stay even if the band is ever removed');
  }
  if (hasBuckle) backNotes.push('strap anchored here, wraps around the fore-edge');
  if (hasPen) backNotes.push(penLabel);
  if (backNotes.length === 0) backNotes.push('no closure — no holes, no hardware');

  return (
    <div className="w-full">
      {angle === 'front' && (
        <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
             aria-label={`Technical drawing: ${leather.name} cover in ${color.name}, front view`}>
          <HatchDefs />
          <rect x="8" y="8" width="384" height="484" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          {/* cover */}
          <rect x="102" y="110" width="196" height="280" rx="6" fill={fill}
                stroke={INK} strokeWidth="1.5" />
          <rect x="102" y="110" width="196" height="280" rx="6" fill={hatch} />
          {/* spine fold */}
          <line x1="128" y1="110" x2="128" y2="390" stroke={INK} strokeWidth="0.8"
                strokeDasharray="4 4" opacity="0.5" />
          {/* stitch line */}
          <rect x="114" y="122" width="172" height="256" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.4" strokeDasharray="4 4" />

          {/* elastic band across the front */}
          {hasElastic && (
            <line x1="213" y1="110" x2="213" y2="390" stroke={elastic} strokeWidth="4"
                  strokeLinecap="round" />
          )}

          {/* buckle: strap comes around the fore-edge (right) and ends in a brass frame */}
          {hasBuckle && (
            <g>
              <rect x="150" y="238" width="148" height="24" rx="3" fill={fill}
                    stroke={INK} strokeWidth="1.2" />
              <rect x="150" y="238" width="148" height="24" rx="3" fill={hatch} />
              <line x1="172" y1="244" x2="292" y2="244" stroke={stitch} strokeWidth="1"
                    strokeDasharray="3 3" />
              <line x1="172" y1="256" x2="292" y2="256" stroke={stitch} strokeWidth="1"
                    strokeDasharray="3 3" />
              <rect x="144" y="230" width="26" height="40" rx="4" fill="none"
                    stroke={BRASS_HEX} strokeWidth="3.5" />
              <line x1="157" y1="230" x2="157" y2="270" stroke={BRASS_HEX} strokeWidth="2.5"
                    strokeLinecap="round" />
            </g>
          )}

          {/* pen loop on the spine strip */}
          {hasPen && penLoop(115)}

          {/* embossing */}
          {config.embossing && config.embossing.position === 'bottom-right' && (
            <g>
              <rect x="214" y="322" width="60" height="42" fill="none" stroke={MUTED}
                    strokeWidth="1" strokeDasharray="2 2" />
              <text x="244" y="352" textAnchor="middle" fontSize="22" letterSpacing="2"
                    fill={INK} opacity="0.75" fontFamily={embossFont}>
                {config.embossing.text}
              </text>
            </g>
          )}
          {config.embossing && config.embossing.position === 'spine' && (
            <text x="115" y="340" transform="rotate(-90 115 340)" textAnchor="middle"
                  fontSize="14" letterSpacing="2" fill={INK} opacity="0.75" fontFamily={embossFont}>
              {config.embossing.text}
            </text>
          )}

          {labels}
          {notes(frontNotes)}
        </svg>
      )}

      {angle === 'back' && (
        <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
             aria-label={`Technical drawing: ${leather.name} cover in ${color.name}, back view`}>
          <HatchDefs />
          <rect x="8" y="8" width="384" height="484" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          {/* cover — mirrored: spine on the right */}
          <rect x="102" y="110" width="196" height="280" rx="6" fill={fill}
                stroke={INK} strokeWidth="1.5" />
          <rect x="102" y="110" width="196" height="280" rx="6" fill={hatch} />
          <line x1="272" y1="110" x2="272" y2="390" stroke={INK} strokeWidth="0.8"
                strokeDasharray="4 4" opacity="0.5" />
          <rect x="114" y="122" width="172" height="256" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.4" strokeDasharray="4 4" />

          {/* elastic: two holes, the band, the knot with two tails */}
          {hasElastic && (
            <g>
              <line x1="187" y1="110" x2="187" y2="228" stroke={elastic} strokeWidth="4"
                    strokeLinecap="round" />
              <line x1="187" y1="272" x2="187" y2="390" stroke={elastic} strokeWidth="4"
                    strokeLinecap="round" />
              <circle cx="187" cy="232" r="4.5" fill={PAPER} stroke={INK} strokeWidth="1" />
              <circle cx="187" cy="268" r="4.5" fill={PAPER} stroke={INK} strokeWidth="1" />
              <line x1="187" y1="232" x2="187" y2="268" stroke={elastic} strokeWidth="4" />
              <line x1="187" y1="250" x2="174" y2="262" stroke={elastic} strokeWidth="3"
                    strokeLinecap="round" />
              <line x1="187" y1="250" x2="201" y2="261" stroke={elastic} strokeWidth="3"
                    strokeLinecap="round" />
              <circle cx="187" cy="250" r="7" fill={elastic} stroke={INK} strokeWidth="1" />
            </g>
          )}

          {/* buckle: strap root, box-stitched near the spine, running to the fore-edge (left) */}
          {hasBuckle && (
            <g>
              <rect x="102" y="238" width="150" height="24" rx="3" fill={fill}
                    stroke={INK} strokeWidth="1.2" />
              <rect x="102" y="238" width="150" height="24" rx="3" fill={hatch} />
              <line x1="108" y1="244" x2="230" y2="244" stroke={stitch} strokeWidth="1"
                    strokeDasharray="3 3" />
              <line x1="108" y1="256" x2="230" y2="256" stroke={stitch} strokeWidth="1"
                    strokeDasharray="3 3" />
              <rect x="232" y="240" width="18" height="20" fill="none" stroke={stitch}
                    strokeWidth="1.2" strokeDasharray="2 2" />
            </g>
          )}

          {hasPen && penLoop(285)}

          {labels}
          {notes(backNotes)}
        </svg>
      )}

      {angle === 'open' && (
        <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img"
             aria-label={`Technical drawing: ${leather.name} cover in ${color.name}, opened flat`}>
          <HatchDefs />
          <rect x="8" y="8" width="384" height="284" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          <rect x="60" y="52" width="280" height="180" rx="6" fill={fill}
                stroke={INK} strokeWidth="1.5" />
          <rect x="60" y="52" width="280" height="180" rx="6" fill={hatch} />
          <line x1="200" y1="52" x2="200" y2="232" stroke={INK} strokeWidth="1" strokeDasharray="5 4" />

          {/* card slots: a column on the inside of the front cover (left half), lower slots in front */}
          {config.cardSlots > 0 &&
            Array.from({ length: config.cardSlots }).map((_, i) => {
              const top = SLOT_BOTTOM - SLOT_H - (config.cardSlots - 1) * SLOT_STEP;
              const y = top + i * SLOT_STEP;
              return (
                <g key={i}>
                  <rect x={SLOT_X} y={y} width={SLOT_W} height={SLOT_H} rx="3" fill={fill}
                        stroke={INK} strokeWidth="1" />
                  <rect x={SLOT_X} y={y} width={SLOT_W} height={SLOT_H} rx="3" fill={hatch} />
                  <line x1={SLOT_X + 3} y1={y + 3} x2={SLOT_X + SLOT_W - 3} y2={y + 3}
                        stroke={stitch} strokeWidth="1" strokeDasharray="3 3" />
                </g>
              );
            })}
          {config.cardSlots > 0 && !compact && (
            <text x={SLOT_X} y={SLOT_BOTTOM - SLOT_H - (config.cardSlots - 1) * SLOT_STEP - 6}
                  fontSize="9" fill={MUTED}>
              card slots × {config.cardSlots}
            </text>
          )}

          {/* inserts on the right half */}
          {Array.from({ length: insertCount }).map((_, i) => (
            <rect key={i} x={212 + i * 6} y={64 + i * 4} width="112" height="156" rx="2"
                  fill={PAPER} stroke={INK} strokeWidth="0.9" />
          ))}
          {/* spine elastic that holds the inserts — always there, in the band colour */}
          <line x1="200" y1="46" x2="200" y2="238" stroke={elastic} strokeWidth="2.5" />
          <rect x="72" y="64" width="256" height="156" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.3" strokeDasharray="4 4" />
          {labels}
          {!compact && (
            <>
              <text x="20" y="256" fontSize="9.5" fill={MUTED}>
                → {spec.mustShow.join(' · ')}
              </text>
              <text x="20" y="278" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
            </>
          )}
        </svg>
      )}

      {angle === 'detail' && (
        <svg viewBox="0 0 400 400" className="block h-auto w-full" role="img"
             aria-label={`Macro technical drawing: ${leather.name} stitched corner`}>
          <HatchDefs scale={2} />
          <rect x="8" y="8" width="384" height="384" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          <rect x="96" y="96" width="400" height="400" rx="14" fill={fill}
                stroke={INK} strokeWidth="2" />
          <rect x="96" y="96" width="400" height="400" rx="14" fill={hatch} />
          <path d="M 96 400 L 96 110 Q 96 96 110 96 L 400 96" fill="none"
                stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <path d="M 136 400 L 136 150 Q 136 136 150 136 L 400 136" fill="none"
                stroke={stitch} strokeWidth="2" strokeDasharray="10 8" />
          <g fill={INK} opacity="0.8">
            {[380, 332, 284, 236, 188].map((cy) => <circle key={cy} cx="136" cy={cy} r="3.2" />)}
            {[168, 216, 264, 312].map((cx) => <circle key={cx} cx={cx} cy="136" r="3.2" />)}
          </g>
          {!compact && (
            <>
              <line x1="40" y1="300" x2="92" y2="300" stroke={MUTED} strokeWidth="0.9" />
              <text x="20" y="292" fontSize="9.5" fill={MUTED}>burnished edge</text>
              <line x1="40" y1="236" x2="132" y2="236" stroke={MUTED} strokeWidth="0.9" />
              <text x="20" y="228" fontSize="9.5" fill={MUTED}>0.5 mm thread, saddle stitch</text>
              <text x="20" y="372" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
            </>
          )}
          {labels}
        </svg>
      )}

      {!compact && angle !== 'back' && (
        <p className="mt-2 text-center font-mono text-[11px] text-muted">
          {previewFilename(config.leather, config.color, angle)}
        </p>
      )}
    </div>
  );
}
```

### Do NOT
- ❌ Не оставлять в `SchematicCover.tsx` локальную копию `HatchDefs` — только импорт из `./HatchDefs`.
- ❌ Не менять координаты обложки (102/110/196/280 и 60/52/280/180) — на них завязаны все элементы.
- ❌ Не рисовать резинку в ракурсе `open` снаружи: там видна только внутренняя резинка корешка.

### Acceptance
- [ ] `closure=elastic`: на `front` вертикальная полоса цвета резинки; на `back` две дырки, узелок, два хвостика, две строки выносок
- [ ] `closure=buckle`: на `front` ремешок в штриховке кожи и латунная рамка с язычком; на `back` корень ремешка с коробчатым швом
- [ ] `closure=none`: ни дырок, ни полос, на `back` строка «no closure — no holes, no hardware»
- [ ] `pen=slim` и `pen=wide`: ручка в петле на корешке, у `wide` заметно шире; подпись Ø меняется
- [ ] `cards=4` на A5: четыре кармана колонкой на левой створке в `open`, нижний спереди, подпись «card slots × 4»
- [ ] `emboss=AB&pos=spine`: буквы вертикально на корешке; `pos=bottom-right`: в углу, крупно
- [ ] `thread=tonal`: пунктир шва в цвет кожи; `thread=cream`: кремовый
- [ ] Три штриховки различимы в `LeatherSelector` и на чертеже
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "components/schematic"` — пусто

---

## T-133 — Превью с четырьмя ракурсами и линейка ручки

**Depends on:** T-131
**Estimate:** 1ч
**Files:** заменить `components/configurator/Preview.tsx`; создать `components/schematic/PenSizeGuide.tsx`
**Требования:** K-3, P-4

### Business
Четвёртая вкладка `Back`. Линейка ручки — две окружности в **реальных миллиметрах** (`width="34mm"`): к экрану можно приложить ручку.

### Code

```tsx
// components/configurator/Preview.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { Configuration, Angle } from '@/types/config';
import { schematicAngleList } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { getPreview, SHOW_SCHEMATIC_NOTES } from '@/lib/assets';
import SchematicCover from '@/components/schematic/SchematicCover';
import SizeDiagram from '@/components/schematic/SizeDiagram';

export default function Preview({ config }: { config: Configuration }) {
  const { dict } = useI18n();
  const [angle, setAngle] = useState<Angle>('front');
  const source = getPreview(config, angle);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-sm border border-line bg-paper-2 p-4 md:p-6">
        {source.kind === 'schematic' ? (
          <SchematicCover config={config} angle={angle} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={source.src} alt={source.alt} className="w-full" />
        )}
      </div>

      {/* Angle tabs */}
      <div className="flex gap-2" role="tablist" aria-label="Preview angle">
        {schematicAngleList.map((a) => (
          <button
            key={a.angle}
            type="button"
            role="tab"
            aria-selected={angle === a.angle}
            onClick={() => setAngle(a.angle)}
            className={clsx(
              'flex-1 rounded-sm border px-3 py-2 text-xs transition-colors duration-150',
              angle === a.angle
                ? 'border-ink bg-paper-2 text-ink'
                : 'border-line text-muted hover:border-ink-soft',
            )}
          >
            {dict.angles[a.angle]}
          </button>
        ))}
      </div>

      {SHOW_SCHEMATIC_NOTES && (
        <p className="text-xs leading-relaxed text-muted">{dict.leather.schematicNote}</p>
      )}

      <div className="rounded-sm border border-line p-4">
        <SizeDiagram active={config.size} mode="single" />
      </div>
    </div>
  );
}
```

```tsx
// components/schematic/PenSizeGuide.tsx
'use client';

import type { PenHolderCode } from '@/types/config';
import { penHolders } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';

const INK = '#1C1917';
const MUTED = '#8A7F72';

/**
 * Two circles in REAL millimetres: the inner diameter of the slim and the wide loop.
 * width/height are in mm on purpose — the user can hold a pen against the screen.
 */
export default function PenSizeGuide({ active }: { active: PenHolderCode }) {
  const { dict } = useI18n();
  const slim = penHolders.slim.maxMm;
  const wide = penHolders.wide.maxMm;

  return (
    <div className="flex flex-wrap items-center gap-5 rounded-sm border border-line bg-paper-2 p-4">
      <svg
        width="34mm"
        height="17mm"
        viewBox="0 0 34 17"
        role="img"
        aria-label={`Loop diameters: slim ${slim} mm, wide ${wide} mm, actual size`}
        className="shrink-0"
      >
        <circle cx="8" cy="7.5" r={slim / 2} fill={active === 'slim' ? INK : 'none'}
                stroke={INK} strokeWidth="0.35" />
        <circle cx="25" cy="7.5" r={wide / 2} fill={active === 'wide' ? INK : 'none'}
                stroke={INK} strokeWidth="0.35" />
        <text x="8" y="16" textAnchor="middle" fontSize="2" fill={MUTED}>{slim} mm</text>
        <text x="25" y="16" textAnchor="middle" fontSize="2" fill={MUTED}>{wide} mm</text>
      </svg>
      <p className="max-w-[28ch] text-xs leading-relaxed text-muted">
        {dict.configurator.penHolderGuideLabel}
      </p>
    </div>
  );
}
```

### Acceptance
- [ ] В превью четыре вкладки: Front, Back, Open, Detail
- [ ] `PenSizeGuide` рендерит два круга; при `active='wide'` правый закрашен
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "Preview.tsx\|PenSizeGuide.tsx"` — пусто

---

## T-134 — Селектор нити

**Depends on:** T-131
**Estimate:** 0.5ч
**Files:** создать `components/configurator/ThreadSelector.tsx`
**Требования:** T-1…T-6

### Code

```tsx
// components/configurator/ThreadSelector.tsx
'use client';

import type { Configuration, ThreadCode } from '@/types/config';
import { threadList, colors, THREAD_THICKNESS_MM } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill } from '@/lib/format';
import SwatchGroup from '@/components/ui/SwatchGroup';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function ThreadSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const leatherHex = colors[config.color].hex;

  return (
    <section>
      <h2 className="label mb-1">{dict.configurator.steps.thread}</h2>
      <p className="mb-3 text-xs text-muted">
        {fill(dict.configurator.threadThickness, { mm: THREAD_THICKNESS_MM })}
      </p>
      <SwatchGroup
        label={dict.configurator.steps.thread}
        value={config.thread}
        onChange={(v) => onChange({ thread: v as ThreadCode })}
        items={threadList.map((t) => ({
          value: t.code,
          label: dict.threads[t.code],
          // 'tonal' has no hex of its own: it shows the current leather colour.
          hex: t.hex ?? leatherHex,
          state: 'available' as const,
        }))}
      />
    </section>
  );
}
```

### Acceptance
- [ ] Шесть свотчей; первый («Match the leather») показывает цвет текущей кожи и меняется вместе с ней
- [ ] Под заголовком строка «Thread is 0.5 mm…»
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "ThreadSelector.tsx"` — пусто

---

## T-135 — Селектор застёжки

**Depends on:** T-131
**Estimate:** 1.5ч
**Files:** создать `components/configurator/ClosureSelector.tsx`
**Требования:** K-1, K-2, K-4, K-5, K-6

### Business
Три карточки с пиктограммами: резинка (линия с узелком), пряжка (ремешок с латунной рамкой), ничего (пустая рамка). Под карточками — пояснение выбранного варианта; у резинки оно с акцентной полосой слева: это единственный выбор, который нельзя отменить после изготовления. Цвет резинки виден только при резинке.

### Code

```tsx
// components/configurator/ClosureSelector.tsx
'use client';

import clsx from 'clsx';
import type { Configuration, ClosureCode, ElasticColorCode } from '@/types/config';
import { closureList, elasticColorList, BRASS_HEX } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDelta } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import SwatchGroup from '@/components/ui/SwatchGroup';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const INK = '#1C1917';
const LINE = '#DED5C7';

/** Tiny pictograms so the three closures are told apart at a glance. */
function ClosureIcon({ code }: { code: ClosureCode }) {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-full" aria-hidden="true">
      <rect x="1" y="1" width="58" height="22" rx="2" fill="none" stroke={LINE} strokeWidth="0.8" />
      {code === 'elastic' && (
        <>
          <line x1="30" y1="1" x2="30" y2="23" stroke={INK} strokeWidth="2" />
          <circle cx="30" cy="12" r="3" fill={INK} />
        </>
      )}
      {code === 'buckle' && (
        <>
          <rect x="8" y="8" width="44" height="8" fill={INK} opacity="0.25" />
          <rect x="10" y="5" width="10" height="14" rx="2" fill="none" stroke={BRASS_HEX} strokeWidth="2" />
          <line x1="15" y1="5" x2="15" y2="19" stroke={BRASS_HEX} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

export default function ClosureSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const current = dict.configurator.closures[config.closure];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="label mb-3">{dict.configurator.steps.closure}</h2>
        <OptionCardGroup
          label={dict.configurator.steps.closure}
          columns="grid-cols-1 sm:grid-cols-3"
          value={config.closure}
          onChange={(v) => onChange({ closure: v as ClosureCode })}
          items={closureList.map((c) => ({
            value: c.code,
            title: dict.configurator.closures[c.code].title,
            delta: formatDelta(c.priceMinor),
            visual: <ClosureIcon code={c.code} />,
          }))}
        />
        <p
          className={clsx(
            'mt-3 text-xs leading-relaxed text-ink-soft',
            config.closure === 'elastic' && 'border-l-2 border-accent pl-3',
          )}
        >
          {current.note}
        </p>
      </div>

      {config.closure === 'elastic' && (
        <div>
          <h3 className="label mb-3">{dict.configurator.elasticColor}</h3>
          <SwatchGroup
            label={dict.configurator.elasticColor}
            value={config.elasticColor}
            onChange={(v) => onChange({ elasticColor: v as ElasticColorCode })}
            items={elasticColorList.map((e) => ({
              value: e.code,
              label: dict.elasticColors[e.code],
              hex: e.hex,
              state: 'available' as const,
            }))}
          />
        </div>
      )}
    </section>
  );
}
```

### Acceptance
- [ ] Три карточки; у пряжки подпись «+130 zł», у остальных пусто
- [ ] При резинке — свотчи цвета и пояснение с акцентной полосой; при пряжке и «нет» — свотчей нет
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "ClosureSelector.tsx"` — пусто

---

## T-136 — Селектор держателя ручки

**Depends on:** T-133
**Estimate:** 1ч
**Files:** создать `components/configurator/PenHolderSelector.tsx`
**Требования:** P-1…P-5

### Code

```tsx
// components/configurator/PenHolderSelector.tsx
'use client';

import type { Configuration, PenHolderCode } from '@/types/config';
import { penHolderList, PEN_HOLDER_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatDelta } from '@/lib/format';
import OptionCardGroup from '@/components/ui/OptionCardGroup';
import PenSizeGuide from '@/components/schematic/PenSizeGuide';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const INK = '#1C1917';
const LINE = '#DED5C7';

/** Pen cross-section: the wide loop is drawn at 13:10 of the slim one. */
function PenIcon({ code }: { code: PenHolderCode }) {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-full" aria-hidden="true">
      <rect x="1" y="1" width="58" height="22" rx="2" fill="none" stroke={LINE} strokeWidth="0.8" />
      {code === 'slim' && <circle cx="30" cy="12" r="5" fill="none" stroke={INK} strokeWidth="1.2" />}
      {code === 'wide' && <circle cx="30" cy="12" r="6.5" fill="none" stroke={INK} strokeWidth="1.2" />}
    </svg>
  );
}

export default function PenHolderSelector({ config, onChange }: Props) {
  const { dict } = useI18n();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="label mb-3">
          {dict.configurator.steps.penHolder}
          <span className="ml-2 normal-case tracking-normal text-accent">
            {formatDelta(PEN_HOLDER_MINOR)}
          </span>
        </h2>
        <OptionCardGroup
          label={dict.configurator.steps.penHolder}
          columns="grid-cols-1 sm:grid-cols-3"
          value={config.penHolder}
          onChange={(v) => onChange({ penHolder: v as PenHolderCode })}
          items={penHolderList.map((p) => ({
            value: p.code,
            title: dict.configurator.penHolders[p.code].title,
            meta: dict.configurator.penHolders[p.code].meta || undefined,
            delta: p.code === 'none' ? undefined : formatDelta(PEN_HOLDER_MINOR),
            visual: <PenIcon code={p.code} />,
          }))}
        />
      </div>
      <p className="text-xs leading-relaxed text-ink-soft">{dict.configurator.penHolderHelp}</p>
      <PenSizeGuide active={config.penHolder} />
    </section>
  );
}
```

### Acceptance
- [ ] Три карточки: «No pen loop» без цены; «Slim pen · Ø up to 10 mm · +20 zł»; «Wide pen · Ø 10–13 mm · +20 zł»
- [ ] Под карточками — подсказка и линейка с двумя кругами
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "PenHolderSelector.tsx"` — пусто

---

## T-137 — Селектор карманов и вкладыши без захардкоженных строк

**Depends on:** T-131
**Estimate:** 1ч
**Files:** создать `components/configurator/CardSlotsSelector.tsx`; заменить `components/configurator/InsertsSelector.tsx`
**Требования:** C-1, C-3, C-4, X-3

### Code

```tsx
// components/configurator/CardSlotsSelector.tsx
'use client';

import type { Configuration } from '@/types/config';
import { sizes, CARD_SLOTS_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill, formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

export default function CardSlotsSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
  const max = sizes[config.size].cardSlotsMax;
  const count = config.cardSlots;
  const name = dict.configurator.steps.cardSlots;

  return (
    <section>
      <h2 className="label mb-1">
        {name}
        <span className="ml-2 normal-case tracking-normal text-accent">
          {formatDelta(CARD_SLOTS_MINOR)}
        </span>
      </h2>
      <p className="text-xs text-muted">{fill(dict.configurator.cardSlotsHint, { max, count })}</p>
      <p className="mb-3 text-xs text-muted">{dict.configurator.cardSlotsMeta}</p>

      <div className="flex items-center justify-between rounded-sm border border-line p-3">
        <span className="text-sm text-ink">{dict.configurator.cardSlotsInside}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={fill(dict.configurator.removeOne, { name })}
            disabled={count === 0}
            onClick={() => onChange({ cardSlots: count - 1 })}
            className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-sm" aria-live="polite">
            {count}
          </span>
          <button
            type="button"
            aria-label={fill(dict.configurator.addOne, { name })}
            disabled={count >= max}
            onClick={() => onChange({ cardSlots: count + 1 })}
            className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}
```

```tsx
// components/configurator/InsertsSelector.tsx
'use client';

import type { Configuration, InsertType } from '@/types/config';
import { sizes, insertPriceMinor, GIFT_BOX_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill, formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const TYPES: InsertType[] = ['plain', 'ruled', 'dot'];

export default function InsertsSelector({ config, onChange }: Props) {
  const { dict } = useI18n();
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
        <h2 className="label mb-1">{dict.configurator.steps.inserts}</h2>
        <p className="mb-3 text-xs text-muted">
          {fill(dict.configurator.insertsHint, { max: capacity, count: totalQty })}
        </p>

        <div className="space-y-2">
          {TYPES.map((type) => {
            const current = config.inserts.find((i) => i.type === type)?.qty ?? 0;
            const canAdd = totalQty < capacity;
            const name = dict.insertTypes[type];
            return (
              <div
                key={type}
                className="flex items-center justify-between rounded-sm border border-line p-3"
              >
                <div>
                  <span className="text-sm text-ink">{name}</span>
                  <span className="ml-2 text-xs text-accent">
                    {formatDelta(insertPriceMinor[type])}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={fill(dict.configurator.removeOne, { name })}
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
                    aria-label={fill(dict.configurator.addOne, { name })}
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
          {dict.configurator.giftBoxLabel}
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

### Acceptance
- [ ] На A6 «+» карманов недоступен после 2, на A5 — после 4
- [ ] В обоих файлах нет английских строк вне `dict`
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "CardSlotsSelector.tsx\|InsertsSelector.tsx"` — пусто

---

## T-138 — Поле тиснения и модалка подтверждения

**Depends on:** T-131
**Estimate:** 1.5ч
**Files:** создать `components/configurator/EmbossingInput.tsx`, `components/configurator/EmbossingConfirmModal.tsx`; **удалить** `components/configurator/EngravingInput.tsx`, `components/configurator/EngravingConfirmModal.tsx`
**Требования:** E-1…E-7

### Business
Поле на две буквы — узкое, крупное, с разрядкой, само поднимает регистр. Дебаунс не нужен: два символа — два обновления URL.

### Code

```tsx
// components/configurator/EmbossingInput.tsx
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Configuration, EmbossingFont, EmbossingPosition } from '@/types/config';
import { EMBOSSING_MINOR, MAX_EMBOSSING_LENGTH } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { sanitizeEmbossing } from '@/lib/config-schema';
import { fill, formatDelta } from '@/lib/format';

interface Props {
  config: Configuration;
  onChange: (patch: Partial<Configuration>) => void;
}

const FONTS: EmbossingFont[] = ['serif', 'sans'];
const POSITIONS: EmbossingPosition[] = ['bottom-right', 'spine'];

export default function EmbossingInput({ config, onChange }: Props) {
  const { dict } = useI18n();
  const [text, setText] = useState(config.embossing?.text ?? '');

  // Keep local state in sync when config changes from outside (e.g. URL restore)
  useEffect(() => {
    setText(config.embossing?.text ?? '');
  }, [config.embossing?.text]);

  function commit(next: { text?: string; font?: EmbossingFont; position?: EmbossingPosition }) {
    const clean = (next.text ?? text).trim();
    if (clean.length === 0) {
      if (config.embossing !== null) onChange({ embossing: null });
      return;
    }
    onChange({
      embossing: {
        text: clean,
        font: next.font ?? config.embossing?.font ?? 'serif',
        position: next.position ?? config.embossing?.position ?? 'bottom-right',
      },
    });
  }

  return (
    <section>
      <h2 className="label mb-3">
        {dict.configurator.steps.embossing}
        <span className="ml-2 normal-case tracking-normal text-accent">
          {formatDelta(EMBOSSING_MINOR)}
        </span>
      </h2>

      <div className="flex items-center gap-4">
        <input
          type="text"
          autoCapitalize="characters"
          autoComplete="off"
          value={text}
          onChange={(e) => {
            const clean = sanitizeEmbossing(e.target.value);
            setText(clean);
            commit({ text: clean });
          }}
          placeholder={dict.configurator.embossingPlaceholder}
          maxLength={MAX_EMBOSSING_LENGTH}
          aria-describedby="embossing-hint"
          className="h-14 w-28 rounded-sm border border-line bg-paper text-center font-display text-2xl tracking-[0.2em] text-ink placeholder:text-muted focus:border-ink"
        />
        <span className="font-mono text-xs text-muted">
          {text.length} / {MAX_EMBOSSING_LENGTH}
        </span>
      </div>

      <p id="embossing-hint" className="mt-1.5 text-xs text-muted">
        {fill(dict.configurator.embossingHint, { max: MAX_EMBOSSING_LENGTH })}
      </p>
      <p className="mt-1 text-xs text-ink-soft">{dict.configurator.embossingNote}</p>

      {text.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="label mb-2 block">{dict.configurator.embossingFontLabel}</span>
            <div className="flex gap-2">
              {FONTS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => commit({ font: f })}
                  className={clsx(
                    'h-9 flex-1 rounded-sm border text-sm transition-colors duration-150',
                    config.embossing?.font === f ? 'border-ink bg-paper-2' : 'border-line',
                  )}
                >
                  {dict.configurator.embossingFonts[f]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label mb-2 block">{dict.configurator.embossingPositionLabel}</span>
            <div className="flex gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => commit({ position: p })}
                  className={clsx(
                    'h-9 flex-1 rounded-sm border text-xs transition-colors duration-150',
                    config.embossing?.position === p ? 'border-ink bg-paper-2' : 'border-line',
                  )}
                >
                  {dict.configurator.embossingPositions[p]}
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

```tsx
// components/configurator/EmbossingConfirmModal.tsx
'use client';

import type { EmbossingFont } from '@/types/config';
import { useI18n } from '@/components/i18n/I18nProvider';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface Props {
  open: boolean;
  text: string;
  font: EmbossingFont;
  onEdit: () => void;
  onConfirm: () => void;
}

export default function EmbossingConfirmModal({ open, text, font, onEdit, onConfirm }: Props) {
  const { dict } = useI18n();

  return (
    <Modal
      open={open}
      title={dict.configurator.embossingConfirmTitle}
      onClose={onEdit}
      footer={
        <>
          <Button variant="secondary" onClick={onEdit}>
            {dict.configurator.embossingConfirmEdit}
          </Button>
          <Button onClick={onConfirm}>{dict.configurator.embossingConfirmOk}</Button>
        </>
      }
    >
      <p
        className={`mb-4 border border-line bg-paper-2 p-6 text-center text-4xl tracking-[0.3em] text-ink ${
          font === 'serif' ? 'font-display' : 'font-sans'
        }`}
      >
        {text}
      </p>
      <p>{dict.configurator.embossingConfirmBody}</p>
    </Modal>
  );
}
```

### Steps
1. Создать два файла.
2. `git rm components/configurator/EngravingInput.tsx components/configurator/EngravingConfirmModal.tsx`.

### Acceptance
- [ ] Ввод «ab» показывает «AB»; ввод «a1b» — «AB»; третья буква не появляется
- [ ] Кнопки шрифта и позиции видны только когда есть текст
- [ ] Старые файлы `Engraving*` удалены
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "Embossing"` — пусто

---

## T-139 — Sticky-панель

**Depends on:** T-138
**Estimate:** 0.5ч
**Files:** заменить `components/configurator/StickyBar.tsx`

### Code

```tsx
// components/configurator/StickyBar.tsx
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { PricedConfiguration } from '@/types/config';
import { useI18n } from '@/components/i18n/I18nProvider';
import { formatPrice } from '@/lib/format';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';
import EmbossingConfirmModal from './EmbossingConfirmModal';

export default function StickyBar({ priced }: { priced: PricedConfiguration }) {
  const { dict } = useI18n();
  const [highlight, setHighlight] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    setHighlight(true);
    const timer = setTimeout(() => setHighlight(false), 600);
    return () => clearTimeout(timer);
  }, [priced.totalMinor]);

  const hasEmbossing = !!priced.embossing && priced.embossing.text.trim().length > 0;

  function handleAdd() {
    if (hasEmbossing) {
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
              {priced.stock === 'made_to_order' && `${dict.configurator.madeToOrder} · `}
              {dict.configurator.readyIn} {priced.productionDays} {dict.configurator.workingDays}
            </p>
          </div>

          <Button size="lg" onClick={handleAdd}>
            {dict.configurator.addToCart}
          </Button>
        </div>
      </div>

      <EmbossingConfirmModal
        open={confirmOpen}
        text={priced.embossing?.text ?? ''}
        font={priced.embossing?.font ?? 'serif'}
        onEdit={() => setConfirmOpen(false)}
        onConfirm={confirmAdd}
      />
    </>
  );
}
```

### Acceptance
- [ ] С тиснением кнопка открывает модалку; без — сразу кладёт в корзину
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "StickyBar.tsx"` — пусто

---

## T-140 — Корзина: строки позиции

**Depends on:** T-131
**Estimate:** 1ч
**Files:** изменить `components/cart/CartDrawer.tsx`, `components/cart/ReserveBlock.tsx`
**Требования:** C-7, K-4, X-3

### Steps
1. В `CartDrawer.tsx` заменить блок импортов из `@/content/*` (строки `sizes`, `leathers`, `colors`, `threads`, `cords`, `insertNames`) на один:
   ```ts
   import { sizes } from '@/lib/data';
   ```
2. Заменить функцию `ItemRow` целиком:

```tsx
function ItemRow({ item }: { item: CartItem }) {
  const c = item.config;
  const { dict, getLocalizedPath } = useI18n();
  const removeItem = useCartStore((s) => s.removeItem);

  const closureName =
    c.closure === 'elastic'
      ? `${dict.configurator.closures.elastic.title} · ${dict.elasticColors[c.elasticColor]}`
      : dict.configurator.closures[c.closure].title;

  const lines = [
    `${sizes[c.size].name} · ${dict.leatherNames[c.leather]} · ${dict.colors[c.color]}`,
    `${dict.cart.thread}: ${dict.threads[c.thread]}`,
    `${dict.cart.closure}: ${closureName}`,
    c.penHolder !== 'none'
      ? `${dict.cart.penHolder}: ${dict.configurator.penHolders[c.penHolder].title} (${dict.configurator.penHolders[c.penHolder].meta})`
      : null,
    c.cardSlots > 0 ? `${dict.cart.cardSlots}: ${c.cardSlots}` : null,
    c.embossing
      ? `${dict.cart.embossing}: “${c.embossing.text}” (${dict.configurator.embossingPositions[c.embossing.position]})`
      : null,
    c.inserts.filter((i) => i.qty > 0).length > 0
      ? `${dict.cart.inserts}: ${c.inserts
          .filter((i) => i.qty > 0)
          .map((i) => `${i.qty} × ${dict.insertTypes[i.type]}`)
          .join(', ')}`
      : null,
    c.giftBox ? dict.cart.giftBox : null,
    `${dict.configurator.readyIn} ${c.productionDays} ${dict.configurator.workingDays}`,
  ].filter(Boolean) as string[];

  return (
    <li className="flex gap-4 border-b border-line py-5">
      <div className="w-20 shrink-0">
        <SchematicCover config={c} angle="front" compact />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-ink">
            {sizes[c.size].name}
            {item.qty > 1 && <span className="ml-2 text-muted">× {item.qty}</span>}
          </p>
          <p className="shrink-0 text-sm text-ink">{formatPrice(c.totalMinor * item.qty)}</p>
        </div>

        <ul className="space-y-0.5 text-xs text-muted">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        {c.closure === 'elastic' && (
          <p className="mt-1 text-[11px] leading-snug text-muted">{dict.cart.elasticNote}</p>
        )}

        <div className="mt-2 flex gap-3 text-xs">
          <Link
            href={getLocalizedPath(`/configurator${configToQueryString(c)}`)}
            className="text-accent underline underline-offset-2"
          >
            {dict.cart.edit}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-muted underline underline-offset-2"
          >
            {dict.cart.remove}
          </button>
        </div>
      </div>
    </li>
  );
}
```

3. В `ReserveBlock.tsx` заменить строку
   ```tsx
   <p className="mt-2 text-xs text-alert">Error processing reservation. Please try again.</p>
   ```
   на
   ```tsx
   <p className="mt-2 text-xs text-alert">{dict.cart.reserveError}</p>
   ```

### Acceptance
- [ ] Позиция с пряжкой показывает «Closure: Brass buckle»; с резинкой — «Elastic band · Brown» и строку про две дырки
- [ ] `grep -n "@/content/" components/cart/CartDrawer.tsx` — пусто
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "components/cart"` — пусто

---

## T-141 — Лендинг и метаданные

**Depends on:** T-131
**Estimate:** 1ч
**Files:** изменить `components/landing/Leather.tsx`, `components/landing/Sizes.tsx`, `app/layout.tsx`, `app/[lang]/shotlist/page.tsx`
**Требования:** L-3, C-3, X-7

### Steps

**`components/landing/Leather.tsx`:**
1. Строку `const [active, setActive] = useState<LeatherCode>('veg-tan');` заменить на `useState<LeatherCode>('smooth')`.
2. Строку `const localizedDesc = dict.leather.descriptions[active] || l;` заменить на `const localizedDesc = dict.leather.descriptions[active];`.

**`components/landing/Sizes.tsx`:**
1. Импорт `import { sizeList } from '@/content/sizes';` заменить на `import { sizeList } from '@/lib/data';`.
2. Внутри `<dl>` после блока `Weight` добавить:
   ```tsx
   <div className="flex justify-between">
     <dt>{dict.sizes.cardSlots}</dt>
     <dd>
       {dict.sizes.upTo} {s.cardSlotsMax}
     </dd>
   </div>
   ```

**`app/layout.tsx`:** в `metadata.description` заменить `'…Choose size, leather, colour and engraving. Ships across the EU.'` на `'…Choose size, leather, colour, closure and embossing. Ships across the EU.'`.

**`app/[lang]/shotlist/page.tsx`:**
1. `title: 'Shot list — KROJA'` → `title: 'Shot list — Naked Skin'`.
2. После `<p className="mb-6 text-ink-soft">{dict.shotlist.subtitle}</p>` добавить:
   ```tsx
   <p className="mb-6 rounded-sm border border-line bg-paper-2 p-3 text-xs text-ink-soft">
     {dict.shotlist.postponedNote}
   </p>
   ```

### Acceptance
- [ ] Секция S4 открывается на «Smooth leather», три таба
- [ ] Карточки размеров показывают «Card slots · up to 2/3/3/4»
- [ ] `grep -n "engraving\|KROJA" app/layout.tsx "app/[lang]/shotlist/page.tsx"` — пусто
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "components/landing\|app/layout\|shotlist/page"` — пусто

---

## T-142 — Список кадров: согласованность

**Depends on:** T-131
**Estimate:** 0.5ч
**Files:** изменить `lib/shotlist.ts`, `components/shotlist/ShotMatrix.tsx`

### Business
Съёмка отложена, но страница должна собираться и показывать правду: новые кожи, новые имена файлов, 81 продуктовый кадр при «всё в наличии».

### Steps

**`lib/shotlist.ts`:** заменить три записи `S4-leather-*` в `storyShots`:
```ts
{ index: 5, id: 'S4-leather-smooth', subject: 'Macro: smooth leather grain', requirement: 'Flat even light, square frame', why: 'Leather comparison section', ratio: '1 / 1' },
{ index: 6, id: 'S4-leather-croc', subject: 'Macro: croc-embossed relief, raking light', requirement: 'Flat even light plus one raking light, square frame, same distance as the others', why: 'Leather comparison section', ratio: '1 / 1' },
{ index: 7, id: 'S4-leather-suede', subject: 'Macro: suede nap, brushed two ways', requirement: 'Flat even light, square frame, same distance as the others', why: 'Leather comparison section', ratio: '1 / 1' },
```

**`components/shotlist/ShotMatrix.tsx`:**
1. Импорты `@/content/shots` и `@/content/leathers` заменить на `import { angleList, globalShotRules, leatherList } from '@/lib/data';`.
2. Добавить `import { DEFAULT_CONFIG } from '@/lib/config-schema';`.
3. Литерал `const config: Configuration = { size: 'a5', leather: …, giftBox: false };` заменить на:
   ```ts
   const config: Configuration = {
     ...DEFAULT_CONFIG,
     leather: shot.leather,
     color: shot.color,
     inserts: [{ type: 'dot', qty: 2 }],
   };
   ```

### Acceptance
- [ ] `/en/shotlist` открывается, вверху «81 shots total — 81 product…» (27 пар × 3 ракурса) — число может измениться, если изменится `availability.ts`
- [ ] `grep -n "@/content/" components/shotlist lib/shotlist.ts` → только `lib/shotlist.ts` (ему можно)
- [ ] `npx tsc --noEmit --pretty false 2>&1 | grep "shotlist"` — пусто

---

## Волна C — сборка и приёмка

---

## T-143 — Сборка конструктора

**Depends on:** T-132…T-142 (вся волна B)
**Estimate:** 1ч
**Files:** заменить `components/configurator/ConfiguratorClient.tsx`; изменить `components/configurator/RestoreBanner.tsx`; **удалить** `components/configurator/DetailsSelector.tsx`
**Требования:** X-4, X-8

### Business
Порядок осей — от предмета к надписи: размер → кожа → цвет → нить → застёжка → держатель → карманы → вкладыши → тиснение (коробка — внутри вкладышей). После этой задачи `npm run build` обязан быть зелёным.

### Code

```tsx
// components/configurator/ConfiguratorClient.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ToastProvider } from '@/components/ui/Toast';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useConfigurator } from './useConfigurator';
import Preview from './Preview';
import SizeSelector from './SizeSelector';
import LeatherSelector from './LeatherSelector';
import ColorSelector from './ColorSelector';
import ThreadSelector from './ThreadSelector';
import ClosureSelector from './ClosureSelector';
import PenHolderSelector from './PenHolderSelector';
import CardSlotsSelector from './CardSlotsSelector';
import InsertsSelector from './InsertsSelector';
import EmbossingInput from './EmbossingInput';
import StickyBar from './StickyBar';
import RestoreBanner, { saveConfig } from './RestoreBanner';

function Inner() {
  const searchParams = useSearchParams();
  const { dict, getLocalizedPath } = useI18n();
  const { config, priced, warnings, update } = useConfigurator();

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const isFreshVisit = searchParams.toString() === '';

  return (
    <>
      <main className="container-content pb-32 pt-8">
        <Link
          href={getLocalizedPath('/')}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
        >
          {dict.nav.backToHome}
        </Link>
        <h1 className="mb-8 text-3xl md:text-4xl">{dict.configurator.title}</h1>

        <RestoreBanner isFreshVisit={isFreshVisit} onRestore={(c) => update(c)} />

        {warnings.length > 0 && (
          <div className="mb-6 rounded-sm border border-line bg-paper-2 p-4 text-sm text-ink-soft">
            {dict.configurator.conflictBanner}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          {/* Left: preview, sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Preview config={config} />
          </div>

          {/* Right: options, from "what object" to "what is written on it" */}
          <div className="flex flex-col gap-10">
            <SizeSelector config={config} onChange={update} />
            <LeatherSelector config={config} onChange={update} />
            <ColorSelector config={config} onChange={update} />
            <ThreadSelector config={config} onChange={update} />
            <ClosureSelector config={config} onChange={update} />
            <PenHolderSelector config={config} onChange={update} />
            <CardSlotsSelector config={config} onChange={update} />
            <InsertsSelector config={config} onChange={update} />
            <EmbossingInput config={config} onChange={update} />
          </div>
        </div>
      </main>

      <StickyBar priced={priced} />
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

### Steps
1. Заменить `ConfiguratorClient.tsx`.
2. В `RestoreBanner.tsx` строку `const KEY = 'kroja:last-config';` заменить на `const KEY = 'nakedskin:last-config';`.
3. `git rm components/configurator/DetailsSelector.tsx`.
4. `npm run build` — должна быть зелёной. Если нет — чинить **только** ошибки, которые показывает сборка, не переписывая код задач волн A и B.

### Acceptance
- [ ] `npm run build` зелёная
- [ ] `/en/configurator` показывает девять секций в указанном порядке
- [ ] Смена размера A5 → A6 при `cards=4` даёт тост и 2 кармана

---

## T-144 — Чистка и приёмка эпика

**Depends on:** T-143
**Estimate:** 1.5ч
**Files:** любые — только удаление остатков; ничего нового не создавать
**Требования:** L-1, E-1, X-1…X-9

### Steps
1. Найти остатки старых понятий. Каждая команда должна вернуть пусто:
   ```bash
   grep -rn "engraving\|Engraving" app components lib content store types scripts
   grep -rn "veg-tan\|crazy-horse\|pull-up" app components lib content store types scripts
   grep -rnw "cord\|cords\|CordCode" app components lib content store types scripts
   grep -rn "NOT_IN_FRAME\|DetailsSelector\|sanitizeEngraving\|ENGRAVING_MINOR" app components lib content store types scripts
   grep -rn "kroja:" app components lib content store types
   ```
   Что нашлось — исправить по смыслу задач этого эпика (переименовать, удалить). Файлы `*.md` и `kroja-spec/` не трогать.
2. `npm run lint` — без замечаний.
3. `npm run build` — зелёная.
4. `npm run shotlist` — `shotlist.md` пересобран с новыми кожами.
5. Ручная проверка по ссылкам (каждую открыть, посмотреть превью и цену):

   | Ссылка | Ожидание |
   |---|---|
   | `/en/configurator` | A5, smooth, cognac, tonal, резинка чёрная, 325 zł |
   | `/en/configurator?leather=veg-tan` | подстановка smooth + тост |
   | `/en/configurator?size=a6&cards=4&inserts=4:dot,4:plain` | 2 кармана, 2 вкладыша, два тоста, баннер |
   | `/en/configurator?closure=buckle&pen=wide&cards=3&emboss=ab` | 455 + 20 + 10 + 40 = 525 zł; на `front` пряжка, ручка, буквы «AB» |
   | `/en/configurator?closure=elastic&elastic=brown` → вкладка Back | коричневая резинка, узелок, две дырки |
   | `/en/configurator?closure=none` → вкладка Back | ни дырок, ни резинки |
   | `/en/configurator?thread=cream&leather=suede&color=graphite` | точечная штриховка, кремовый пунктир |
   | `/pl/configurator`, `/de/…`, `/by/…`, `/uk/…` | ни одной английской подписи у новых осей |
   | Добавить с тиснением в корзину | модалка → в корзине строка «Embossing: “AB”» |
   | `/en/shotlist` | открывается, 81 кадр, легенда из трёх штриховок |

6. Обновить `STATUS.md`: все задачи ✅, раздел «Расхождения» заполнен (или явно «расхождений нет»).

### Acceptance
- [ ] Все пять `grep` пусты
- [ ] `npm run lint` и `npm run build` зелёные
- [ ] Все строки таблицы проверены вручную и совпали
- [ ] `STATUS.md` актуален

---

## Что после эпика

Не делать без отдельного указания: ограничения наличия по данным мастера, реальные диаметры петель, финальные тексты по коже, съёмка. Всё это — правка данных в `content/*` и словарях, когда появятся ответы из `kroja-spec/17-axes-change.md` §10.
