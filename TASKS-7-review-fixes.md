# TASKS 7 — Исправления по ревью (EPIC 10)

Задачи T-149 … T-162. Источник — код-ревью эпика 9 от 06.09.2026, ID замечаний вида `R-01`, `R-08`.
Ход работ — `STATUS.md`, раздел «Эпик 10».

**Что делаем одной фразой:** закрываем 15 замечаний ревью. Ни одной новой функции — только правки того, что уже работает.

---

> ⚠️ **Четыре правила этого эпика. Прочитать до первой строки кода.**
>
> **1. Здесь нечего решать.** В каждой задаче написано, какой файл открыть, какие строки удалить и какие вставить. Если кажется, что можно иначе — нельзя. Если кажется, что задача чего-то не учла — она учла, продолжай.
>
> **2. Сборка зелёная после каждой задачи.** Не как в эпике 9. После каждой задачи:
> ```bash
> npx tsc --noEmit --pretty false && npm run build
> ```
> Красная сборка = задача не выполнена. Чинить только то, что сломал сам.
>
> **3. Один коммит на задачу. Сразу.** Не «в конце». Формат: `T-1XX: краткое описание`.
>
> **4. Не трогать ничего сверх списка `Files` своей задачи.** Даже если рядом видно что-то похожее.
>
> **Порядок:** T-149 → T-150 → … → T-162, строго по номерам. T-150 первая по коду, потому что на её файл ссылаются пять последующих.

---

## T-149 — Разложить эпик 9 на коммиты

**Depends on:** —
**Estimate:** 30 мин
**Files:** git-история, `STATUS.md`
**Замечание:** R-14

### Business
Эпик 9 целиком лежит одним рабочим деревом: 25 задач, ноль коммитов. Пока это так, нельзя откатить одну задачу, нельзя найти бисектом, что сломалось. Разложить по задачам уже невозможно — раскладываем по волнам, это лучше, чем один коммит на всё.

### Steps

1. Проверить, что дерево грязное именно от эпика 9 и ничего лишнего нет:
   ```bash
   git status --short
   ```
   Ожидается: изменены `content/*`, `lib/*`, `types/*`, `store/*`, `components/*`, `app/*`, `shotlist.md`, `STATUS.md`; удалены `content/copy.ts`, `content/cords.ts`, `components/configurator/DetailsSelector.tsx`, `components/configurator/Engraving*.tsx`; добавлены новые селекторы и `content/closures.ts`, `elastic.ts`, `pen-holders.ts`.

2. Коммит 1 — данные, типы и логика (волна A):
   ```bash
   git add types/config.ts types/i18n.ts content lib store
   git commit -m "T-120..T-131: new configurator axes — types, data, logic, dictionaries"
   ```

3. Коммит 2 — компоненты (волна B):
   ```bash
   git add components
   git commit -m "T-132..T-142: new configurator axes — schematic, selectors, cart, landing"
   ```

4. Коммит 3 — сборка, приёмка и артефакты (волна C):
   ```bash
   git add app shotlist.md STATUS.md
   git commit -m "T-143..T-144: assemble configurator, cleanup and epic acceptance"
   ```

5. Проверить, что дерево чистое:
   ```bash
   git status --short
   ```
   Должно быть пусто.

6. В `STATUS.md`, в таблице задач эпика 9, проставить в колонку «Коммит» хеш соответствующего коммита: задачам T-120…T-131 — хеш коммита 1, T-132…T-142 — коммита 2, T-143…T-144 — коммита 3. Хеши взять из `git log --oneline -3`.

7. В `STATUS.md`, в раздел «Расхождения с требованиями» эпика 9, вместо строки «Расхождений нет» вставить таблицу с двумя записями (замечания R-14 и R-15):

   ```markdown
   | Дата | Задача | Требование | Что сделано иначе | Почему | Кто решил |
   |---|---|---|---|---|---|
   | 2026-09-06 | все | AGENT.md, «одна задача = один коммит» | Эпик выполнен без коммитов, разложен задним числом на 3 коммита по волнам в T-149 | Коммиты не делались по ходу работы | ревью 06.09.2026 |
   | 2026-09-06 | T-141 | Список Files задачи | Изменён `components/landing/Illustration.tsx` — в alt-тексте «elastic cord» → «elastic band» | Файла не было в списке; правка верная и соответствует переименованию оси | ревью 06.09.2026 |
   ```

8. Закоммитить правку журнала:
   ```bash
   git add STATUS.md
   git commit -m "T-149: split epic 9 into commits, record deviations"
   ```

### Do NOT
- ❌ Не делать `git rebase`, `git reset`, `git commit --amend`. Только новые коммиты.
- ❌ Не пытаться разложить дерево на 25 коммитов по задачам — информации для этого уже нет.
- ❌ Не создавать ветку. Работаем в `main`, как и весь проект.

### Acceptance
- [ ] `git log --oneline -4` показывает четыре новых коммита
- [ ] `git status --short` — пусто
- [ ] В `STATUS.md` у всех 25 задач эпика 9 заполнена колонка «Коммит»
- [ ] В разделе «Расхождения» две записи

---

## T-150 — Токены чертежей одним файлом

**Depends on:** T-149
**Estimate:** 20 мин
**Files:** создать `lib/schematic-tokens.ts`; изменить `components/schematic/SchematicCover.tsx`, `components/schematic/HatchDefs.tsx`, `components/schematic/SizeDiagram.tsx`, `components/schematic/PenSizeGuide.tsx`, `components/configurator/ClosureSelector.tsx`, `components/configurator/PenHolderSelector.tsx`
**Замечание:** R-08

### Business
Пять цветов чертежа объявлены хекс-литералами в шести файлах и дублируют `tailwind.config.ts`. Смена палитры сейчас — охота по файлам. Делаем один источник.

### Code

Создать файл целиком:

```ts
// lib/schematic-tokens.ts
// Ink colours for hand-drawn SVG: schematics, diagrams and option pictograms.
// These mirror tailwind.config.ts. Tailwind classes cannot be used inside SVG
// attributes, so the values live here and are imported, never re-typed.

export const INK = '#1C1917';
export const INK_SOFT = '#57534E';
export const MUTED = '#8A7F72';
export const LINE = '#DED5C7';
export const PAPER = '#FAF7F2';
export const PAPER_2 = '#F2EDE4';
export const ALERT = '#A63D2F';
```

### Steps

1. Создать `lib/schematic-tokens.ts` кодом выше.

2. `components/schematic/SchematicCover.tsx` — удалить пять строк:
   ```ts
   const INK = '#1C1917';
   const LINE = '#DED5C7';
   const ALERT = '#A63D2F';
   const MUTED = '#8A7F72';
   const PAPER = '#FAF7F2';
   ```
   и вместо них, сразу после последнего `import`, добавить:
   ```ts
   import { INK, LINE, ALERT, MUTED, PAPER } from '@/lib/schematic-tokens';
   ```

3. `components/schematic/HatchDefs.tsx` — удалить строку `const INK = '#1C1917';`, добавить после последнего `import`:
   ```ts
   import { INK } from '@/lib/schematic-tokens';
   ```

4. `components/schematic/SizeDiagram.tsx` — удалить три строки:
   ```ts
   const INK = '#1C1917';
   const LINE = '#DED5C7';
   const MUTED = '#8A7F72';
   ```
   добавить после последнего `import`:
   ```ts
   import { INK, LINE, MUTED } from '@/lib/schematic-tokens';
   ```
   ⚠️ Строку `const PHONE_MM: [number, number] = [70, 150];` **не трогать** — это размер, а не цвет.

5. `components/schematic/PenSizeGuide.tsx` — удалить две строки `const INK` и `const MUTED`, добавить:
   ```ts
   import { INK, MUTED } from '@/lib/schematic-tokens';
   ```

6. `components/configurator/ClosureSelector.tsx` — удалить две строки `const INK` и `const LINE`, добавить:
   ```ts
   import { INK, LINE } from '@/lib/schematic-tokens';
   ```

7. `components/configurator/PenHolderSelector.tsx` — то же самое: удалить `const INK` и `const LINE`, добавить:
   ```ts
   import { INK, LINE } from '@/lib/schematic-tokens';
   ```

8. `npx tsc --noEmit && npm run build`, затем коммит.

### Do NOT
- ❌ Не трогать `BRASS_HEX` в `content/closures.ts` — это цвет изделия, он живёт в данных.
- ❌ Не трогать хексы в `content/colors.ts`, `threads.ts`, `elastic.ts` — это тоже данные о продукте.
- ❌ Не переписывать SVG на Tailwind-классы. В атрибутах SVG они не работают.

### Acceptance
- [ ] `grep -rn "const INK = \|const LINE = \|const MUTED = \|const PAPER = \|const ALERT = " components` — пусто
- [ ] `npm run build` зелёная
- [ ] Внешне ничего не изменилось: `/en/configurator` рисует чертёж как раньше

---

## T-151 — Пять импортов на фасад данных

**Depends on:** T-150
**Estimate:** 10 мин
**Files:** `components/configurator/LeatherSelector.tsx`, `components/configurator/ColorSelector.tsx`, `components/configurator/SizeSelector.tsx`, `components/configurator/NotifyStockForm.tsx`, `components/schematic/SizeDiagram.tsx`
**Замечание:** R-12

### Business
Правило проекта: компоненты берут данные из `@/lib/data`, а не из `@/content/*` напрямую. Так при переезде на Payload меняется один файл, а не двадцать. Пять файлов остались на старых импортах.

### Steps

Ровно пять замен строк. Больше в этих файлах ничего не менять.

1. `components/configurator/LeatherSelector.tsx`
   ```diff
   - import { leatherList } from '@/content/leathers';
   + import { leatherList } from '@/lib/data';
   ```

2. `components/configurator/ColorSelector.tsx`
   ```diff
   - import { colorList } from '@/content/colors';
   + import { colorList } from '@/lib/data';
   ```

3. `components/configurator/SizeSelector.tsx`
   ```diff
   - import { sizeList } from '@/content/sizes';
   + import { sizeList } from '@/lib/data';
   ```

4. `components/configurator/NotifyStockForm.tsx` — две строки заменяются одной:
   ```diff
   - import { leathers } from '@/content/leathers';
   - import { colors } from '@/content/colors';
   + import { leathers, colors } from '@/lib/data';
   ```

5. `components/schematic/SizeDiagram.tsx`
   ```diff
   - import { sizes, sizeList } from '@/content/sizes';
   + import { sizes, sizeList } from '@/lib/data';
   ```

6. `npx tsc --noEmit && npm run build`, затем коммит.

### Do NOT
- ❌ Не трогать `@/content/i18n` в `LanguageSwitcher.tsx`, `I18nProvider.tsx` и файлах `app/*` — словари через фасад не идут, это отдельный слой.
- ❌ Не трогать `@/content/sections` в `Process.tsx` и `app/[lang]/page.tsx` — вне задачи.
- ❌ Не трогать импорты внутри `lib/*` — там `content/*` напрямую разрешён.

### Acceptance
- [ ] `grep -rn "from '@/content/" components/configurator components/schematic` — пусто
- [ ] `npm run build` зелёная

---

## T-152 — Ракурс `back` всегда схематический

**Depends on:** T-151
**Estimate:** 5 мин
**Files:** `components/schematic/SchematicCover.tsx` — нет; изменить только `lib/assets.ts`
**Замечание:** R-04

### Business
`back` сознательно не входит в матрицу съёмки: фотографировать заднюю обложку без резинки нечего, резинка рисуется кодом. Но `getPreview` в режиме `photo` вернёт для него путь к файлу `{кожа}_{цвет}_back.webp`, которого не будет никогда. Сейчас не видно — режим схематический. В первый день фазы фотографий это будут битые картинки на каждой комбинации. Чиним заранее, одной строкой.

### Code

В `lib/assets.ts` заменить функцию `getPreview` целиком на:

```ts
export function getPreview(config: Configuration, angle: Angle): PreviewSource {
  const filename = previewFilename(config.leather, config.color, angle);

  // 'back' is never photographed: the elastic knot and the strap anchor are drawn
  // by the site, so this angle stays schematic even after photography arrives.
  if (ASSET_MODE === 'schematic' || angle === 'back') {
    return { kind: 'schematic', config, angle, filename };
  }

  return {
    kind: 'photo',
    src: `/previews/${filename}`,
    alt: `Naked Skin notebook cover, ${config.leather} leather, ${config.color}, ${angle} view`,
  };
}
```

### Steps
1. Заменить функцию.
2. `npx tsc --noEmit && npm run build`, коммит.

### Acceptance
- [ ] В `lib/assets.ts` условие содержит `|| angle === 'back'`
- [ ] `npm run build` зелёная

---

## T-153 — Убрать фурнитуру с эталонных чертежей списка кадров

**Depends on:** T-152
**Estimate:** 10 мин
**Files:** `components/shotlist/ShotMatrix.tsx`
**Замечание:** R-01

### Business
На `/shotlist` прямо над матрицей напечатано правило: «резинки, тиснения, петли и карманов в кадре быть не должно — их рисует сайт». А на каждом из эталонных чертежей под этим правилом нарисована резинка: конфигурация кадра берётся из `DEFAULT_CONFIG`, где застёжка по умолчанию — резинка. Мастер увидит противоречие между текстом и картинкой. Это ровно та неоднозначность, ради устранения которой страница существует.

### Code

В `components/shotlist/ShotMatrix.tsx` найти литерал конфигурации внутри `groupShots.map` и заменить его на:

```ts
                const config: Configuration = {
                  ...DEFAULT_CONFIG,
                  leather: shot.leather,
                  color: shot.color,
                  // Hardware is composited by the site and must not appear in the
                  // reference drawing — the shot rules above say exactly that.
                  closure: 'none',
                  penHolder: 'none',
                  cardSlots: 0,
                  embossing: null,
                  inserts: [{ type: 'dot', qty: 2 }],
                };
```

### Steps
1. Заменить литерал.
2. `npm run build`, открыть `http://localhost:3000/en/shotlist` и убедиться глазами: ни на одной миниатюре нет вертикальной полосы резинки.
3. Коммит.

### Do NOT
- ❌ Не менять `DEFAULT_CONFIG` в `lib/config-schema.ts` — конструктор должен открываться с резинкой, это правильно.
- ❌ Не трогать `globalShotRules` в `content/shots.ts`.

### Acceptance
- [ ] На `/en/shotlist` ни на одной миниатюре нет резинки, петли, карманов и букв
- [ ] `npm run build` зелёная

---

## T-154 — Подпись карманов выносится из-под обложки

**Depends on:** T-153
**Estimate:** 15 мин
**Files:** `components/schematic/SchematicCover.tsx`
**Замечание:** R-02

### Business
В ракурсе `open` подпись «card slots × N» нарисована поверх заливки обложки серым цветом `MUTED`. На чёрной, графитовой и тёмно-синей коже её практически не видно. Это единственная подпись внутри обложки — все остальные стоят на бумаге. Переносим её вниз, к остальным выноскам.

### Steps

1. В блоке `{angle === 'open' && (…)}` **удалить** этот фрагмент целиком:

   ```tsx
          {config.cardSlots > 0 && !compact && (
            <text x={SLOT_X} y={SLOT_BOTTOM - SLOT_H - (config.cardSlots - 1) * SLOT_STEP - 6}
                  fontSize="9" fill={MUTED}>
              card slots × {config.cardSlots}
            </text>
          )}
   ```

2. В том же блоке `{angle === 'open' && (…)}` найти нижний блок выносок:

   ```tsx
          {!compact && (
            <>
              <text x="20" y="256" fontSize="9.5" fill={MUTED}>
                → {spec.mustShow.join(' · ')}
              </text>
              <text x="20" y="278" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
            </>
          )}
   ```

   и заменить его на:

   ```tsx
          {!compact && (
            <>
              <text x="20" y="252" fontSize="9.5" fill={MUTED}>
                → {spec.mustShow.join(' · ')}
              </text>
              {config.cardSlots > 0 && (
                <text x="20" y="266" fontSize="9.5" fill={MUTED}>
                  → card slots × {config.cardSlots}, inside the front cover
                </text>
              )}
              <text x="20" y="286" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
            </>
          )}
   ```

3. `npm run build`, проверить глазами на `http://localhost:3000/en/configurator?cards=3&color=black` во вкладке Open: подпись читается на белом поле под чертежом.
4. Коммит.

### Do NOT
- ❌ Не менять константы `SLOT_W`, `SLOT_H`, `SLOT_STEP`, `SLOT_X`, `SLOT_BOTTOM` — сами карманы рисуются правильно.
- ❌ Не менять `viewBox="0 0 400 300"`. Координата 286 в него помещается.

### Acceptance
- [ ] При `?cards=3&color=black` во вкладке Open подпись про карманы читаема
- [ ] При `?cards=0` строки про карманы нет
- [ ] `npm run build` зелёная

---

## T-155 — Диаметры петель одним источником

**Depends on:** T-154
**Estimate:** 40 мин
**Files:** `content/i18n/dict/en.ts`, `pl.ts`, `de.ts`, `by.ts`, `uk.ts`; `components/configurator/PenHolderSelector.tsx`; `components/schematic/SchematicCover.tsx`
**Замечание:** R-03

### Business
Числа «10 мм» и «10–13 мм» сейчас лежат в трёх местах: в данных `content/pen-holders.ts`, строкой в пяти словарях и захардкоженной строкой в чертеже. Мастер вот-вот назовёт настоящие диаметры — и правка данных изменит только круги-линейку, а карточки выбора и подписи на чертеже продолжат показывать старые числа. Делаем словарь шаблоном, а чертёж — читающим данные.

### Steps

1. `content/i18n/dict/en.ts` — заменить блок `penHolders`:
   ```ts
    penHolders: {
      none: { title: 'No pen loop', meta: '' },
      slim: { title: 'Slim pen', meta: 'Ø up to {max} mm' },
      wide: { title: 'Wide pen', meta: 'Ø {min}–{max} mm' },
    },
   ```

2. `content/i18n/dict/pl.ts`:
   ```ts
    penHolders: {
      none: { title: "Bez uchwytu", meta: "" },
      slim: { title: "Cienki długopis", meta: "Ø do {max} mm" },
      wide: { title: "Gruby długopis", meta: "Ø {min}–{max} mm" },
    },
   ```
   ⚠️ Значения `title` взять те, что уже стоят в файле — менять только `meta`.

3. `content/i18n/dict/de.ts` — в `meta`:
   `slim: "Ø bis {max} mm"`, `wide: "Ø {min}–{max} mm"`, `none: ""`.

4. `content/i18n/dict/by.ts` — в `meta`:
   `slim: "Ø да {max} мм"`, `wide: "Ø {min}–{max} мм"`, `none: ""`.

5. `content/i18n/dict/uk.ts` — в `meta`:
   `slim: "Ø до {max} мм"`, `wide: "Ø {min}–{max} мм"`, `none: ""`.

6. `components/configurator/PenHolderSelector.tsx` — в импорте из `@/lib/format` добавить `fill`:
   ```diff
   - import { formatDelta } from '@/lib/format';
   + import { fill, formatDelta } from '@/lib/format';
   ```
   и в `items={penHolderList.map((p) => ({…}))}` заменить строку `meta`:
   ```diff
   -            meta: dict.configurator.penHolders[p.code].meta || undefined,
   +            meta: dict.configurator.penHolders[p.code].meta
   +              ? fill(dict.configurator.penHolders[p.code].meta, { min: p.minMm, max: p.maxMm })
   +              : undefined,
   ```

7. `components/schematic/SchematicCover.tsx` — в импорте из `@/lib/data` добавить `penHolders`:
   ```diff
    import {
      leathers,
      colors,
      threadHex,
      elasticColors,
   +  penHolders,
      angleSpecs,
      SCHEMATIC_NOTE,
      BRASS_HEX,
    } from '@/lib/data';
   ```
   и заменить строку с `penLabel`:
   ```diff
   -  const penLabel = config.penHolder === 'wide' ? 'pen loop Ø 10–13 mm' : 'pen loop Ø up to 10 mm';
   +  const penDef = penHolders[config.penHolder];
   +  const penLabel =
   +    config.penHolder === 'wide'
   +      ? `pen loop Ø ${penDef.minMm}–${penDef.maxMm} mm`
   +      : `pen loop Ø up to ${penDef.maxMm} mm`;
   ```

8. Проверка одним изменением данных: временно поставить в `content/pen-holders.ts` у `wide` значение `maxMm: 14`, открыть `/en/configurator?pen=wide` и убедиться, что **14** появилось в трёх местах — на карточке, в выноске чертежа и на линейке. Затем **вернуть 13** обратно.

9. `npx tsc --noEmit && npm run build`, коммит.

### Do NOT
- ❌ Не менять значения `minMm` / `maxMm` насовсем — 10 и 13 остаются до ответа мастера.
- ❌ Не переводить `Ø` и не заменять его на «диаметр».
- ❌ Не трогать `PenSizeGuide.tsx` — он уже читает данные.

### Acceptance
- [ ] `grep -rn "Ø 10\|Ø up to 10\|10–13" components content` — пусто
- [ ] Временная замена `maxMm` на 14 меняет число во всех трёх местах (проверено и откачено)
- [ ] `npm run build` зелёная

---

## T-156 — Цена принадлежит данным во всех осях

**Depends on:** T-155
**Estimate:** 30 мин
**Files:** `content/pricing.ts`, `content/pen-holders.ts`, `lib/data.ts`, `lib/pricing.ts`, `components/configurator/PenHolderSelector.tsx`
**Замечание:** R-09

### Business
В `calculatePrice` две разные манеры для одного и того же. Нить и застёжка знают свою цену сами: `threads[code].priceMinor`, `closures[code].priceMinor`. Держатель и карманы — нет: цена берётся из свободной константы через `if`. Из-за этого нельзя предсказать, где менять цену: для одних осей достаточно правки данных, для других надо лезть в расчёт. Приводим к одной манере.

### Code

1. `content/pricing.ts` — добавить в конец файла:

```ts
/**
 * Card slots are charged once, whatever the count and the notebook size.
 * Kept as a function so the rule lives next to the price, not inside calculatePrice.
 */
export function cardSlotsPriceMinor(count: number): number {
  return count > 0 ? CARD_SLOTS_MINOR : 0;
}
```

2. `content/pen-holders.ts` — заменить файл целиком:

```ts
// content/pen-holders.ts
import type { PenHolderCode } from '@/types/config';
import { PEN_HOLDER_MINOR } from './pricing';

export interface PenHolderDef {
  code: PenHolderCode;
  /** Inner diameter of the loop, mm. DRAFT until the maker measures the real loops. */
  minMm: number;
  maxMm: number;
  /** Flat fee for the loop. Both sizes cost the same today. */
  priceMinor: number;
  order: number;
}

export const penHolders: Record<PenHolderCode, PenHolderDef> = {
  none: { code: 'none', minMm: 0,  maxMm: 0,  priceMinor: 0,                order: 1 },
  slim: { code: 'slim', minMm: 0,  maxMm: 10, priceMinor: PEN_HOLDER_MINOR, order: 2 },
  wide: { code: 'wide', minMm: 10, maxMm: 13, priceMinor: PEN_HOLDER_MINOR, order: 3 },
};

export const penHolderList: PenHolderDef[] = Object.values(penHolders).sort(
  (a, b) => a.order - b.order,
);

export const DEFAULT_PEN_HOLDER: PenHolderCode = 'none';
```

3. `lib/data.ts` — в блоке реэкспорта из `@/content/pricing` добавить `cardSlotsPriceMinor` последней строкой перед закрывающей скобкой:
   ```diff
      MAX_EMBOSSING_LENGTH,
      MAX_CARD_SLOTS,
   +  cardSlotsPriceMinor,
    } from '@/content/pricing';
   ```

4. `lib/pricing.ts` — заменить импорты и две строки расчёта:
   ```diff
    import { closures } from '@/content/closures';
   +import { penHolders } from '@/content/pen-holders';
    import {
      EMBOSSING_MINOR,
      GIFT_BOX_MINOR,
   -  CARD_SLOTS_MINOR,
   -  PEN_HOLDER_MINOR,
   +  cardSlotsPriceMinor,
      insertPriceMinor,
    } from '@/content/pricing';
   ```
   ```diff
   -  const penHolderMinor = config.penHolder === 'none' ? 0 : PEN_HOLDER_MINOR;
   -  const cardSlotsMinor = config.cardSlots > 0 ? CARD_SLOTS_MINOR : 0;
   +  const penHolderMinor = penHolders[config.penHolder].priceMinor;
   +  const cardSlotsMinor = cardSlotsPriceMinor(config.cardSlots);
   ```

5. `components/configurator/PenHolderSelector.tsx` — карточка берёт цену из данных:
   ```diff
   -            delta: p.code === 'none' ? undefined : formatDelta(PEN_HOLDER_MINOR),
   +            delta: p.priceMinor === 0 ? undefined : formatDelta(p.priceMinor),
   ```
   Импорт `PEN_HOLDER_MINOR` **оставить**: он всё ещё нужен в заголовке секции.

6. `npx tsc --noEmit && npm run build`, коммит.

### Проверка цен вручную
Открыть по очереди и сверить число в панели:

| Ссылка | Цена |
|---|---|
| `/en/configurator` | 325 zł |
| `/en/configurator?pen=slim` | 345 zł |
| `/en/configurator?pen=wide` | 345 zł |
| `/en/configurator?cards=1` | 335 zł |
| `/en/configurator?cards=4` | 335 zł |
| `/en/configurator?closure=buckle&pen=wide&cards=3&emboss=ab` | 525 zł |

### Do NOT
- ❌ Не менять сами суммы. `PEN_HOLDER_MINOR` остаётся 2000, `CARD_SLOTS_MINOR` — 1000.
- ❌ Не удалять `CARD_SLOTS_MINOR` и `PEN_HOLDER_MINOR` из `content/pricing.ts` — на них ссылаются другие файлы.

### Acceptance
- [ ] В `lib/pricing.ts` нет ни одного тернарника с ценой — все девять слагаемых берутся из данных или из именованной функции
- [ ] Все шесть цен из таблицы совпали
- [ ] `npm run build` зелёная

---

## T-157 — Счётчик количества одним компонентом

**Depends on:** T-156
**Estimate:** 30 мин
**Files:** создать `components/ui/QuantityStepper.tsx`; изменить `components/configurator/CardSlotsSelector.tsx`, `components/configurator/InsertsSelector.tsx`
**Замечание:** R-10

### Business
Пара кнопок «− N +» продублирована дословно в двух селекторах: те же классы, тот же `aria-live`, та же схема `aria-label`. Четыре одинаковых блока в двух файлах. Выносим в один компонент — он же пригодится для количества позиций в корзине.

### Code

Создать файл целиком:

```tsx
// components/ui/QuantityStepper.tsx
'use client';

import { useI18n } from '@/components/i18n/I18nProvider';
import { fill } from '@/lib/format';

interface Props {
  value: number;
  /** Highest value the plus button may reach. */
  max: number;
  /** Lowest value the minus button may reach. Defaults to 0. */
  min?: number;
  /** Localised name of what is being counted. Goes into the button labels. */
  name: string;
  onChange: (next: number) => void;
}

export default function QuantityStepper({ value, max, min = 0, name, onChange }: Props) {
  const { dict } = useI18n();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={fill(dict.configurator.removeOne, { name })}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
      >
        −
      </button>
      <span className="w-8 text-center font-mono text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={fill(dict.configurator.addOne, { name })}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="h-11 w-11 rounded-sm border border-line text-lg disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
```

Заменить `components/configurator/CardSlotsSelector.tsx` целиком:

```tsx
// components/configurator/CardSlotsSelector.tsx
'use client';

import type { Configuration } from '@/types/config';
import { sizes, CARD_SLOTS_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill, formatDelta } from '@/lib/format';
import QuantityStepper from '@/components/ui/QuantityStepper';

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
        <QuantityStepper
          value={count}
          max={max}
          name={name}
          onChange={(next) => onChange({ cardSlots: next })}
        />
      </div>
    </section>
  );
}
```

Заменить `components/configurator/InsertsSelector.tsx` целиком:

```tsx
// components/configurator/InsertsSelector.tsx
'use client';

import type { Configuration, InsertType } from '@/types/config';
import { sizes, insertPriceMinor, GIFT_BOX_MINOR } from '@/lib/data';
import { useI18n } from '@/components/i18n/I18nProvider';
import { fill, formatDelta } from '@/lib/format';
import QuantityStepper from '@/components/ui/QuantityStepper';

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
            const name = dict.insertTypes[type];
            // This type may grow by whatever the other types have left unused.
            const maxForType = current + (capacity - totalQty);
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
                <QuantityStepper
                  value={current}
                  max={maxForType}
                  name={name}
                  onChange={(next) => setQty(type, next)}
                />
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

### Steps
1. Создать `QuantityStepper.tsx`, заменить два селектора целиком.
2. `npx tsc --noEmit && npm run build`.
3. Проверить руками на `/en/configurator?size=a6`: у вкладышей ёмкость 2 — набрать 2 штуки одного типа, у остальных двух типов «+» становится недоступен; у карманов «+» недоступен после 2.
4. Коммит.

### Do NOT
- ❌ Не менять классы кнопок. `h-11 w-11` — это минимальный размер зоны нажатия, требование доступности.
- ❌ Не выносить `setQty` из `InsertsSelector` — логика распределения по типам остаётся там.

### Acceptance
- [ ] `grep -rn "h-11 w-11 rounded-sm border border-line text-lg" components/configurator` — пусто
- [ ] На A6 нельзя набрать больше 2 вкладышей суммарно и больше 2 карманов
- [ ] `npm run build` зелёная

---

## T-158 — Заголовки страниц не задваивают бренд

**Depends on:** T-157
**Estimate:** 15 мин
**Files:** `app/[lang]/page.tsx`, `app/[lang]/configurator/page.tsx`, `app/[lang]/shotlist/page.tsx`
**Замечание:** R-06

### Business
Во вкладке браузера сейчас: «Build your notebook — Naked Skin — Naked Skin». Корневой layout уже добавляет `— Naked Skin` через шаблон `template`, а страницы дописывают бренд ещё раз. Убираем дубль.

### Steps

1. `app/[lang]/configurator/page.tsx` — в `generateMetadata`:
   ```diff
   -    title: `${dict.configurator.title} — ${dict.brand.name}`,
   +    title: dict.configurator.title,
   ```

2. `app/[lang]/shotlist/page.tsx` — в статическом `metadata`:
   ```diff
   -  title: 'Shot list — Naked Skin',
   +  title: 'Shot list',
   ```

3. `app/[lang]/page.tsx` — у главной свой полный заголовок, шаблон применять не нужно. В `generateMetadata` заменить строку `title` **только в верхнем объекте**, не в `openGraph`:
   ```diff
   -    title: `${dict.brand.name} — ${dict.hero.title}`,
   +    title: { absolute: `${dict.brand.name} — ${dict.hero.title}` },
   ```
   Строку `title` внутри `openGraph` **оставить как есть** — там шаблон не применяется.

4. `npm run build`, открыть три страницы и посмотреть в заголовок вкладки:

   | Страница | Заголовок вкладки |
   |---|---|
   | `/en` | `Naked Skin — A notebook that outlives its pages` |
   | `/en/configurator` | `Build your notebook — Naked Skin` |
   | `/en/shotlist` | `Shot list — Naked Skin` |

5. Коммит.

### Acceptance
- [ ] Ни в одном заголовке «Naked Skin» не встречается дважды
- [ ] `npm run build` зелёная

---

## T-159 — Свотч «в тон» отличим от одноимённого цвета нити

**Depends on:** T-158
**Estimate:** 20 мин
**Files:** `components/ui/Swatch.tsx`, `components/configurator/ThreadSelector.tsx`
**Замечание:** R-05

### Business
Свотч «в тон» показывает цвет текущей кожи. Если выбрана чёрная кожа, он выглядит ровно как свотч «Чёрный», а при коричневой — как «Коричневый». Различить можно только по подписи. Добавляем пунктирную рамку: она означает «цвет не фиксированный, он следует за кожей».

### Steps

1. `components/ui/Swatch.tsx` — в интерфейс `SwatchProps` добавить поле перед `onSelect`:
   ```ts
     /** Dashed outline: this swatch has no colour of its own, it follows another axis. */
     dashed?: boolean;
   ```

2. Там же — добавить `dashed` в список аргументов функции:
   ```diff
    export default function Swatch({
   -  value, label, hex, selected, state, note, onSelect,
   +  value, label, hex, selected, state, note, dashed, onSelect,
    }: SwatchProps) {
   ```

3. Там же — в `clsx` кружка добавить последним аргументом строку про пунктир:
   ```diff
        className={clsx(
          'relative block h-11 w-11 rounded-full border transition-all duration-150',
          selected ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'border-line',
          !disabled && !selected && 'group-hover:border-ink',
   +      dashed && 'border-2 border-dashed border-ink-soft',
        )}
   ```

4. `components/configurator/ThreadSelector.tsx` — в `items={threadList.map(...)}` добавить поле после `hex`:
   ```diff
            hex: t.hex ?? leatherHex,
   +        // 'tonal' has no colour of its own — mark it so it is not read as a fixed colour.
   +        dashed: t.hex === null,
            state: 'available' as const,
   ```

5. `npx tsc --noEmit && npm run build`, проверить на `/en/configurator?color=black`: первый свотч нити с пунктирной рамкой, второй сплошной. Коммит.

### Do NOT
- ❌ Не добавлять `dashed` в `ColorSelector` и `ClosureSelector` — там у всех свотчей свой цвет.

### Acceptance
- [ ] На `?color=black` свотч «Match the leather» визуально отличается от «Black»
- [ ] `npm run build` зелёная

---

## T-160 — Разделить `SchematicCover` на четыре вида

**Depends on:** T-159
**Estimate:** 2–3ч
**Files:** создать `components/schematic/schematic-parts.tsx`, `components/schematic/views/FrontView.tsx`, `views/BackView.tsx`, `views/OpenView.tsx`, `views/DetailView.tsx`; заменить `components/schematic/SchematicCover.tsx`
**Замечание:** R-07

### Business
Сейчас это одна функция на 319 строк с четырьмя блоками `{angle === '…' && <svg>}` и 19 условными ветками. Она меняется по четырём разным причинам, и правка одного ракурса рискует задеть остальные. Это самый вероятный файл для следующих правок: фотографии, новая фурнитура, новые выноски. Разбираем на четыре вида плюс общие части.

**Это чистый перенос кода.** Ни одна координата, ни один цвет, ни одна подпись не меняются. Внешне после задачи не должно измениться ничего.

### Code

Файл 1 — общие части. Создать целиком:

```tsx
// components/schematic/schematic-parts.tsx
// Values and fragments shared by all four schematic views.
// Geometry lives in the views; anything derived from the configuration lives here.
import type { Configuration } from '@/types/config';
import { leathers, colors, threadHex, elasticColors, penHolders, SCHEMATIC_NOTE } from '@/lib/data';
import { INK, MUTED, ALERT, PAPER } from '@/lib/schematic-tokens';
import { hatchUrl } from './HatchDefs';

/** Pen radius in drawing units. The wide loop must be visibly bigger than the slim one. */
const PEN_RADIUS = { slim: 7, wide: 9 } as const;

export interface SchematicParts {
  leatherName: string;
  colorName: string;
  /** Leather colour fill */
  fill: string;
  /** url(#…) of the leather hatch pattern */
  hatch: string;
  /** Stitch colour, already resolved for the 'tonal' thread */
  stitch: string;
  /** Elastic band colour */
  elastic: string;
  hasElastic: boolean;
  hasBuckle: boolean;
  hasPen: boolean;
  penR: number;
  penLabel: string;
  embossFont: string;
  /** How many paper inserts to draw in the open view: 1..4 */
  insertCount: number;
}

/** Everything the drawings need, derived from the configuration in one place. */
export function schematicParts(config: Configuration): SchematicParts {
  const leather = leathers[config.leather];
  const color = colors[config.color];
  const penDef = penHolders[config.penHolder];

  return {
    leatherName: leather.name,
    colorName: color.name,
    fill: color.hex,
    hatch: hatchUrl(leather.schematicHatch),
    stitch: threadHex(config.thread, color.hex),
    elastic: elasticColors[config.elasticColor].hex,
    hasElastic: config.closure === 'elastic',
    hasBuckle: config.closure === 'buckle',
    hasPen: config.penHolder !== 'none',
    penR: config.penHolder === 'wide' ? PEN_RADIUS.wide : PEN_RADIUS.slim,
    penLabel:
      config.penHolder === 'wide'
        ? `pen loop Ø ${penDef.minMm}–${penDef.maxMm} mm`
        : `pen loop Ø up to ${penDef.maxMm} mm`,
    embossFont:
      config.embossing?.font === 'sans' ? 'Inter, system-ui, sans-serif' : 'Georgia, serif',
    insertCount: Math.min(4, Math.max(1, config.inserts.reduce((sum, i) => sum + i.qty, 0))),
  };
}

export interface ViewProps {
  config: Configuration;
  compact: boolean;
  parts: SchematicParts;
}

/** Colour chip and material names, top-left corner of every view. */
export function Labels({ parts }: { parts: SchematicParts }) {
  return (
    <>
      <rect x="20" y="20" width="14" height="14" fill={parts.fill} stroke={INK} strokeWidth="0.8" />
      <text x="42" y="31" fontSize="11" fill={INK}>{parts.colorName}</text>
      <text x="20" y="50" fontSize="10" fill={MUTED}>{parts.leatherName}</text>
    </>
  );
}

/** Callout lines plus the schematic warning, for the 400 × 500 views. Max three lines. */
export function Notes({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.slice(0, 3).map((line, i) => (
        <text key={line} x="20" y={416 + i * 13} fontSize="9.5" fill={MUTED}>
          → {line}
        </text>
      ))}
      <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
    </>
  );
}

/** A pen sitting in its loop on a spine strip centred at x = cx. */
export function PenLoop({ parts, cx }: { parts: SchematicParts; cx: number }) {
  const { penR, fill, hatch } = parts;
  return (
    <g>
      <rect x={cx - penR} y="196" width={penR * 2} height="108" rx={penR}
            fill={PAPER} stroke={INK} strokeWidth="1.2" />
      <rect x={cx - penR - 4} y="238" width={penR * 2 + 8} height="20" rx="3"
            fill={fill} stroke={INK} strokeWidth="1.2" />
      <rect x={cx - penR - 4} y="238" width={penR * 2 + 8} height="20" rx="3" fill={hatch} />
    </g>
  );
}
```

Файл 2 — вид спереди. Создать целиком:

```tsx
// components/schematic/views/FrontView.tsx
import { angleSpecs, BRASS_HEX } from '@/lib/data';
import { INK, LINE, MUTED } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Labels, Notes, PenLoop, type ViewProps } from '../schematic-parts';

export default function FrontView({ config, compact, parts }: ViewProps) {
  const { fill, hatch, stitch, elastic, hasElastic, hasBuckle, hasPen, embossFont } = parts;

  const notes: string[] = [];
  if (hasElastic) notes.push('elastic band runs around the cover; knot is on the back');
  if (hasBuckle) notes.push('solid brass buckle, strap in the cover leather');
  if (hasPen) notes.push(parts.penLabel);
  if (notes.length === 0) notes.push(...angleSpecs.front.mustShow.slice(0, 3));

  return (
    <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
         aria-label={`Technical drawing: ${parts.leatherName} cover in ${parts.colorName}, front view`}>
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
      {hasPen && <PenLoop parts={parts} cx={115} />}

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

      {!compact && <Labels parts={parts} />}
      {!compact && <Notes lines={notes} />}
    </svg>
  );
}
```

Файл 3 — вид сзади. Создать целиком:

```tsx
// components/schematic/views/BackView.tsx
import { INK, LINE, PAPER } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Labels, Notes, PenLoop, type ViewProps } from '../schematic-parts';

export default function BackView({ compact, parts }: ViewProps) {
  const { fill, hatch, stitch, elastic, hasElastic, hasBuckle, hasPen } = parts;

  const notes: string[] = [];
  if (hasElastic) {
    notes.push('elastic knot on the outside — visible on the finished cover');
    notes.push('two holes stay even if the band is ever removed');
  }
  if (hasBuckle) notes.push('strap anchored here, wraps around the fore-edge');
  if (hasPen) notes.push(parts.penLabel);
  if (notes.length === 0) notes.push('no closure — no holes, no hardware');

  return (
    <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
         aria-label={`Technical drawing: ${parts.leatherName} cover in ${parts.colorName}, back view`}>
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

      {hasPen && <PenLoop parts={parts} cx={285} />}

      {!compact && <Labels parts={parts} />}
      {!compact && <Notes lines={notes} />}
    </svg>
  );
}
```

Файл 4 — вид разворота. Создать целиком:

```tsx
// components/schematic/views/OpenView.tsx
import { angleSpecs, SCHEMATIC_NOTE } from '@/lib/data';
import { INK, LINE, MUTED, ALERT, PAPER } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Labels, type ViewProps } from '../schematic-parts';

/** Card slot geometry: card 85.6 × 54 mm drawn as 100 × 63, stacked with a 16 step. */
const SLOT_W = 100;
const SLOT_H = 63;
const SLOT_STEP = 16;
const SLOT_X = 80;
const SLOT_BOTTOM = 220;

export default function OpenView({ config, compact, parts }: ViewProps) {
  const { fill, hatch, stitch, elastic, insertCount } = parts;
  const slotTop = SLOT_BOTTOM - SLOT_H - (config.cardSlots - 1) * SLOT_STEP;

  return (
    <svg viewBox="0 0 400 300" className="block h-auto w-full" role="img"
         aria-label={`Technical drawing: ${parts.leatherName} cover in ${parts.colorName}, opened flat`}>
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
          const y = slotTop + i * SLOT_STEP;
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

      {/* inserts on the right half */}
      {Array.from({ length: insertCount }).map((_, i) => (
        <rect key={i} x={212 + i * 6} y={64 + i * 4} width="112" height="156" rx="2"
              fill={PAPER} stroke={INK} strokeWidth="0.9" />
      ))}
      {/* spine elastic that holds the inserts — always there, in the band colour */}
      <line x1="200" y1="46" x2="200" y2="238" stroke={elastic} strokeWidth="2.5" />
      <rect x="72" y="64" width="256" height="156" rx="3" fill="none"
            stroke={stitch} strokeWidth="1.3" strokeDasharray="4 4" />

      {!compact && <Labels parts={parts} />}
      {!compact && (
        <>
          <text x="20" y="252" fontSize="9.5" fill={MUTED}>
            → {angleSpecs.open.mustShow.join(' · ')}
          </text>
          {config.cardSlots > 0 && (
            <text x="20" y="266" fontSize="9.5" fill={MUTED}>
              → card slots × {config.cardSlots}, inside the front cover
            </text>
          )}
          <text x="20" y="286" fontSize="9.5" fontWeight="600" fill={ALERT}>{SCHEMATIC_NOTE}</text>
        </>
      )}
    </svg>
  );
}
```

Файл 5 — макро-вид. Создать целиком:

```tsx
// components/schematic/views/DetailView.tsx
import { SCHEMATIC_NOTE } from '@/lib/data';
import { INK, LINE, MUTED, ALERT } from '@/lib/schematic-tokens';
import HatchDefs from '../HatchDefs';
import { Labels, type ViewProps } from '../schematic-parts';

export default function DetailView({ compact, parts }: ViewProps) {
  const { fill, hatch, stitch } = parts;

  return (
    <svg viewBox="0 0 400 400" className="block h-auto w-full" role="img"
         aria-label={`Macro technical drawing: ${parts.leatherName} stitched corner`}>
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
      {!compact && <Labels parts={parts} />}
    </svg>
  );
}
```

Файл 6 — диспетчер. Заменить `components/schematic/SchematicCover.tsx` целиком:

```tsx
// components/schematic/SchematicCover.tsx
import type { Configuration, Angle } from '@/types/config';
import { previewFilename } from '@/lib/assets';
import { schematicParts } from './schematic-parts';
import FrontView from './views/FrontView';
import BackView from './views/BackView';
import OpenView from './views/OpenView';
import DetailView from './views/DetailView';

interface Props {
  config: Configuration;
  angle: Angle;
  /** Small thumbnail: hide callouts, labels and file name */
  compact?: boolean;
}

const views = {
  front: FrontView,
  back: BackView,
  open: OpenView,
  detail: DetailView,
} as const;

export default function SchematicCover({ config, angle, compact = false }: Props) {
  const View = views[angle];
  const parts = schematicParts(config);

  return (
    <div className="w-full">
      <View config={config} compact={compact} parts={parts} />

      {/* 'back' has no photo counterpart, so it has no file name either. */}
      {!compact && angle !== 'back' && (
        <p className="mt-2 text-center font-mono text-[11px] text-muted">
          {previewFilename(config.leather, config.color, angle)}
        </p>
      )}
    </div>
  );
}
```

### Steps
1. Создать `schematic-parts.tsx`.
2. Создать папку `components/schematic/views/` и четыре файла в ней — код копируется дословно, ничего дописывать не нужно.
3. Заменить `SchematicCover.tsx`.
4. `npx tsc --noEmit && npm run build`.
5. **Сверка глазами — обязательна.** Открыть каждую ссылку и переключить все четыре вкладки, сравнивая с тем, что было до задачи:

   | Ссылка | Что смотреть |
   |---|---|
   | `/en/configurator?closure=buckle&pen=wide&cards=3&emboss=ab&leather=croc` | пряжка, петля, буквы «AB», чешуйки |
   | `/en/configurator?closure=elastic&elastic=brown&leather=suede` | вкладка Back: две дырки, узелок, два хвостика |
   | `/en/configurator?closure=none&cards=4&size=a5` | вкладка Open: четыре кармана; вкладка Back: чистая обложка |
   | `/en/configurator?emboss=ab&pos=spine&thread=cream` | буквы вертикально на корешке, кремовый пунктир |
   | `/en/shotlist` | миниатюры на месте, без фурнитуры |
   | `/en` | секция кожи, макро-чертёж в табах |

6. Коммит.

### Do NOT
- ❌ **Не менять ни одной координаты, ни одного цвета, ни одной подписи.** Это перенос, а не редизайн. Если после задачи чертёж выглядит иначе — где-то опечатка, искать её, а не «поправлять на глаз».
- ❌ Не переносить константы `SLOT_*` в `schematic-parts.tsx` — они нужны только виду `open`.
- ❌ Не добавлять `'use client'` в новые файлы: `SchematicCover` рендерится и на сервере.

### Acceptance
- [ ] `wc -l components/schematic/SchematicCover.tsx` — меньше 45 строк
- [ ] Все шесть ссылок из таблицы выглядят точно так же, как до задачи
- [ ] `npm run build` зелёная

---

## T-161 — Общие названия вариантов в отдельном разделе словаря

**Depends on:** T-160
**Estimate:** 1–1.5ч
**Files:** `types/i18n.ts`; `content/i18n/dict/en.ts`, `pl.ts`, `de.ts`, `by.ts`, `uk.ts`; `components/configurator/ClosureSelector.tsx`, `PenHolderSelector.tsx`, `EmbossingInput.tsx`, `StickyBar.tsx`; `components/cart/CartDrawer.tsx`
**Замечание:** R-11

### Business
Корзина сейчас читает пять ключей из раздела `configurator`: названия застёжек, держателей, позиций тиснения и слова про срок. Формально это чужой раздел: переименование «для конструктора» молча меняет текст в корзине и наоборот. Заводим раздел `options` — там названия того, что пользователь выбрал. В `configurator` остаются только подписи шагов и подсказки самого конструктора.

### Steps

1. `types/i18n.ts` — **удалить** из интерфейса `configurator` пять полей: `embossingPositions`, `embossingFonts`, `closures`, `penHolders`, `readyIn`, `workingDays` (шесть строк-полей; `embossingPositionLabel`, `embossingFontLabel`, `penHolderHelp`, `penHolderGuideLabel`, `madeToOrder`, `inStock` — **оставить**).

2. `types/i18n.ts` — добавить новый раздел сразу после закрывающей скобки `configurator` и перед `cart`:
   ```ts
     /** Names of the values a customer picks. Read by both the configurator and the cart. */
     options: {
       closures: Record<ClosureCode, { title: string; note: string }>;
       penHolders: Record<PenHolderCode, { title: string; meta: string }>;
       embossingFonts: Record<EmbossingFont, string>;
       embossingPositions: Record<EmbossingPosition, string>;
       readyIn: string;
       workingDays: string;
     };
   ```

3. В каждом из пяти словарей: **вырезать** из объекта `configurator` блоки `closures`, `penHolders`, `embossingFonts`, `embossingPositions` и строки `readyIn`, `workingDays`, и **вставить их без изменений** в новый объект `options`, который идёт сразу после `configurator`. Тексты не переписывать — только переложить. Для `en.ts` результат:

   ```ts
     options: {
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
       penHolders: {
         none: { title: 'No pen loop', meta: '' },
         slim: { title: 'Slim pen', meta: 'Ø up to {max} mm' },
         wide: { title: 'Wide pen', meta: 'Ø {min}–{max} mm' },
       },
       embossingFonts: {
         serif: 'Serif',
         sans: 'Sans',
       },
       embossingPositions: {
         'bottom-right': 'Bottom right',
         spine: 'Spine',
       },
       readyIn: 'Ready in',
       workingDays: 'working days',
     },
   ```
   Для `pl`, `de`, `by`, `uk` — то же самое со своими текстами, взятыми из их же файлов.

4. Заменить обращения в пяти компонентах. Всего девять строк:

   `ClosureSelector.tsx`
   ```diff
   -  const current = dict.configurator.closures[config.closure];
   +  const current = dict.options.closures[config.closure];
   ```
   ```diff
   -            title: dict.configurator.closures[c.code].title,
   +            title: dict.options.closures[c.code].title,
   ```

   `PenHolderSelector.tsx`
   ```diff
   -            title: dict.configurator.penHolders[p.code].title,
   -            meta: dict.configurator.penHolders[p.code].meta
   -              ? fill(dict.configurator.penHolders[p.code].meta, { min: p.minMm, max: p.maxMm })
   +            title: dict.options.penHolders[p.code].title,
   +            meta: dict.options.penHolders[p.code].meta
   +              ? fill(dict.options.penHolders[p.code].meta, { min: p.minMm, max: p.maxMm })
                  : undefined,
   ```

   `EmbossingInput.tsx`
   ```diff
   -                  {dict.configurator.embossingFonts[f]}
   +                  {dict.options.embossingFonts[f]}
   ```
   ```diff
   -                  {dict.configurator.embossingPositions[p]}
   +                  {dict.options.embossingPositions[p]}
   ```

   `StickyBar.tsx`
   ```diff
   -              {dict.configurator.readyIn} {priced.productionDays} {dict.configurator.workingDays}
   +              {dict.options.readyIn} {priced.productionDays} {dict.options.workingDays}
   ```

   `CartDrawer.tsx` — четыре обращения:
   ```diff
   -      ? `${dict.configurator.closures.elastic.title} · ${dict.elasticColors[c.elasticColor]}`
   -      : dict.configurator.closures[c.closure].title;
   +      ? `${dict.options.closures.elastic.title} · ${dict.elasticColors[c.elasticColor]}`
   +      : dict.options.closures[c.closure].title;
   ```
   ```diff
   -      ? `${dict.cart.penHolder}: ${dict.configurator.penHolders[c.penHolder].title} (${dict.configurator.penHolders[c.penHolder].meta})`
   +      ? `${dict.cart.penHolder}: ${dict.options.penHolders[c.penHolder].title}`
   ```
   ⚠️ В корзине диаметр из строки **убирается совсем**: подставлять туда `{min}`/`{max}` негде, а показывать шаблон с фигурными скобками нельзя. Название петли остаётся.
   ```diff
   -      ? `${dict.cart.embossing}: “${c.embossing.text}” (${dict.configurator.embossingPositions[c.embossing.position]})`
   +      ? `${dict.cart.embossing}: “${c.embossing.text}” (${dict.options.embossingPositions[c.embossing.position]})`
   ```
   ```diff
   -    `${dict.configurator.readyIn} ${c.productionDays} ${dict.configurator.workingDays}`,
   +    `${dict.options.readyIn} ${c.productionDays} ${dict.options.workingDays}`,
   ```

5. `npx tsc --noEmit` — компилятор покажет все места, где остались старые обращения или где в словаре чего-то не хватает. Чинить, пока не станет пусто.

6. `npm run build`, проверить `/pl/configurator` и корзину с добавленной позицией: все подписи на польском, ни одной фигурной скобки на экране.

7. Коммит.

### Do NOT
- ❌ Не переписывать тексты при переносе. Один и тот же текст, другое место в объекте.
- ❌ Не переносить `embossingPositionLabel`, `embossingFontLabel`, `penHolderHelp`, `penHolderGuideLabel` — это подписи полей конструктора, они остаются в `configurator`.
- ❌ Не трогать `madeToOrder` и `inStock`.

### Acceptance
- [ ] `grep -rn "dict.configurator.closures\|dict.configurator.penHolders\|dict.configurator.embossing[FP]\|dict.configurator.readyIn\|dict.configurator.workingDays" components` — пусто
- [ ] На `/pl/configurator` и в корзине нет ни одной фигурной скобки и ни одного английского слова у новых осей
- [ ] `npm run build` зелёная

---

## T-162 — Приёмка эпика

**Depends on:** T-161
**Estimate:** 40 мин
**Files:** `STATUS.md`; никакого нового кода

### Steps

1. Прогнать всё:
   ```bash
   npx tsc --noEmit && npm run lint && npm run build && npm run shotlist
   ```
   Всё должно быть зелёным.

2. Прогнать проверки, которые остались от эпика 9 — каждая должна вернуть пусто:
   ```bash
   grep -rn "engraving\|Engraving" app components lib content store types scripts
   grep -rn "veg-tan\|crazy-horse\|pull-up" app components lib content store types scripts
   grep -rnw "cord\|cords\|CordCode" app components lib content store types scripts
   grep -rn "kroja:" app components lib content store types
   ```

3. Прогнать новые проверки этого эпика — тоже пусто:
   ```bash
   grep -rn "const INK = \|const LINE = \|const MUTED = \|const PAPER = \|const ALERT = " components
   grep -rn "from '@/content/" components/configurator components/schematic
   grep -rn "Ø 10\|Ø up to 10\|10–13" components content
   grep -rn "h-11 w-11 rounded-sm border border-line text-lg" components/configurator
   grep -rn "dict.configurator.closures\|dict.configurator.penHolders\|dict.configurator.readyIn" components
   ```

4. Ручная проверка по ссылкам — открыть каждую, сверить цену и картинку:

   | Ссылка | Ожидание |
   |---|---|
   | `/en/configurator` | 325 zł, гладкая кожа, cognac, резинка чёрная |
   | `/en/configurator?pen=slim` | 345 zł, петля на корешке |
   | `/en/configurator?cards=4&size=a5` | 335 zł, во вкладке Open четыре кармана и подпись под чертежом |
   | `/en/configurator?size=a6&cards=4&inserts=4:dot,4:plain` | 2 кармана, 2 вкладыша, два тоста |
   | `/en/configurator?closure=buckle&pen=wide&cards=3&emboss=ab` | 525 zł |
   | `/en/configurator?closure=elastic&elastic=brown` → вкладка Back | узелок и две дырки коричневым |
   | `/en/configurator?color=black` | свотч нити «в тон» с пунктирной рамкой |
   | `/en/shotlist` | 81 кадр, на миниатюрах нет фурнитуры |
   | `/pl/…`, `/de/…`, `/by/…`, `/uk/…` | ни одной английской подписи, ни одной фигурной скобки |
   | Заголовки трёх вкладок | «Naked Skin» не повторяется дважды |

5. В `STATUS.md`, в таблице эпика 10, проставить всем задачам ✅ с хешами коммитов. Если по ходу что-то сделано не как в задаче — строка в разделе «Расхождения» эпика 10.

6. Коммит: `T-162: epic 10 acceptance`.

### Acceptance
- [ ] Все команды из шагов 1–3 зелёные или пустые
- [ ] Все строки таблицы из шага 4 проверены вручную и совпали
- [ ] `STATUS.md` актуален, у всех задач эпика 10 проставлены коммиты

---

## Что после эпика

Не делать без отдельного указания:

- автотесты на `lib/pricing`, `lib/availability`, `lib/config-url` — отдельная задача, если пользователь попросит;
- миграция с `next lint` на ESLint CLI (команда объявлена устаревшей в Next 16);
- вынос домена `nakedskin.vercel.app` из трёх файлов в переменную окружения;
- всё, что ждёт ответов мастера — см. `kroja-spec/17-axes-change.md`, §10.
