# TASKS 8 — Пропущенные переводы (EPIC 11)

Задачи T-170 … T-182. Источник — аудит переводов от 06.09.2026.

**Что делаем одной фразой:** весь текст, который видит пользователь или читает скринридер, уезжает в словарь и переводится на пять языков. Найдено 3 мёртвых ключа и 105 строк мимо словаря в 20 файлах.

**Критерий, по которому решает не агент, а заказчик:** *текст виден пользователю или его читает скринридер → переводим.* Всё остальное (комментарии, коды, имена файлов, `data-*`, CSS) остаётся английским.

---

> ⚠️ **Пять правил эпика. Прочитать до первой строки кода.**
>
> **1. Здесь нечего решать.** В каждой задаче написано, какой файл открыть, какой блок вырезать и какой вставить. Английские тексты даны целиком, для четырёх других языков дана терминология. Если кажется, что можно иначе — нельзя.
>
> **2. У тебя есть детектор.** `npm run i18n` печатает список того, что осталось. Он же — критерий приёмки: в T-182 он должен вывести «нет» в обоих разделах. Не ищи пропуски глазами, запускай его.
>
> **3. Сборка зелёная после каждой задачи:**
> ```bash
> npx tsc --noEmit && npm run build
> ```
> Компилятор — твой главный помощник: все ключи словаря типизированы, и если ты добавил ключ в `types/i18n.ts` и забыл в одном из пяти словарей, сборка упадёт с точным указанием файла.
>
> **4. Один коммит на задачу, сразу.** Формат: `T-1XX: краткое описание`.
>
> **5. Порядок строгий, по номерам.** T-172 обязана быть раньше T-174 (тосты используют названия размеров), T-171 раньше T-175.

---

## Порядок работы с любым словарным ключом

Каждая задача этого эпика устроена одинаково. Делай ровно так:

1. **`types/i18n.ts`** — добавить поле в интерфейс `Dictionary`.
2. **`content/i18n/dict/en.ts`** — добавить английский текст (в задаче он дан целиком).
3. **`pl.ts`, `de.ts`, `by.ts`, `uk.ts`** — перевести. Плейсхолдеры `{max}`, `{name}` не трогать, оставить в том же виде.
4. **Компонент** — заменить строку на `dict.…`, при необходимости через `fill()` из `@/lib/format`.
5. `npx tsc --noEmit` — компилятор покажет, где ключ забыт.

**Терминология для четырёх языков** (единая на весь эпик, сверяться с ней):

| Термин | pl | de | by | uk |
|---|---|---|---|---|
| кожа | skóra | Leder | скура | шкіра |
| нить | nić | Faden | нітка | нитка |
| резинка | gumka | Gummiband | гумка | гумка |
| пряжка | klamra | Schnalle | спражка | пряжка |
| тиснение | tłoczenie | Prägung | цісненне | тиснення |
| держатель ручки | uchwyt na długopis | Stiftschlaufe | трымальнік для ручкі | тримач для ручки |
| карман для карт | kieszonka na karty | Kartenfach | кішэня для картак | кишеня для карток |
| вкладыш | wkład | Einlage | укладка | вкладка |
| обложка | okładka | Hülle | вокладка | обкладинка |
| шов | szew | Naht | шво | шов |
| кадр (фото) | ujęcie | Aufnahme | кадр | кадр |
| мм / г | mm / g | mm / g | мм / г | мм / г |

---

## T-170 — Детектор пропущенных переводов

**Depends on:** —
**Estimate:** 10 мин
**Files:** `package.json`; файлы `scripts/check-i18n.mjs` и `scripts/i18n-allowlist.json` уже лежат в репозитории — их не создавать и не менять

### Business
Инструмент, которым проверяется весь эпик. Он находит две вещи: ключи словаря, которые никто не читает, и человеческий текст в коде, который не прошёл через словарь. Без npm-скрипта его неудобно запускать.

### Steps

1. В `package.json`, в блок `"scripts"`, добавить строку после `"lint"`:
   ```diff
        "lint": "next lint",
   +    "i18n": "node scripts/check-i18n.mjs",
        "shotlist": "node scripts/generate-shotlist.mjs"
   ```

2. Запустить и записать стартовое состояние:
   ```bash
   npm run i18n
   ```
   Ожидается в конце: **`Итого: 3 неиспользованных ключей, 105 строк мимо словаря.`**
   Команда завершается с кодом 1 — это правильно, пока пропуски есть.

3. Коммит.

### Do NOT
- ❌ Не править `scripts/check-i18n.mjs` — он уже проверен и работает.
- ❌ Не добавлять ничего в `scripts/i18n-allowlist.json`, чтобы «убрать» находку. В allowlist попадает только то, чего пользователь не читает как текст: имена шрифтов, коды, технические идентификаторы. Всё остальное чинится переводом.
- ❌ Не подключать `npm run i18n` к `build` — он станет обязательным только после T-182.

### Acceptance
- [ ] `npm run i18n` работает и печатает две секции
- [ ] Числа в итоге: 3 и 105

---

## T-171 — Лейблы для скринридера

**Depends on:** T-170
**Estimate:** 40 мин
**Files:** `types/i18n.ts`; 5 словарей; `components/ui/LanguageSwitcher.tsx`, `components/ui/Swatch.tsx`, `components/cart/CartDrawer.tsx`, `components/cart/ReserveBlock.tsx`, `components/configurator/Preview.tsx`, `components/configurator/SizeSelector.tsx`, `components/configurator/LeatherSelector.tsx`, `components/configurator/ColorSelector.tsx`, `components/landing/Leather.tsx`

### Business
Восемь `aria-label` и `label` английские на всех пяти языках. Их не видно глазами, но их читает вслух скринридер — для незрячего пользователя сайт наполовину английский. Плюс подпись «Made to order» в свотче, для которой перевод уже есть и работает в другом месте.

### Code

1. `types/i18n.ts` — добавить новый раздел сразу после `notFound` и перед строкой `colors: Record<…>`:

```ts
  /** Labels a screen reader announces. Not visible on screen, still user-facing. */
  a11y: {
    selectLanguage: string;
    closeCart: string;
    emailField: string;
    previewAngle: string;
    sizeGroup: string;
    leatherGroup: string;
    colorGroup: string;
    leatherTabs: string;
  };
```

2. `content/i18n/dict/en.ts` — вставить в том же месте:

```ts
  a11y: {
    selectLanguage: 'Select language',
    closeCart: 'Close cart',
    emailField: 'Email address',
    previewAngle: 'Preview angle',
    sizeGroup: 'Size',
    leatherGroup: 'Leather',
    colorGroup: 'Colour',
    leatherTabs: 'Leather types',
  },
```

3. Четыре перевода:

```ts
// pl.ts
  a11y: {
    selectLanguage: "Wybierz język",
    closeCart: "Zamknij koszyk",
    emailField: "Adres e-mail",
    previewAngle: "Ujęcie podglądu",
    sizeGroup: "Rozmiar",
    leatherGroup: "Skóra",
    colorGroup: "Kolor",
    leatherTabs: "Rodzaje skóry",
  },

// de.ts
  a11y: {
    selectLanguage: "Sprache wählen",
    closeCart: "Warenkorb schließen",
    emailField: "E-Mail-Adresse",
    previewAngle: "Ansicht der Vorschau",
    sizeGroup: "Größe",
    leatherGroup: "Leder",
    colorGroup: "Farbe",
    leatherTabs: "Lederarten",
  },

// by.ts
  a11y: {
    selectLanguage: "Выберыце мову",
    closeCart: "Закрыць кошык",
    emailField: "Адрас электроннай пошты",
    previewAngle: "Ракурс перадпрагляду",
    sizeGroup: "Памер",
    leatherGroup: "Скура",
    colorGroup: "Колер",
    leatherTabs: "Віды скуры",
  },

// uk.ts
  a11y: {
    selectLanguage: "Оберіть мову",
    closeCart: "Закрити кошик",
    emailField: "Адреса електронної пошти",
    previewAngle: "Ракурс перегляду",
    sizeGroup: "Розмір",
    leatherGroup: "Шкіра",
    colorGroup: "Колір",
    leatherTabs: "Види шкіри",
  },
```

4. Девять замен в компонентах:

| Файл | Было | Стало |
|---|---|---|
| `ui/LanguageSwitcher.tsx` | `aria-label="Select language"` | `aria-label={dict.a11y.selectLanguage}` |
| `cart/CartDrawer.tsx` | `aria-label="Close"` | `aria-label={dict.a11y.closeCart}` |
| `cart/ReserveBlock.tsx` | `aria-label="Email"` | `aria-label={dict.a11y.emailField}` |
| `configurator/Preview.tsx` | `aria-label="Preview angle"` | `aria-label={dict.a11y.previewAngle}` |
| `configurator/SizeSelector.tsx` | `label="Size"` | `label={dict.a11y.sizeGroup}` |
| `configurator/LeatherSelector.tsx` | `label="Leather"` | `label={dict.a11y.leatherGroup}` |
| `configurator/ColorSelector.tsx` | `label="Colour"` | `label={dict.a11y.colorGroup}` |
| `landing/Leather.tsx` | `aria-label="Leather types"` | `aria-label={dict.a11y.leatherTabs}` |

⚠️ `LanguageSwitcher.tsx` берёт словарь из `useI18n()`. Проверить, что `const { dict } = useI18n();` в нём уже есть; если нет — добавить.

5. `components/ui/Swatch.tsx` — подпись «Made to order». Компонент не знает про словарь, поэтому текст приходит пропсом. Добавить в `SwatchProps` поле:
   ```ts
     /** Localised "made to order" caption. Shown when state is 'made-to-order'. */
     madeToOrderLabel?: string;
   ```
   добавить `madeToOrderLabel` в список аргументов функции и заменить строку:
   ```diff
   -      {state === 'made-to-order' && (
   -        <span className="text-center text-[10px] leading-tight text-muted">Made to order</span>
   -      )}
   +      {state === 'made-to-order' && madeToOrderLabel && (
   +        <span className="text-center text-[10px] leading-tight text-muted">{madeToOrderLabel}</span>
   +      )}
   ```

6. `components/configurator/ColorSelector.tsx` — передать подпись. В `items = colorList.map(...)`, в ветке `state.kind === 'available'`, добавить поле после `state`:
   ```ts
        madeToOrderLabel: dict.configurator.madeToOrder,
   ```

7. `npx tsc --noEmit && npm run build`, `npm run i18n` — из списка должны исчезнуть все девять строк. Коммит.

### Acceptance
- [ ] `npm run i18n` больше не показывает `Select language`, `Close`, `Email`, `Preview angle`, `Size`, `Leather`, `Colour`, `Leather types`, `Made to order`
- [ ] `npm run build` зелёная

---

## T-172 — Названия размеров

**Depends on:** T-171
**Estimate:** 30 мин
**Files:** `types/i18n.ts`; 5 словарей; `components/configurator/SizeSelector.tsx`, `components/landing/Sizes.tsx`, `components/cart/CartDrawer.tsx`, `components/schematic/SizeDiagram.tsx`

### Business
«A6 Pocket», «B6 Compact», «Standard», «A5 Large» приходят из `content/sizes.ts` и показываются в конструкторе, в карточках лендинга, в корзине и на схеме габаритов — на всех пяти языках по-английски. Коды форматов (A6, B6, A5) международные и не переводятся, а слова рядом с ними — да.

### Code

1. `types/i18n.ts` — в раздел `sizes`, после `useCases`, добавить:
   ```ts
     names: Record<SizeCode, string>;
   ```

2. Пять словарей, блок `sizes`, рядом с `useCases`:

```ts
// en.ts
    names: {
      a6: 'A6 Pocket',
      b6: 'B6 Compact',
      standard: 'Standard',
      a5: 'A5 Large',
    },

// pl.ts
    names: {
      a6: "A6 Kieszonkowy",
      b6: "B6 Kompaktowy",
      standard: "Standard",
      a5: "A5 Duży",
    },

// de.ts
    names: {
      a6: "A6 Taschenformat",
      b6: "B6 Kompakt",
      standard: "Standard",
      a5: "A5 Groß",
    },

// by.ts
    names: {
      a6: "A6 Кішэнны",
      b6: "B6 Кампактны",
      standard: "Стандарт",
      a5: "A5 Вялікі",
    },

// uk.ts
    names: {
      a6: "A6 Кишеньковий",
      b6: "B6 Компактний",
      standard: "Стандарт",
      a5: "A5 Великий",
    },
```

3. Четыре замены в компонентах:

   `configurator/SizeSelector.tsx`
   ```diff
   -          title: s.name,
   +          title: dict.sizes.names[s.code],
   ```

   `landing/Sizes.tsx`
   ```diff
   -              <h3 className="mb-1 text-lg">{s.name}</h3>
   +              <h3 className="mb-1 text-lg">{dict.sizes.names[s.code]}</h3>
   ```

   `cart/CartDrawer.tsx` — два места:
   ```diff
   -    `${sizes[c.size].name} · ${dict.leatherNames[c.leather]} · ${dict.colors[c.color]}`,
   +    `${dict.sizes.names[c.size]} · ${dict.leatherNames[c.leather]} · ${dict.colors[c.color]}`,
   ```
   ```diff
   -            {sizes[c.size].name}
   +            {dict.sizes.names[c.size]}
   ```
   После этого проверить, используется ли ещё импорт `sizes` в `CartDrawer.tsx`. Если нет — удалить строку `import { sizes } from '@/lib/data';`.

   `schematic/SizeDiagram.tsx` — компонент не знает про словарь. Добавить в `Props` поле:
   ```ts
     /** Localised size names, keyed by size code. */
     names: Record<SizeCode, string>;
   ```
   добавить `names` в аргументы функции и заменить два обращения:
   ```diff
   -          : `Size diagram: ${sizes[active].name}, ${formatDimensions(sizes[active].coverMm)}`
   +          : `Size diagram: ${names[active]}, ${formatDimensions(sizes[active].coverMm)}`
   ```
   ```diff
   -              {s.name}
   +              {names[s.code]}
   ```
   ⚠️ Строку `Size diagram:` в этой задаче **не переводить** — её чинит T-175.

4. Два вызова `SizeDiagram` получают новый пропс:

   `configurator/Preview.tsx`
   ```diff
   -        <SizeDiagram active={config.size} mode="single" />
   +        <SizeDiagram active={config.size} mode="single" names={dict.sizes.names} />
   ```

   `landing/Sizes.tsx`
   ```diff
   -          <SizeDiagram active="a5" mode="compare" />
   +          <SizeDiagram active="a5" mode="compare" names={dict.sizes.names} />
   ```

5. `npx tsc --noEmit && npm run build`, коммит.

### Do NOT
- ❌ Не удалять поле `name` из `content/sizes.ts` — оно остаётся английским значением по умолчанию, как у цветов и кож.
- ❌ Не переводить коды форматов: «A6» остаётся «A6» во всех языках.

### Acceptance
- [ ] На `/pl/configurator` карточки размеров подписаны «A6 Kieszonkowy» и так далее
- [ ] В корзине и на лендинге название размера на языке страницы
- [ ] `npm run build` зелёная

---

## T-173 — Единицы измерения

**Depends on:** T-172
**Estimate:** 30 мин
**Files:** `types/i18n.ts`; 5 словарей; `lib/format.ts`; `components/landing/Sizes.tsx`, `components/landing/Leather.tsx`, `components/configurator/SizeSelector.tsx`, `components/configurator/LeatherSelector.tsx`, `components/schematic/SizeDiagram.tsx`

### Business
`148 × 210 mm`, `210 g`, `1.8 mm` — единицы английские на всех языках. Для белорусского и украинского это `мм` и `г`. Расхождение уже видно: в подписи держателя ручки словарь пишет «Ø 10–13 мм», а рядом габариты — «155 × 220 mm».

### Code

1. `types/i18n.ts` — добавить раздел рядом с `a11y`:
   ```ts
     /** Measurement units. Latin for en/pl/de, Cyrillic for by/uk. */
     units: {
       mm: string;
       g: string;
     };
   ```

2. Пять словарей:
   ```ts
   // en.ts, pl.ts, de.ts
     units: { mm: 'mm', g: 'g' },
   // by.ts, uk.ts
     units: { mm: "мм", g: "г" },
   ```

3. `lib/format.ts` — три функции получают необязательный суффикс. Заменить их целиком:

```ts
/** [148, 210] -> "148 × 210 mm" */
export function formatDimensions([w, h]: [number, number], unit = 'mm'): string {
  return `${w} × ${h} ${unit}`;
}

/** 210 -> "210 g" */
export function formatWeight(grams: number, unit = 'g'): string {
  return `${grams} ${unit}`;
}

/** 1.8 -> "1.8 mm" */
export function formatThickness(mm: number, unit = 'mm'): string {
  return `${mm} ${unit}`;
}
```

4. Шесть вызовов получают вторым аргументом единицу из словаря:

   | Файл | Было | Стало |
   |---|---|---|
   | `landing/Sizes.tsx` | `formatDimensions(s.coverMm)` | `formatDimensions(s.coverMm, dict.units.mm)` |
   | `landing/Sizes.tsx` | `formatWeight(s.weightG)` | `formatWeight(s.weightG, dict.units.g)` |
   | `landing/Leather.tsx` | `formatThickness(l.thicknessMm)` | `formatThickness(l.thicknessMm, dict.units.mm)` |
   | `configurator/SizeSelector.tsx` | `formatDimensions(s.coverMm)` | `formatDimensions(s.coverMm, dict.units.mm)` |
   | `configurator/LeatherSelector.tsx` | `formatThickness(l.thicknessMm)` | `formatThickness(l.thicknessMm, dict.units.mm)` |
   | `schematic/SizeDiagram.tsx` | `formatDimensions(...)` — два места | см. пункт 5 |

5. `schematic/SizeDiagram.tsx` — добавить в `Props` ещё одно поле:
   ```ts
     /** Localised millimetre unit. */
     mmUnit: string;
   ```
   добавить `mmUnit` в аргументы функции, заменить оба вызова `formatDimensions(x)` на `formatDimensions(x, mmUnit)`, и передать пропс из двух мест вызова:
   ```diff
   -        <SizeDiagram active={config.size} mode="single" names={dict.sizes.names} />
   +        <SizeDiagram active={config.size} mode="single" names={dict.sizes.names} mmUnit={dict.units.mm} />
   ```
   ```diff
   -          <SizeDiagram active="a5" mode="compare" names={dict.sizes.names} />
   +          <SizeDiagram active="a5" mode="compare" names={dict.sizes.names} mmUnit={dict.units.mm} />
   ```

6. `npx tsc --noEmit && npm run build`, коммит.

### Do NOT
- ❌ Не трогать `formatPrice` — «zł» это код валюты, он одинаков во всех локалях.
- ❌ Не менять `THREAD_THICKNESS_MM` и другие числа в данных.

### Acceptance
- [ ] На `/uk` габариты подписаны «155 × 220 мм», вес «210 г»
- [ ] На `/de` остались «mm» и «g»
- [ ] `npm run build` зелёная

---

## T-174 — Тосты и причины недоступности

**Depends on:** T-172
**Estimate:** 1–1.5ч
**Files:** `types/i18n.ts`; 5 словарей; `lib/availability.ts`; создать `components/configurator/change-message.ts`; `components/configurator/useConfigurator.ts`, `components/configurator/ColorSelector.tsx`, `components/configurator/LeatherSelector.tsx`

### Business
Когда конструктор сам меняет цвет или срезает количество карманов, он показывает тост — по-английски на всех языках. Причина в том, что `lib/availability.ts` собирает готовую фразу, а про локаль он не знает и знать не должен. Меняем так: `lib/` возвращает **что** изменилось кодами, а фразу собирает компонент, у которого есть словарь.

### Code

1. `lib/availability.ts` — заменить тип `OptionState` и добавить тип изменения:

```ts
export type OptionState =
  | { kind: 'available'; status: 'in_stock' | 'made_to_order' }
  | { kind: 'unavailable' }
  | { kind: 'not-in-leather' };

/**
 * What the resolver changed, in codes. The wording lives in the dictionary:
 * lib/ must not know which language the page is in.
 */
export type ConfigChange =
  | { kind: 'leather'; to: LeatherCode; from: LeatherCode }
  | { kind: 'color'; to: ColorCode; from: ColorCode; leather: LeatherCode }
  | { kind: 'inserts'; max: number; size: SizeCode }
  | { kind: 'cardSlots'; max: number; size: SizeCode };
```

2. Там же — убрать английские строки из трёх функций:

```ts
export function getColorState(leather: LeatherCode, color: ColorCode): OptionState {
  if (!isColorInLeather(leather, color)) return { kind: 'not-in-leather' };
  const s = getStock(leather, color);
  if (s === 'unavailable') return { kind: 'unavailable' };
  return { kind: 'available', status: s };
}

export function getLeatherState(leather: LeatherCode, size: SizeCode): OptionState {
  if (!isSizeAvailableInLeather(leather, size)) return { kind: 'not-in-leather' };
  return { kind: 'available', status: 'in_stock' };
}
```

3. Там же — `ResolveResult` и четыре `changes.push`:

```ts
export interface ResolveResult {
  config: Configuration;
  /** What was changed and why, in codes. Empty if nothing changed. */
  changes: ConfigChange[];
}
```
```diff
-      changes.push(
-        `Leather changed to ${fallback.name} — ${leathers[leather].name} is not made in this size`,
-      );
+      changes.push({ kind: 'leather', to: fallback.code, from: leather });
```
```diff
-      changes.push(
-        `Colour changed to ${colors[replacement].name} — ${colors[color].name} is not available in ${leathers[leather].name}`,
-      );
+      changes.push({ kind: 'color', to: replacement, from: color, leather });
```
```diff
-    changes.push(`Inserts reduced to ${capacity} — ${sizes[size].name} holds no more`);
+    changes.push({ kind: 'inserts', max: capacity, size });
```
```diff
-    changes.push(`Card slots reduced to ${maxSlots} — ${sizes[size].name} holds no more`);
+    changes.push({ kind: 'cardSlots', max: maxSlots, size });
```
⚠️ После этого импорт `colors` в `lib/availability.ts` может остаться нужным для `findClosestColor` — проверить и удалить только то, что компилятор пометит как неиспользуемое.

4. `types/i18n.ts` — новый раздел рядом с `a11y`:

```ts
  /** Messages the configurator shows when it changes the selection itself. */
  conflicts: {
    /** {to}, {from} */
    leatherChanged: string;
    /** {to}, {from}, {leather} */
    colorChanged: string;
    /** {max}, {size} */
    insertsReduced: string;
    /** {max}, {size} */
    cardSlotsReduced: string;
    /** {leather} */
    colorNotInLeather: string;
    colorOutOfStock: string;
    leatherNotInSize: string;
  };
```

5. Пять словарей:

```ts
// en.ts
  conflicts: {
    leatherChanged: 'Leather changed to {to} — {from} is not made in this size',
    colorChanged: 'Colour changed to {to} — {from} is not available in {leather}',
    insertsReduced: 'Inserts reduced to {max} — {size} holds no more',
    cardSlotsReduced: 'Card slots reduced to {max} — {size} holds no more',
    colorNotInLeather: 'Not available in {leather}',
    colorOutOfStock: 'Currently unavailable',
    leatherNotInSize: 'Not available in this size',
  },

// pl.ts
  conflicts: {
    leatherChanged: "Skóra zmieniona na {to} — {from} nie jest wykonywana w tym rozmiarze",
    colorChanged: "Kolor zmieniony na {to} — {from} nie jest dostępny w skórze {leather}",
    insertsReduced: "Liczba wkładów zmniejszona do {max} — {size} nie pomieści więcej",
    cardSlotsReduced: "Liczba kieszonek zmniejszona do {max} — {size} nie pomieści więcej",
    colorNotInLeather: "Niedostępny w skórze {leather}",
    colorOutOfStock: "Chwilowo niedostępny",
    leatherNotInSize: "Niedostępna w tym rozmiarze",
  },

// de.ts
  conflicts: {
    leatherChanged: "Leder auf {to} geändert — {from} wird in dieser Größe nicht gefertigt",
    colorChanged: "Farbe auf {to} geändert — {from} ist in {leather} nicht verfügbar",
    insertsReduced: "Einlagen auf {max} reduziert — mehr passt in {size} nicht",
    cardSlotsReduced: "Kartenfächer auf {max} reduziert — mehr passt in {size} nicht",
    colorNotInLeather: "In {leather} nicht verfügbar",
    colorOutOfStock: "Derzeit nicht verfügbar",
    leatherNotInSize: "In dieser Größe nicht verfügbar",
  },

// by.ts
  conflicts: {
    leatherChanged: "Скура зменена на {to} — {from} не робіцца ў гэтым памеры",
    colorChanged: "Колер зменены на {to} — {from} недаступны ў скуры {leather}",
    insertsReduced: "Колькасць укладак зменшана да {max} — у памеры {size} больш не змяшчаецца",
    cardSlotsReduced: "Колькасць кішэняў зменшана да {max} — у памеры {size} больш не змяшчаецца",
    colorNotInLeather: "Недаступны ў скуры {leather}",
    colorOutOfStock: "Часова недаступны",
    leatherNotInSize: "Недаступная ў гэтым памеры",
  },

// uk.ts
  conflicts: {
    leatherChanged: "Шкіру змінено на {to} — {from} не виготовляється в цьому розмірі",
    colorChanged: "Колір змінено на {to} — {from} недоступний у шкірі {leather}",
    insertsReduced: "Кількість вкладок зменшено до {max} — у розмірі {size} більше не вміщується",
    cardSlotsReduced: "Кількість кишень зменшено до {max} — у розмірі {size} більше не вміщується",
    colorNotInLeather: "Недоступний у шкірі {leather}",
    colorOutOfStock: "Тимчасово недоступний",
    leatherNotInSize: "Недоступна в цьому розмірі",
  },
```

6. Создать `components/configurator/change-message.ts` целиком:

```ts
// components/configurator/change-message.ts
// Turns a ConfigChange (codes) into a sentence in the current language.
// Lives here and not in lib/, because lib/ knows nothing about locales.
import type { ConfigChange } from '@/lib/availability';
import type { Dictionary } from '@/types/i18n';
import { fill } from '@/lib/format';

export function changeMessage(change: ConfigChange, dict: Dictionary): string {
  switch (change.kind) {
    case 'leather':
      return fill(dict.conflicts.leatherChanged, {
        to: dict.leatherNames[change.to],
        from: dict.leatherNames[change.from],
      });
    case 'color':
      return fill(dict.conflicts.colorChanged, {
        to: dict.colors[change.to],
        from: dict.colors[change.from],
        leather: dict.leatherNames[change.leather],
      });
    case 'inserts':
      return fill(dict.conflicts.insertsReduced, {
        max: change.max,
        size: dict.sizes.names[change.size],
      });
    case 'cardSlots':
      return fill(dict.conflicts.cardSlotsReduced, {
        max: change.max,
        size: dict.sizes.names[change.size],
      });
  }
}
```

7. `components/configurator/useConfigurator.ts` — добавить два импорта и заменить одну строку:
   ```diff
   +import { useI18n } from '@/components/i18n/I18nProvider';
   +import { changeMessage } from './change-message';
   ```
   ```diff
      const { showToast } = useToast();
   +  const { dict } = useI18n();
   ```
   ```diff
   -      changes.forEach((message) => showToast(message));
   +      changes.forEach((change) => showToast(changeMessage(change, dict)));
   ```
   и добавить `dict` в массив зависимостей `useCallback` рядом с `showToast`.

8. `components/configurator/ColorSelector.tsx` — причина недоступности берётся из словаря:
   ```diff
        return {
          value: c.code,
          label: localizedColorName,
          hex: c.hex,
          state: 'disabled' as const,
   -      note: state.reason,
   +      note:
   +        state.kind === 'not-in-leather'
   +          ? fill(dict.conflicts.colorNotInLeather, { leather: dict.leatherNames[config.leather] })
   +          : dict.conflicts.colorOutOfStock,
        };
   ```
   и добавить `fill` в импорт из `@/lib/format` (если импорта нет — создать: `import { fill } from '@/lib/format';`).

9. `components/configurator/LeatherSelector.tsx`:
   ```diff
   -            disabledReason: disabled ? state.reason : undefined,
   +            disabledReason: disabled ? dict.conflicts.leatherNotInSize : undefined,
   ```

10. `npx tsc --noEmit && npm run build`, коммит.

### Проверка руками
Сейчас все кожи доступны во всех размерах и цветах, поэтому тосты подстановки кожи и цвета не воспроизводятся. Проверяются два оставшихся:

| Ссылка | Ожидание на `/uk/` |
|---|---|
| `/uk/configurator?size=a6&inserts=4:dot,4:plain` | тост «Кількість вкладок зменшено до 2 — у розмірі A6 Кишеньковий більше не вміщується» |
| `/uk/configurator?size=a6&cards=4` | тост про кишені на украинском |

### Do NOT
- ❌ Не добавлять `dict` или локаль в `lib/availability.ts`. Это чистая функция, она остаётся такой.
- ❌ Не оставлять поле `reason` в `OptionState` «на всякий случай».

### Acceptance
- [ ] В `lib/availability.ts` нет ни одной английской фразы
- [ ] Оба тоста из таблицы на украинском
- [ ] `npm run build` зелёная

---

## T-175 — Подписи на чертеже

**Depends on:** T-173
**Estimate:** 1.5–2ч
**Files:** `types/i18n.ts`; 5 словарей; `content/shots.ts`; `lib/data.ts`; `components/schematic/schematic-parts.tsx`, `components/schematic/SchematicCover.tsx`, `components/schematic/views/FrontView.tsx`, `BackView.tsx`, `OpenView.tsx`, `DetailView.tsx`, `components/schematic/SizeDiagram.tsx`

### Business
Самое заметное расхождение на сайте: свотч цвета подписан «Koniak», а чип на чертеже рядом — «Cognac». Плюс все выноски, подписи фурнитуры и четыре `aria-label`, которые читает скринридер, английские.

`SchematicCover` сейчас серверный компонент, но все четыре места, откуда он вызывается (`Preview`, `CartDrawer`, `ShotMatrix`, `Leather`), — клиентские. Поэтому директива `'use client'` ничего не ломает и даёт доступ к словарю.

### Code

1. `types/i18n.ts` — новый раздел рядом с `a11y`:

```ts
  /** Text drawn inside the technical drawings and read out by screen readers. */
  schematic: {
    note: string;
    /** {leather}, {color} */
    frontAria: string;
    backAria: string;
    openAria: string;
    /** {leather} */
    detailAria: string;
    elasticFront: string;
    buckleFront: string;
    elasticKnot: string;
    elasticHoles: string;
    buckleBack: string;
    noClosure: string;
    /** {max} */
    penLoopSlim: string;
    /** {min}, {max} */
    penLoopWide: string;
    /** {count} */
    cardSlots: string;
    burnishedEdge: string;
    /** {mm} */
    threadDetail: string;
    /** {name}, {dimensions} */
    sizeDiagramSingle: string;
    sizeDiagramCompare: string;
    phone: string;
  };
```

2. `content/i18n/dict/en.ts`:

```ts
  schematic: {
    note: 'SCHEMATIC DRAWING — not a photograph. Colours are approximate.',
    frontAria: 'Technical drawing: {leather} cover in {color}, front view',
    backAria: 'Technical drawing: {leather} cover in {color}, back view',
    openAria: 'Technical drawing: {leather} cover in {color}, opened flat',
    detailAria: 'Macro technical drawing: {leather} stitched corner',
    elasticFront: 'elastic band runs around the cover; knot is on the back',
    buckleFront: 'solid brass buckle, strap in the cover leather',
    elasticKnot: 'elastic knot on the outside — visible on the finished cover',
    elasticHoles: 'two holes stay even if the band is ever removed',
    buckleBack: 'strap anchored here, wraps around the fore-edge',
    noClosure: 'no closure — no holes, no hardware',
    penLoopSlim: 'pen loop Ø up to {max} mm',
    penLoopWide: 'pen loop Ø {min}–{max} mm',
    cardSlots: 'card slots × {count}, inside the front cover',
    burnishedEdge: 'burnished edge',
    threadDetail: '{mm} mm thread, saddle stitch',
    sizeDiagramSingle: 'Size diagram: {name}, {dimensions}',
    sizeDiagramCompare: 'Size comparison of all four notebook formats, drawn to scale next to a phone',
    phone: 'Phone',
  },
```

3. Перевести на `pl`, `de`, `by`, `uk` по терминологии из шапки файла. Плейсхолдеры `{leather}`, `{color}`, `{min}`, `{max}`, `{count}`, `{mm}`, `{name}`, `{dimensions}` оставить как есть. В `by` и `uk` в `penLoopSlim`/`penLoopWide`/`threadDetail` единица пишется как «мм».

4. `content/shots.ts` — удалить строку с константой:
   ```diff
   -/** Text shown on every schematic so it cannot be misread as a finished photo */
   -export const SCHEMATIC_NOTE = 'SCHEMATIC DRAWING — not a photograph. Colours are approximate.';
   ```

5. `lib/data.ts` — убрать её же из реэкспорта:
   ```diff
      globalShotRules,
   -  SCHEMATIC_NOTE,
    } from '@/content/shots';
   ```

6. `components/schematic/schematic-parts.tsx` — словарь приходит аргументом. Заменить сигнатуру и три места:
   ```diff
   -import { leathers, colors, threadHex, elasticColors, penHolders, SCHEMATIC_NOTE } from '@/lib/data';
   +import { leathers, colors, threadHex, elasticColors, penHolders } from '@/lib/data';
   +import type { Dictionary } from '@/types/i18n';
   +import { fill } from '@/lib/format';
   ```
   ```diff
   -export function schematicParts(config: Configuration): SchematicParts {
   +export function schematicParts(config: Configuration, dict: Dictionary): SchematicParts {
   ```
   в возвращаемом объекте:
   ```diff
   -    leatherName: leather.name,
   -    colorName: color.name,
   +    leatherName: dict.leatherNames[config.leather],
   +    colorName: dict.colors[config.color],
   ```
   ```diff
   -    penLabel:
   -      config.penHolder === 'wide'
   -        ? `pen loop Ø ${penDef.minMm}–${penDef.maxMm} mm`
   -        : `pen loop Ø up to ${penDef.maxMm} mm`,
   +    penLabel:
   +      config.penHolder === 'wide'
   +        ? fill(dict.schematic.penLoopWide, { min: penDef.minMm, max: penDef.maxMm })
   +        : fill(dict.schematic.penLoopSlim, { max: penDef.maxMm }),
   ```
   в интерфейс `ViewProps` добавить поле:
   ```ts
     dict: Dictionary;
   ```
   и в компоненте `Notes` заменить константу на пропс — сигнатура становится:
   ```diff
   -export function Notes({ lines }: { lines: string[] }) {
   +export function Notes({ lines, note }: { lines: string[]; note: string }) {
   ```
   ```diff
   -      <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
   +      <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{note}</text>
   ```

7. `components/schematic/SchematicCover.tsx` — первой строкой файла добавить `'use client';`, взять словарь и передать его дальше:
   ```diff
   +'use client';
   +
    import type { Configuration, Angle } from '@/types/config';
    import { previewFilename } from '@/lib/assets';
   +import { useI18n } from '@/components/i18n/I18nProvider';
    import { schematicParts } from './schematic-parts';
   ```
   ```diff
    export default function SchematicCover({ config, angle, compact = false }: Props) {
   +  const { dict } = useI18n();
      const View = views[angle];
   -  const parts = schematicParts(config);
   +  const parts = schematicParts(config, dict);

      return (
        <div className="w-full">
   -      <View config={config} compact={compact} parts={parts} />
   +      <View config={config} compact={compact} parts={parts} dict={dict} />
   ```

8. Четыре вида. В каждом добавить `dict` в деструктуризацию пропсов и заменить английские строки:

   `views/FrontView.tsx`
   ```diff
   -export default function FrontView({ config, compact, parts }: ViewProps) {
   +export default function FrontView({ config, compact, parts, dict }: ViewProps) {
   ```
   ```diff
   -  if (hasElastic) notes.push('elastic band runs around the cover; knot is on the back');
   -  if (hasBuckle) notes.push('solid brass buckle, strap in the cover leather');
   +  if (hasElastic) notes.push(dict.schematic.elasticFront);
   +  if (hasBuckle) notes.push(dict.schematic.buckleFront);
   ```
   ```diff
   -  if (notes.length === 0) notes.push(...angleSpecs.front.mustShow.slice(0, 3));
   +  if (notes.length === 0) notes.push(...dict.shotlist.angleMustShow.front.slice(0, 3));
   ```
   ⚠️ Строка выше ссылается на ключ, который заводит **T-179**. Пока T-179 не сделана, оставить `angleSpecs.front.mustShow`, а эту правку выполнить в T-179. В остальном задача независима.
   ```diff
   -         aria-label={`Technical drawing: ${parts.leatherName} cover in ${parts.colorName}, front view`}>
   +         aria-label={fill(dict.schematic.frontAria, { leather: parts.leatherName, color: parts.colorName })}>
   ```
   ```diff
   -      {!compact && <Notes lines={notes} />}
   +      {!compact && <Notes lines={notes} note={dict.schematic.note} />}
   ```
   добавить импорт `import { fill } from '@/lib/format';`

   `views/BackView.tsx` — то же самое:
   ```diff
   -    notes.push('elastic knot on the outside — visible on the finished cover');
   -    notes.push('two holes stay even if the band is ever removed');
   +    notes.push(dict.schematic.elasticKnot);
   +    notes.push(dict.schematic.elasticHoles);
   ```
   ```diff
   -  if (hasBuckle) notes.push('strap anchored here, wraps around the fore-edge');
   +  if (hasBuckle) notes.push(dict.schematic.buckleBack);
   ```
   ```diff
   -  if (notes.length === 0) notes.push('no closure — no holes, no hardware');
   +  if (notes.length === 0) notes.push(dict.schematic.noClosure);
   ```
   плюс `aria-label` через `fill(dict.schematic.backAria, …)` и `<Notes … note={dict.schematic.note} />`.

   `views/OpenView.tsx`
   ```diff
   -         aria-label={`Technical drawing: ${parts.leatherName} cover in ${parts.colorName}, opened flat`}>
   +         aria-label={fill(dict.schematic.openAria, { leather: parts.leatherName, color: parts.colorName })}>
   ```
   ```diff
   -            → card slots × {config.cardSlots}, inside the front cover
   +            → {fill(dict.schematic.cardSlots, { count: config.cardSlots })}
   ```
   ```diff
   -        <text x="20" y="286" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
   +        <text x="20" y="286" fontSize="9.5" fontWeight="600" fill={ALERT}>{dict.schematic.note}</text>
   ```
   ⚠️ Строка с `angleSpecs.open.mustShow` — как во `FrontView`, переносится в T-179.

   `views/DetailView.tsx`
   ```diff
   -         aria-label={`Macro technical drawing: ${parts.leatherName} stitched corner`}>
   +         aria-label={fill(dict.schematic.detailAria, { leather: parts.leatherName })}>
   ```
   ```diff
   -          <text x="20" y="292" fontSize="9.5" fill={MUTED}>burnished edge</text>
   +          <text x="20" y="292" fontSize="9.5" fill={MUTED}>{dict.schematic.burnishedEdge}</text>
   ```
   ```diff
   -          <text x="20" y="228" fontSize="9.5" fill={MUTED}>0.5 mm thread, saddle stitch</text>
   +          <text x="20" y="228" fontSize="9.5" fill={MUTED}>
   +            {fill(dict.schematic.threadDetail, { mm: THREAD_THICKNESS_MM })}
   +          </text>
   ```
   ```diff
   -          <text x="20" y="372" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
   +          <text x="20" y="372" fontSize="9.5" fontWeight="600" fill={ALERT}>{dict.schematic.note}</text>
   ```
   добавить импорты `fill` и `THREAD_THICKNESS_MM` (последний — из `@/lib/data`).

9. `components/schematic/SizeDiagram.tsx` — добавить в `Props` поле `aria` и заменить два места:
   ```ts
     /** Localised aria-label texts: { single, compare } */
     aria: { single: string; compare: string };
     /** Localised word for the phone silhouette. */
     phoneLabel: string;
   ```
   ```diff
          aria-label={
            mode === 'compare'
   -          ? 'Size comparison of all four notebook formats, drawn to scale next to a phone'
   -          : `Size diagram: ${names[active]}, ${formatDimensions(sizes[active].coverMm, mmUnit)}`
   +          ? aria.compare
   +          : fill(aria.single, {
   +              name: names[active],
   +              dimensions: formatDimensions(sizes[active].coverMm, mmUnit),
   +            })
          }
   ```
   ```diff
   -          Phone
   +          {phoneLabel}
   ```
   Два места вызова получают новые пропсы:
   ```tsx
   aria={{ single: dict.schematic.sizeDiagramSingle, compare: dict.schematic.sizeDiagramCompare }}
   phoneLabel={dict.schematic.phone}
   ```

10. `npx tsc --noEmit && npm run build`, коммит.

### Проверка руками
| Ссылка | Ожидание |
|---|---|
| `/pl/configurator?color=cognac` | чип на чертеже подписан «Koniak», как и свотч |
| `/uk/configurator?pen=wide` | выноска «петля для ручки Ø 10–13 мм» на украинском |
| `/de/configurator?closure=none` → вкладка Back | немецкая строка про отсутствие застёжки |
| `/by/configurator?cards=3` → вкладка Open | подпись про кішэні на белорусском |

### Do NOT
- ❌ Не менять ни одной координаты, цвета или размера шрифта в SVG. Меняется только текст.
- ❌ Не добавлять `'use client'` в `schematic-parts.tsx` и в файлы видов — директива нужна только в `SchematicCover.tsx`, остальные попадают в клиентский бандл через него.

### Acceptance
- [ ] Все четыре строки из таблицы проверены
- [ ] `npm run i18n` больше не показывает строки из `views/` и `schematic-parts.tsx`
- [ ] `npm run build` зелёная

---

## T-176 — Alt-тексты иллюстраций

**Depends on:** T-175
**Estimate:** 25 мин
**Files:** `types/i18n.ts`; 5 словарей; `components/landing/Illustration.tsx`

### Business
Три alt-текста у SVG-иллюстраций лендинга. Их читает скринридер и видит поисковик — на всех пяти языках по-английски.

### Code

1. `types/i18n.ts` — рядом с `a11y`:
   ```ts
     /** Alt text of the landing illustrations. */
     illustrations: {
       hero: string;
       stitch: string;
       refill: string;
     };
   ```

2. `en.ts`:
   ```ts
     illustrations: {
       hero: 'A leather cover with paper inserts and an elastic band',
       stitch: 'How a hand saddle stitch locks against itself',
       refill: 'One cover, many paper refills',
     },
   ```

3. Перевести на четыре языка по терминологии из шапки.

4. `components/landing/Illustration.tsx` — первой строкой добавить `'use client';`, убрать alt из данных и брать из словаря:
   ```diff
   +'use client';
   +
    import Image from 'next/image';
    import clsx from 'clsx';
   +import { useI18n } from '@/components/i18n/I18nProvider';

    const sources = {
   -  hero: { src: '/illustrations/hero.svg', w: 600, h: 450, alt: 'A leather cover with paper inserts and an elastic band' },
   -  stitch: { src: '/illustrations/stitch.svg', w: 400, h: 320, alt: 'How a hand saddle stitch locks against itself' },
   -  refill: { src: '/illustrations/refill.svg', w: 400, h: 300, alt: 'One cover, many paper refills' },
   +  hero: { src: '/illustrations/hero.svg', w: 600, h: 450 },
   +  stitch: { src: '/illustrations/stitch.svg', w: 400, h: 320 },
   +  refill: { src: '/illustrations/refill.svg', w: 400, h: 300 },
    } as const;
   ```
   В теле компонента взять `const { dict } = useI18n();` и передать в `<Image>` `alt={dict.illustrations[name]}` вместо прежнего `alt={source.alt}` (точное имя переменной посмотреть в файле).

5. `npx tsc --noEmit && npm run build`, коммит.

### Acceptance
- [ ] В `Illustration.tsx` нет английских строк
- [ ] `npm run build` зелёная

---

## T-177 — Страница 404 на языке пользователя

**Depends on:** T-176
**Estimate:** 30 мин
**Files:** создать `app/[lang]/not-found.tsx`; `app/not-found.tsx`

### Business
Переводы `notFound.title`, `notFound.body`, `notFound.back` лежат в пяти словарях и не используются ни разу: страница 404 захардкожена по-английски. Причина — она лежит вне `[lang]`, где словаря нет. Заводим вторую, внутри локали: middleware приводит любой адрес к виду `/{локаль}/...`, поэтому именно она и будет срабатывать почти всегда.

### Code

Создать `app/[lang]/not-found.tsx` целиком:

```tsx
// app/[lang]/not-found.tsx
'use client';

import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { useI18n } from '@/components/i18n/I18nProvider';

export default function LocalizedNotFound() {
  const { dict, getLocalizedPath } = useI18n();

  return (
    <>
      <Header />
      <main className="container-content flex min-h-[50vh] flex-col items-start justify-center py-16">
        <h1 className="mb-4">{dict.notFound.title}</h1>
        <p className="mb-8 text-ink-soft">{dict.notFound.body}</p>
        <Link
          href={getLocalizedPath('/')}
          className="inline-flex h-11 items-center rounded-sm bg-accent px-6 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
        >
          {dict.notFound.back}
        </Link>
      </main>
      <Footer />
    </>
  );
}
```

`app/not-found.tsx` **оставить как есть**: он срабатывает только для адресов вне локали, где языка ещё нет, и английский там — правильный запасной вариант. Добавить в него первой строкой комментарий, чтобы это не выглядело недоделкой:

```tsx
// app/not-found.tsx
// Fallback 404 for paths outside a locale, where no dictionary is available yet.
// Localised 404 lives in app/[lang]/not-found.tsx.
```

### Steps
1. Создать файл, добавить комментарий во второй.
2. `npm run build`, открыть `/pl/nesuchaststrona` и `/uk/nemaetakoi` — заголовок и кнопка на языке страницы, шапка и футер тоже.
3. `npm run i18n` — раздел A должен стать пустым («нет»).
4. Коммит.

### Acceptance
- [ ] `npm run i18n` в разделе A печатает «нет»
- [ ] `/pl/абракадабра` показывает польский текст 404
- [ ] `npm run build` зелёная

---

## T-178 — Метаданные по локали

**Depends on:** T-177
**Estimate:** 40 мин
**Files:** `types/i18n.ts`; 5 словарей; `app/layout.tsx`, `app/[lang]/layout.tsx`, `app/[lang]/shotlist/page.tsx`

### Business
`app/layout.tsx` отдаёт английские `description` и OG-описание всем пяти локалям — их видит поисковик и превью ссылки в мессенджере. Плюс у страницы списка кадров английский `title` в статических метаданных.

### Code

1. `types/i18n.ts` — рядом с `a11y`:
   ```ts
     /** Page metadata: search results and link previews. */
     meta: {
       siteDescription: string;
       ogDescription: string;
       shotlistTitle: string;
     };
   ```

2. `en.ts`:
   ```ts
     meta: {
       siteDescription:
         'Refillable full-grain leather notebook covers, hand-stitched in Kraków. Choose size, leather, colour, closure and embossing. Ships across the EU.',
       ogDescription: 'Hand-stitched in Kraków. Built to your specification.',
       shotlistTitle: 'Shot list',
     },
   ```

3. Перевести на четыре языка.

4. `app/[lang]/layout.tsx` — добавить `generateMetadata` перед `generateStaticParams`:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    description: dict.meta.siteDescription,
    openGraph: {
      description: dict.meta.ogDescription,
      locale: lang,
    },
  };
}
```
   и добавить импорты:
   ```ts
   import type { Metadata } from 'next';
   import { getDictionary } from '@/content/i18n';
   ```

5. `app/[lang]/shotlist/page.tsx` — статический `metadata` заменить на функцию. Удалить блок:
   ```diff
   -export const metadata: Metadata = {
   -  title: 'Shot list',
   -  robots: { index: false, follow: false },
   -};
   ```
   и вставить вместо него:
   ```tsx
   export async function generateMetadata({
     params,
   }: {
     params: Promise<{ lang: string }>;
   }): Promise<Metadata> {
     const { lang } = await params;
     return {
       title: getDictionary(lang).meta.shotlistTitle,
       robots: { index: false, follow: false },
     };
   }
   ```

6. `app/layout.tsx` — английские значения остаются как запасные для страниц вне локали. Ничего не менять.

7. `npm run build`, проверить заголовки и описания:
   ```bash
   curl -s http://localhost:3000/pl | grep -o '<meta name="description"[^>]*>'
   curl -s http://localhost:3000/de | grep -o '<meta name="description"[^>]*>'
   ```
   Описания должны отличаться и быть на нужном языке.

8. Коммит.

### Acceptance
- [ ] `description` на `/pl` и `/de` разные и переведённые
- [ ] Заголовок вкладки `/uk/shotlist` на украинском
- [ ] `npm run build` зелёная

---

## T-179 — Список кадров: правила и ракурсы

**Depends on:** T-178
**Estimate:** 1–1.5ч
**Files:** `types/i18n.ts`; 5 словарей; `content/shots.ts`; `lib/shotlist.ts`; `components/shotlist/ShotMatrix.tsx`; `components/schematic/views/FrontView.tsx`, `OpenView.tsx`

### Business
Страница `/shotlist` переведена по заголовкам и кнопкам, а содержимое — семь правил съёмки и списки «что должно быть в кадре» — английское. Мастер читает именно содержимое.

### Code

1. `types/i18n.ts` — в раздел `shotlist` добавить два поля:
   ```ts
     /** Rules that apply to every product shot. */
     rules: string[];
     /** What each angle must show. */
     angleMustShow: Record<Angle, string[]>;
   ```

2. `en.ts`, раздел `shotlist`:
```ts
    rules: [
      'No elastic band, no embossing, no pen loop, no card slots and no buckle in frame — all are drawn by the site',
      'Identical angle, light, distance and background within one angle group',
      'One neutral background across the whole matrix',
      'At least 2400 px on the long side before compression',
      'No retouching of the leather texture',
      'Shoot one size only — size is shown on the site by a diagram, not by photography',
      'Deliver original files, not messenger-compressed images',
    ],
    angleMustShow: {
      front: ['Leather grain', 'Stitch line', 'Burnished edge', 'Overall silhouette'],
      back: ['Elastic knot and two holes', 'Strap anchor when a buckle is chosen', 'Pen loop on the spine'],
      open: ['How inserts attach', 'Inner side of the leather', 'Card slots when chosen'],
      detail: ['Stitch density', 'Edge finish', 'Close grain'],
    },
```

3. Перевести на четыре языка. Порядок и количество элементов в массивах сохранить.

4. `content/shots.ts` — из `AngleSpec` уходят три поля, потому что все они теперь в словаре. Заменить файл целиком:

```ts
// content/shots.ts
import type { Angle } from '@/types/config';

export interface AngleSpec {
  angle: Angle;
  /** CSS aspect-ratio value, e.g. '4 / 5' */
  ratio: string;
  /** Numeric ratio for SVG viewBox calculations: width / height */
  ratioValue: number;
}

export const angleSpecs: Record<Angle, AngleSpec> = {
  front:  { angle: 'front',  ratio: '4 / 5', ratioValue: 0.8 },
  back:   { angle: 'back',   ratio: '4 / 5', ratioValue: 0.8 },
  open:   { angle: 'open',   ratio: '4 / 3', ratioValue: 1.3333 },
  detail: { angle: 'detail', ratio: '1 / 1', ratioValue: 1 },
};

/** Photo-matrix angles. 'back' is schematic-only: the band and knot are drawn, nothing to photograph. */
export const angleList: AngleSpec[] = [angleSpecs.front, angleSpecs.open, angleSpecs.detail];

/** Tabs in the configurator preview. */
export const schematicAngleList: AngleSpec[] = [
  angleSpecs.front,
  angleSpecs.back,
  angleSpecs.open,
  angleSpecs.detail,
];
```

5. `lib/data.ts` — убрать `globalShotRules` из реэкспорта `@/content/shots` (константы больше нет).

6. `lib/shotlist.ts` — из `ProductShot` уходят `leatherName`, `colorName`, `angleName` и `mustShow`: имена теперь берутся из словаря там, где показываются. Заменить интерфейс и `getProductShots`:

```ts
export interface ProductShot {
  index: number;
  leather: LeatherCode;
  color: ColorCode;
  angle: Angle;
  ratio: string;
  filename: string;
}

export function getProductShots(): ProductShot[] {
  const shots: ProductShot[] = [];
  let index = 0;

  for (const angle of angleList) {
    for (const leather of leatherList) {
      for (const colorCode of leather.availableColors) {
        // Never shoot combinations that are not sold.
        if (getStock(leather.code, colorCode) === 'unavailable') continue;

        index += 1;
        shots.push({
          index,
          leather: leather.code,
          color: colorCode,
          angle: angle.angle,
          ratio: angle.ratio,
          filename: previewFilename(leather.code, colorCode, angle.angle),
        });
      }
    }
  }

  return shots;
}
```
   Импорты `colors` и `globalShotRules` в этом файле станут неиспользуемыми — удалить те, на которые пожалуется компилятор. Функции `toMarkdown` и `toCsv` временно сломаются: их чинит **T-181**, до тех пор закомментировать в них обращения к удалённым полям **нельзя** — вместо этого сделать T-181 сразу после T-180, как и написано в порядке.

   ⚠️ Чтобы сборка осталась зелёной уже сейчас, в этой же задаче заменить в `toMarkdown` и `toCsv` обращения `s.leatherName` → `s.leather`, `s.colorName` → `s.color`, `s.angleName` → `s.angle`. Это временно выведет коды вместо названий; человеческие названия вернёт T-181.

7. `components/shotlist/ShotMatrix.tsx` — правила и «что показать» из словаря:
   ```diff
   -import { angleList, globalShotRules, leatherList } from '@/lib/data';
   +import { angleList, leatherList } from '@/lib/data';
   ```
   ```diff
   -          {globalShotRules.map((r) => (
   +          {dict.shotlist.rules.map((r) => (
   ```
   ```diff
   -                {dict.shotlist.mustShow}: {a.mustShow.join(' · ')}
   +                {dict.shotlist.mustShow}: {dict.shotlist.angleMustShow[a.angle].join(' · ')}
   ```
   ```diff
   -                  {localizedAngleName} {dict.shotlist.viewLabel}{' '}
   +                  {dict.angles[a.angle]} {dict.shotlist.viewLabel}{' '}
   ```
   и в карточке кадра:
   ```diff
   -                      <p className="text-sm font-medium text-ink">
   -                        {dict.colors[shot.color] || shot.colorName}
   -                      </p>
   -                      <p className="text-xs text-muted">
   -                        {dict.leatherNames[shot.leather] || shot.leatherName}
   -                      </p>
   +                      <p className="text-sm font-medium text-ink">{dict.colors[shot.color]}</p>
   +                      <p className="text-xs text-muted">{dict.leatherNames[shot.leather]}</p>
   ```
   Строку `const localizedAngleName = …`, если она осталась неиспользованной, удалить.

8. `views/FrontView.tsx` и `views/OpenView.tsx` — доделать отложенные из T-175 строки:
   ```diff
   -  if (notes.length === 0) notes.push(...angleSpecs.front.mustShow.slice(0, 3));
   +  if (notes.length === 0) notes.push(...dict.shotlist.angleMustShow.front.slice(0, 3));
   ```
   ```diff
   -            → {angleSpecs.open.mustShow.join(' · ')}
   +            → {dict.shotlist.angleMustShow.open.join(' · ')}
   ```
   Импорт `angleSpecs` в этих файлах станет неиспользуемым — удалить.

9. `npx tsc --noEmit && npm run build`, коммит.

### Acceptance
- [ ] На `/pl/shotlist` семь правил съёмки по-польски
- [ ] Заголовки групп ракурсов и строка «что показать» переведены
- [ ] `npm run build` зелёная

---

## T-180 — Список кадров: одиннадцать сюжетных кадров

**Depends on:** T-179
**Estimate:** 1–1.5ч
**Files:** `types/i18n.ts`; 5 словарей; `lib/shotlist.ts`; `components/shotlist/StorySlots.tsx`

### Business
Одиннадцать сюжетных кадров описаны тремя полями каждый — что снять, как снять, зачем. Тридцать три строки, и это самая содержательная часть задания для мастера.

### Code

1. `types/i18n.ts` — в `shotlist`:
   ```ts
     /** Story shots, keyed by shot id. */
     stories: Record<string, { subject: string; requirement: string; why: string }>;
     /** {index} */
     shotNumber: string;
   ```

2. `en.ts`, раздел `shotlist`:
```ts
    shotNumber: 'Shot #{index}',
    stories: {
      'S1-hero': { subject: 'Cover held in one hand or resting on a desk', requirement: 'Warm side light, horizontal frame with space for text', why: 'Hero image — the first thing anyone sees' },
      'S2-stitch-macro': { subject: 'Macro: saddle stitch on the cover edge', requirement: 'Side light to reveal thread relief, 4–5 stitches fill the frame', why: 'Proves the stitching is done by hand' },
      'S2-grain-macro': { subject: 'Macro: full-grain leather surface', requirement: 'At least 2000 px, no retouching of the texture', why: 'Shows what full-grain actually looks like' },
      'S2-edge-macro': { subject: 'Macro: burnished edge', requirement: 'Raking light along the edge', why: 'Edge finish is the clearest sign of skill' },
      'S4-leather-smooth': { subject: 'Macro: smooth leather grain', requirement: 'Flat even light, square frame', why: 'Leather comparison section' },
      'S4-leather-croc': { subject: 'Macro: croc-embossed relief, raking light', requirement: 'Flat even light plus one raking light, square frame, same distance as the others', why: 'Leather comparison section' },
      'S4-leather-suede': { subject: 'Macro: suede nap, brushed two ways', requirement: 'Flat even light, square frame, same distance as the others', why: 'Leather comparison section' },
      'S4-not-defect': { subject: 'Natural marks: scars, insect bites, uneven colour', requirement: 'Marks clearly visible, close crop', why: 'The “this is not a defect” block' },
      'S6-hands': { subject: 'Hands at work with a tool', requirement: 'Shot during real work, not staged afterwards', why: 'Proof the work is manual' },
      'S6-portrait': { subject: 'Portrait of the maker at the bench, face visible', requirement: 'Natural light, no posing', why: 'An anonymous “craftsman” does not build trust' },
      'S7-kit': { subject: 'Everything that ships, laid out flat', requirement: 'Top-down, even light, neutral surface', why: 'Sets expectations about what arrives' },
    },
```

3. Перевести на четыре языка. Ключи (`S1-hero` и прочие) **не переводить** — это идентификаторы.

4. `lib/shotlist.ts` — из `StoryShot` уходят три текстовых поля:

```ts
export interface StoryShot {
  index: number;
  id: string;
  ratio: string;
}

/** Story shots for the landing page. Texts live in the dictionary, keyed by id. */
export const storyShots: StoryShot[] = [
  { index: 1,  id: 'S1-hero',            ratio: '4 / 3' },
  { index: 2,  id: 'S2-stitch-macro',    ratio: '4 / 5' },
  { index: 3,  id: 'S2-grain-macro',     ratio: '4 / 5' },
  { index: 4,  id: 'S2-edge-macro',      ratio: '4 / 5' },
  { index: 5,  id: 'S4-leather-smooth',  ratio: '1 / 1' },
  { index: 6,  id: 'S4-leather-croc',    ratio: '1 / 1' },
  { index: 7,  id: 'S4-leather-suede',   ratio: '1 / 1' },
  { index: 8,  id: 'S4-not-defect',      ratio: '4 / 3' },
  { index: 9,  id: 'S6-hands',           ratio: '4 / 3' },
  { index: 10, id: 'S6-portrait',        ratio: '4 / 5' },
  { index: 11, id: 'S7-kit',             ratio: '4 / 3' },
];
```

5. `components/shotlist/StorySlots.tsx` — заменить файл целиком:

```tsx
// components/shotlist/StorySlots.tsx
'use client';

import { storyShots } from '@/lib/shotlist';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill } from '@/lib/format';
import PhotoSlot from '@/components/ui/PhotoSlot';

export default function StorySlots() {
  const { dict } = useI18n();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {storyShots.map((shot) => {
        const copy = dict.shotlist.stories[shot.id];
        return (
          <div
            key={shot.id}
            data-shot-card
            className="flex flex-col justify-between rounded-sm border border-line bg-paper p-4"
          >
            <PhotoSlot
              id={shot.id}
              ratio={shot.ratio}
              subject={copy.subject}
              requirement={copy.requirement}
              why={copy.why}
              className="mb-4"
            />

            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="font-mono text-xs text-muted">
                {fill(dict.shotlist.shotNumber, { index: shot.index })}
              </span>
              <div
                data-shot-checkbox
                className="h-4 w-4 rounded-sm border border-ink"
                aria-hidden="true"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

6. `npx tsc --noEmit && npm run build`, коммит.

### Do NOT
- ❌ Не менять `id` кадров и не менять их порядок: по ним собирается печатный список и по ним мастер называет файлы.

### Acceptance
- [ ] На `/de/shotlist` все одиннадцать карточек описаны по-немецки
- [ ] Подпись «Shot #7» переведена
- [ ] `npm run build` зелёная

---

## T-181 — Экспорт списка кадров на языке страницы

**Depends on:** T-180
**Estimate:** 40 мин
**Files:** `lib/shotlist.ts`; `components/shotlist/ExportButtons.tsx`; `scripts/generate-shotlist.mjs`

### Business
Кнопки «Экспорт Markdown» и «Экспорт CSV» отдают файл, который мастер уносит в мастерскую. Сейчас его содержимое английское, а после T-179 в нём вместо названий стоят коды. Отдаём файл на том языке, на котором открыта страница.

### Code

1. `lib/shotlist.ts` — обе функции экспорта принимают словарь. Заменить их целиком:

```ts
/** Markdown export, used both by the page and by the npm script. */
export function toMarkdown(dict: Dictionary): string {
  const product = getProductShots();
  const counts = getShotCounts();
  const date = new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    `# ${dict.brand.name} — ${dict.shotlist.title}`,
    '',
    `${dict.shotlist.generated} ${date}. **${counts.total} ${dict.shotlist.totalLabel}** — ${counts.product} + ${counts.story}.`,
    '',
    `## ${dict.shotlist.rulesTitle}`,
    '',
  ];

  for (const rule of dict.shotlist.rules) lines.push(`- ${rule}`);

  lines.push('', `## ${dict.shotlist.productShots}`, '');
  lines.push('| # | File | Leather | Colour | Angle | Done |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of product) {
    lines.push(
      `| ${s.index} | \`${s.filename}\` | ${dict.leatherNames[s.leather]} | ${dict.colors[s.color]} | ${dict.angles[s.angle]} | ☐ |`,
    );
  }

  lines.push('', `## ${dict.shotlist.storyShots}`, '');
  lines.push('| # | Id | Subject | Requirement | Done |');
  lines.push('|---|---|---|---|---|');
  for (const s of storyShots) {
    const copy = dict.shotlist.stories[s.id];
    lines.push(`| ${s.index} | \`${s.id}\` | ${copy.subject} | ${copy.requirement} | ☐ |`);
  }

  return lines.join('\n');
}

export function toCsv(dict: Dictionary): string {
  const rows: string[] = ['index,type,file,leather,colour,angle,ratio'];
  for (const s of getProductShots()) {
    rows.push(
      `${s.index},product,${s.filename},${dict.leatherNames[s.leather]},${dict.colors[s.color]},${dict.angles[s.angle]},"${s.ratio}"`,
    );
  }
  for (const s of storyShots) {
    rows.push(`${s.index},story,${s.id},,,,"${s.ratio}"`);
  }
  return rows.join('\n');
}
```
   и добавить импорт типа в начало файла:
   ```ts
   import type { Dictionary } from '@/types/i18n';
   ```
   ⚠️ Заголовки таблиц (`| # | File | Leather |…`) остаются английскими намеренно: это служебные колонки файла, а не текст для чтения. Их не переводим.

2. `components/shotlist/ExportButtons.tsx` — передать словарь:
   ```diff
   -        onClick={() => download('shotlist.md', toMarkdown(), 'text/markdown')}
   +        onClick={() => download('shotlist.md', toMarkdown(dict), 'text/markdown')}
   ```
   ```diff
   -        onClick={() => download('shotlist.csv', toCsv(), 'text/csv')}
   +        onClick={() => download('shotlist.csv', toCsv(dict), 'text/csv')}
   ```

3. `scripts/generate-shotlist.mjs` — скрипт запускается из командной строки, языка у него нет, поэтому берёт английский словарь. Заменить строку:
   ```diff
   -  const shotlistModule = await import(`file://${outDir}/lib/shotlist.js`);
   -  const md = shotlistModule.toMarkdown();
   +  const shotlistModule = await import(`file://${outDir}/lib/shotlist.js`);
   +  const enModule = await import(`file://${outDir}/content/i18n/dict/en.js`);
   +  const md = shotlistModule.toMarkdown(enModule.en);
   ```

4. Проверить: `npm run shotlist` пересобирает `shotlist.md`, в нём названия кож и цветов человеческими словами, а не кодами.

5. `npx tsc --noEmit && npm run build`, коммит.

### Acceptance
- [ ] `npm run shotlist` отрабатывает, в `shotlist.md` «Smooth leather», а не `smooth`
- [ ] На `/pl/shotlist` кнопка экспорта отдаёт файл с польскими названиями
- [ ] `npm run build` зелёная

---

## T-182 — Мёртвый код и приёмка эпика

**Depends on:** T-181
**Estimate:** 40 мин
**Files:** `content/pricing.ts`, `lib/data.ts`, `lib/assets.ts`, `package.json`, `STATUS.md`

### Business
После эпика в коде остались две неиспользуемые вещи и одна английская строка в alt для будущих фотографий. Плюс включаем детектор в обязательные проверки, чтобы регресс не прошёл незамеченным.

### Steps

1. `content/pricing.ts` — удалить неиспользуемую константу:
   ```diff
   -export const insertNames: Record<InsertType, string> = {
   -  plain: 'Plain',
   -  ruled: 'Ruled',
   -  dot: 'Dot grid',
   -};
   ```
   Её заменил `dict.insertTypes`. Удалить `insertNames` также из реэкспорта в `lib/data.ts`. Если после этого импорт типа `InsertType` в `content/pricing.ts` не нужен — удалить и его.

2. `lib/assets.ts` — alt для будущих фотографий. Заменить `getPreview`, чтобы alt приходил аргументом:
   ```diff
   -export function getPreview(config: Configuration, angle: Angle): PreviewSource {
   +export function getPreview(config: Configuration, angle: Angle, photoAlt = ''): PreviewSource {
   ```
   ```diff
        return {
          kind: 'photo',
          src: `/previews/${filename}`,
   -      alt: `Naked Skin notebook cover, ${config.leather} leather, ${config.color}, ${angle} view`,
   +      alt: photoAlt,
        };
   ```
   В `components/configurator/Preview.tsx` вызов остаётся прежним — режим сейчас схематический, а текст alt заведёт задача фазы фотографий. Добавить в `lib/assets.ts` комментарий над параметром:
   ```ts
   /** Localised alt text, supplied by the caller. Empty until photography arrives. */
   ```

3. Включить детектор в проверки. В `package.json`:
   ```diff
   -    "lint": "next lint",
   +    "lint": "next lint && npm run i18n",
   ```

4. Прогнать всё:
   ```bash
   npm run i18n
   npx tsc --noEmit
   npm run lint
   npm run build
   npm run shotlist
   ```
   **`npm run i18n` обязан напечатать «нет» в обеих секциях и завершиться с кодом 0.**
   Если что-то осталось — это пропущенная строка, чинить переводом, а не добавлением в allowlist.

5. Ручная проверка по языкам. Открыть каждую страницу на `/uk/` и `/de/` и убедиться, что английских слов нет нигде, кроме кодов файлов вида `smooth_cognac_front.webp`:

   | Страница | На что смотреть |
   |---|---|
   | `/uk` | габариты «мм», вес «г», названия размеров, alt иллюстраций (проверить через инспектор) |
   | `/uk/configurator` | подписи осей, чип на чертеже, выноски, все четыре вкладки ракурсов |
   | `/uk/configurator?size=a6&cards=4` | тост про кишені |
   | `/uk/shotlist` | правила съёмки, «що показати», одиннадцать сюжетных карточек |
   | `/uk/абракадабра` | страница 404 |
   | корзина с позицией | название размера, застёжка, держатель, срок |
   | `/de/…` то же самое | немецкий |

6. `STATUS.md` — проставить всем задачам эпика 11 ✅ с хешами. Если что-то сделано не как в задаче — строка в «Расхождения» эпика 11.

7. Коммит: `T-182: dead code cleanup and epic 11 acceptance`.

### Acceptance
- [ ] `npm run i18n` завершается с кодом 0 и печатает «нет» дважды
- [ ] `npm run lint` зелёный (и теперь включает проверку переводов)
- [ ] Все семь строк таблицы из шага 5 проверены вручную
- [ ] `STATUS.md` актуален

---

## Что после эпика

Не делать без отдельного указания:

- **Числовые форматы по локали** (`1 234,56` против `1,234.56`) — сейчас `formatPrice` печатает число как есть. Заметно станет на суммах от тысячи.
- **`hreflang` и `canonical`** — замечание из аудита, к переводам примыкает, но это отдельная задача.
- **Тексты по коже** — ждут мастера, см. `kroja-spec/17-axes-change.md`, §10.
