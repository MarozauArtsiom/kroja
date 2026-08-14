# 06 — Модель данных

Никакой базы данных. Всё — типизированные файлы в `/content`, версионируемые в git.

---

## 1. Типы

```ts
// types/config.ts

export type SizeCode    = 'a6' | 'b6' | 'standard' | 'a5';
export type LeatherCode = 'veg-tan' | 'crazy-horse' | 'pull-up';
export type ColorCode   = 'natural' | 'cognac' | 'chestnut' | 'olive'
                        | 'black' | 'navy' | 'burgundy';
export type ThreadCode  = 'natural' | 'tonal' | 'contrast';
export type CordCode    = 'black' | 'brown' | 'olive' | 'burgundy';
export type InsertType  = 'plain' | 'ruled' | 'dot';
export type StockStatus = 'in_stock' | 'made_to_order' | 'unavailable';

export interface Engraving {
  text: string;                 // ≤ 20 символов после trim
  font: 'serif' | 'sans';
  position: 'bottom-right' | 'spine';
}

export interface Configuration {
  size: SizeCode;
  leather: LeatherCode;
  color: ColorCode;
  thread: ThreadCode;
  cord: CordCode;
  engraving: Engraving | null;
  inserts: Array<{ type: InsertType; qty: number }>;
  giftBox: boolean;
}

export interface PricedConfiguration extends Configuration {
  totalMinor: number;           // в грошах
  currency: 'PLN';
  productionDays: number;
  previewKey: string;           // `${leather}_${color}`
}

export interface CartItem {
  id: string;                   // хеш конфигурации — для дедупликации
  config: PricedConfiguration;
  qty: number;
  addedAt: number;
}
```

---

## 2. Контент-файлы

### `content/sizes.ts`

```ts
export const sizes = {
  a5: {
    code: 'a5',
    name: 'A5 Large',
    coverMm: [155, 220],
    insertMm: [148, 210],
    weightG: 210,
    insertCapacity: 4,
    basePriceMinor: 35900,
    useCase: 'Desk work, journaling, long-form notes',
  },
  standard: {
    code: 'standard',
    name: 'Standard',
    coverMm: [118, 220],
    insertMm: [110, 210],
    weightG: 180,
    insertCapacity: 4,
    basePriceMinor: 31900,
    useCase: 'Travel notebook format, sketching on the go',
  },
  b6: { /* … basePriceMinor: 29900 */ },
  a6: { /* … basePriceMinor: 24900 */ },
} as const;
```

### `content/leathers.ts`

```ts
export const leathers = {
  'veg-tan': {
    code: 'veg-tan',
    name: 'Vegetable-tanned',
    origin: 'Italy, Tuscany',
    thicknessMm: 1.8,
    priceDeltaMinor: 0,
    textureImage: '/textures/veg-tan.webp',
    character: '…',                 // 2–3 предложения для лендинга
    ageing: { m6: '…', m12: '…', m36: '…' },
    scratchResistance: 2,           // 1–5, для сравнительной таблицы
    patinaSpeed: 5,
    softness: 2,
  },
  'crazy-horse': { /* priceDeltaMinor: 3000 */ },
  'pull-up':     { /* priceDeltaMinor: 5000 */ },
} as const;
```

### `content/colors.ts`

```ts
export const colors = {
  cognac:   { code: 'cognac',   name: 'Cognac',   hex: '#8B4A2B', order: 1 },
  chestnut: { code: 'chestnut', name: 'Chestnut', hex: '#5C3A21', order: 2 },
  natural:  { code: 'natural',  name: 'Natural',  hex: '#C9A97E', order: 3 },
  olive:    { code: 'olive',    name: 'Olive',    hex: '#4A4B32', order: 4 },
  navy:     { code: 'navy',     name: 'Navy',     hex: '#2A3345', order: 5 },
  burgundy: { code: 'burgundy', name: 'Burgundy', hex: '#5A222B', order: 6 },
  black:    { code: 'black',    name: 'Black',    hex: '#1C1917', order: 7 },
} as const;
```

`order` определяет и порядок в палитре, и приоритет при автоподмене цвета в случае конфликта.

⚠️ `hex` используется для свотча в палитре и для чипа цвета на схеме. Внутрь контура обложки цвет **не заливается** — чертёж цвет называет, а не изображает. Под свотчем всегда стоит название: цвет не может быть единственным признаком.

### `content/availability.ts`

```ts
export const leatherRules = {
  'veg-tan':     { colors: ['natural','cognac','chestnut','black'],      sizes: ['a6','b6','standard','a5'] },
  'crazy-horse': { colors: ['cognac','chestnut','olive','black','navy'], sizes: ['a6','b6','standard','a5'] },
  'pull-up':     { colors: ['cognac','black','burgundy'],                sizes: ['b6','standard','a5'] },
} as const;

// Ручное управление наличием — единственное место, куда лезут при изменении склада
export const stock: Record<string, StockStatus> = {
  'veg-tan_natural':      'in_stock',
  'veg-tan_cognac':       'in_stock',
  'veg-tan_chestnut':     'in_stock',
  'veg-tan_black':        'made_to_order',
  'crazy-horse_cognac':   'in_stock',
  'crazy-horse_chestnut': 'in_stock',
  'crazy-horse_olive':    'made_to_order',
  'crazy-horse_black':    'in_stock',
  'crazy-horse_navy':     'made_to_order',
  'pull-up_cognac':       'in_stock',
  'pull-up_black':        'in_stock',
  'pull-up_burgundy':     'unavailable',
};

export const productionDays = {
  in_stock:      5,
  made_to_order: 14,
} as const;
```

### `content/pricing.ts`

```ts
export const ENGRAVING_MINOR = 4000;
export const GIFT_BOX_MINOR  = 3500;
export const insertPriceMinor: Record<InsertType, number> = {
  plain: 2500, ruled: 2500, dot: 2500,
};
export const CURRENCY = 'PLN';
```

### `content/previewAnchors.ts`

Координаты слоёв гравировки и шнура для каждого ракурса. Используются и мок-рендером, и будущими фотографиями — координаты задаются в процентах от контейнера, поэтому переживают замену.

### `content/sections.ts`

Флаги показа секций лендинга. В MVP выключены секции, для которых кадров не будет:

```ts
export const sections = {
  patina:  false,  // S5 — кадра «через год» не существует
  process: 'full', // S6 — остаётся: кадры процесса нельзя доснять потом
  reviews: false,  // S8 — отзывов нет
} as const;
```

### Параметры схем

`leathers.ts` дополняется полем `schematicHatch` (`'diagonal-fine' | 'diagonal-coarse' | 'cross-hatch'`), `threads` получают `hex` для пунктира шва. Спецификация — в `12-schematic-assets.md`, раздел 3.

### Требования к кадрам

```ts
// content/shots.ts
export const angleSpecs = {
  front:  { ratio: '4/5', mustShow: ['grain','stitch','edge','silhouette'] },
  open:   { ratio: '4/3', mustShow: ['insert attachment','inner side'] },
  detail: { ratio: '1/1', mustShow: ['stitch density','burnished edge','close grain'] },
} as const;

export const globalShotRules = [
  'No cord, no engraving in frame — both are composited in code',
  'Identical angle, light, distance and background within one angle group',
  'Neutral single background across the whole matrix',
  '≥ 2400 px on the long side before compression',
  'No retouching of leather texture',
];
```

Из этого файла строится и страница `/shotlist`, и выноски на схемах в конструкторе. Один источник истины.

### `content/copy.ts`

Все тексты интерфейса и лендинга плоским объектом. Ключи — по секциям: `hero.title`, `faq.items[]`, `configurator.engraving.hint`. Это позволяет добавить второй язык без правки компонентов.

---

## 3. Схема валидации

Одна Zod-схема используется в трёх местах: парсинг URL, восстановление корзины из `localStorage`, приём данных в `/api/notify`.

```ts
// lib/config-schema.ts
export const configSchema = z.object({
  size: z.enum(['a6','b6','standard','a5']).catch('a5'),
  leather: z.enum(['veg-tan','crazy-horse','pull-up']).catch('veg-tan'),
  color: z.enum([...]).catch('cognac'),
  thread: z.enum([...]).catch('natural'),
  cord: z.enum([...]).catch('black'),
  engraving: z.object({
    text: z.string().trim().max(20).regex(ENGRAVING_ALLOWED),
    font: z.enum(['serif','sans']).catch('serif'),
    position: z.enum(['bottom-right','spine']).catch('bottom-right'),
  }).nullable().catch(null),
  inserts: z.array(z.object({
    type: z.enum(['plain','ruled','dot']),
    qty: z.number().int().min(0).max(4),
  })).catch([{ type: 'dot', qty: 1 }]),
  giftBox: z.boolean().catch(false),
});
```

`.catch()` на каждом поле — гарантия, что парсер никогда не падает и всегда возвращает валидную конфигурацию. Кросс-полевая совместимость (кожа × цвет × размер) проверяется отдельно, после схемы, потому что требует подмены, а не отбраковки.

```ts
export const ENGRAVING_ALLOWED = /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻа-яА-ЯёЁ .\-&]*$/;
```

---

## 4. Идентификатор позиции корзины

```ts
cartItemId = hash(JSON.stringify(normalizedConfig))
```

Две одинаковые конфигурации складываются в одну позицию с `qty: 2`. Две разные — отдельные позиции. Нормализация перед хешированием: сортировка вкладышей, `trim` гравировки, приведение `null` и пустой строки к одному виду.

---

## 5. Экспорт списка кадров

Генерируется на клиенте из `availability.ts`, `shots.ts` и собранных `<PhotoSlot>`.

```
shotlist.md / shotlist.csv
────────────────────────────────────────────────
#   file                            leather      colour   angle   done
1   veg-tan_natural_front.webp      Veg-tan      Natural  front   ☐
2   veg-tan_cognac_front.webp       Veg-tan      Cognac   front   ☐
…
37  S1-hero.jpg                     —            —        story   ☐
```

`content/availability.ts` фактически становится управляющим документом съёмки: убрал комбинацию из наличия — кадр исчез из списка.
