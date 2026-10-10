# TASKS 9 — Конструктор на телефоне (EPIC 14)

Задачи T-190 … T-204. Источник — юзабилити-разбор от 05.10.2026. Описание проблем с замерами — `kroja-spec/19-mobile-ux-issues.md` (ID U-1 … U-13).

**Что делаем одной фразой:** на телефоне покупатель должен видеть результат своего выбора, видеть цену и не пролистывать 6,6 экрана настроек, которые уже выставлены по умолчанию.

**Чего не делаем:** не убираем ни одной опции, не меняем правила в `lib/availability.ts`, `lib/pricing.ts`, формат ссылки и модель карманов (D-04). Меняется только подача.

---

> ⚠️ **Шесть правил эпика. Прочитать до первой строки кода.**
>
> **1. Порядок строгий, по номерам.** T-195 (шапка) обязана быть раньше T-197 (мини-превью липнет к `top-0`). T-196 раньше T-197 и T-199 (состояние ракурса). T-198 раньше T-199. T-199 раньше T-200, T-201, T-203.
>
> **2. Сборка зелёная после каждой задачи:**
> ```bash
> npx tsc --noEmit && npm run lint && npm run build
> ```
> `npm run lint` включает `npm run i18n` — он должен печатать 0 / 0.
>
> **3. Каждая задача проверяется в браузере на телефонной ширине.** Минимум: 375 × 812 с мобильной эмуляцией и 320 × 568. Задачи, где меняется текст, — во всех шести языках. Проверка ширины страницы — в консоли:
> ```js
> document.scrollingElement.scrollWidth === innerWidth   // должно быть true
> ```
>
> **4. Новые тексты — только через словарь, на шесть языков** (en, pl, de, by, uk, ru). В задачах даны en и ru целиком; pl, de, by, uk — перевести по терминологии из `TASKS-8-i18n-gaps.md`. Плейсхолдеры `{front}`, `{qty}` не трогать.
>
> **5. Десктоп не ломать.** После каждой задачи открыть 1280 × 800 и убедиться, что раскладка «превью слева, опции справа» работает как раньше.
>
> **6. Один коммит на задачу, сразу.** Формат: `T-1XX: краткое описание`.

---

## Карта задач

| ID | Задача | Проблема | Серьёзность | Оценка |
|---|---|---|---|---|
| T-190 | Убрать горизонтальную прокрутку | U-1 | 🔴 | 20 мин |
| T-191 | Убрать служебный текст с превью | U-10 | 🟡 | 10 мин |
| T-192 | Зоны нажатия ≥ 44px | U-12 | 🟡 | 20 мин |
| T-193 | Контраст и размер мелкого текста | U-11 | 🟡 | 20 мин |
| T-194 | Схема размеров — в секцию «Размер» | U-4 | 🟡 | 30 мин |
| T-195 | Шапка на странице конструктора | U-9 | 🟢 | 20 мин |
| T-196 | Ракурс превью — состояние страницы | U-2 (подготовка) | — | 20 мин |
| T-197 | Закреплённое мини-превью на телефоне | U-2 | 🔴 | 1,5 ч |
| T-198 | Сворачиваемая секция и сводки | U-3, U-13 | 🔴 | 1 ч |
| T-199 | Группы «Основное» и «Детали» | U-3, U-13 | 🔴 | 1,5 ч |
| T-200 | Карманы: готовые раскладки | U-5 | 🟡 | 2 ч |
| T-201 | Петля: круги только на большом экране | U-6 | 🟡 | 20 мин |
| T-202 | Карточки-строки на узком экране | U-8 | 🟢 | 45 мин |
| T-203 | Подарочная коробка отдельной строкой | U-7 | 🟡 | 30 мин |
| T-204 | Приёмка эпика и документация | все | — | 1 ч |

---

## T-190 — Убрать горизонтальную прокрутку

**Problem:** U-1
**Depends on:** —
**Files:** `components/configurator/ConfiguratorClient.tsx`, `components/configurator/Preview.tsx`, `components/configurator/StickyBar.tsx`

### Business
На телефоне страница шире экрана (393px при 375px). В мобильном браузере из-за этого уменьшается масштаб, и нижняя плашка с ценой и кнопкой «В корзину» уходит за край наполовину. Это самая дорогая проблема эпика и самая дешёвая в исправлении.

### Причина
Сетка без шаблона колонок на мобильном: неявная колонка `auto` растягивается под минимальную ширину содержимого. Самое широкое содержимое — четыре вкладки ракурсов `flex-1 px-3` (373px).

### Steps

1. **`ConfiguratorClient.tsx`** — дать сетке колонку, которая не растягивается по содержимому:
   ```diff
   - <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
   + <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
   ```

2. **`Preview.tsx`** — ряд вкладок прокручивается сам, если не помещается, а не раздвигает страницу. Высота вкладки — 44px (заодно закрывает U-12 для вкладок):
   ```diff
   - <div className="flex gap-2" role="tablist" aria-label={dict.a11y.previewAngle}>
   + <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label={dict.a11y.previewAngle}>
   ```
   ```diff
     className={clsx(
   -   'flex-1 rounded-sm border px-3 py-2 text-xs transition-colors duration-150',
   +   'h-11 min-w-max flex-1 whitespace-nowrap rounded-sm border px-2 text-xs transition-colors duration-150',
   ```

3. **`StickyBar.tsx`** — на 320px кнопка `lg` (`px-8`) не должна сжимать блок цены:
   ```diff
   - <div>
   + <div className="min-w-0">
   ```
   ```diff
   - <Button size="lg" onClick={handleAdd}>
   + <Button size="lg" onClick={handleAdd} className="shrink-0 !px-5 sm:!px-8">
   ```
   `!` нужен, потому что `className` дописывается после `px-8` из `sizes.lg`, а порядок двух `px-*` в CSS не гарантирован.

### Do NOT
- Не ставить `overflow-x: hidden` на `body`, `main` или контейнер. Это спрячет следующую такую же ошибку, а не исправит её.
- Не сокращать названия ракурсов в словаре.

### Acceptance
- [ ] 375 × 812 с мобильной эмуляцией, все 6 языков: `scrollWidth === innerWidth`
- [ ] То же на 320 × 568
- [ ] Нижняя плашка видна целиком: цена, срок, кнопка «В корзину»
- [ ] На 320px в немецком (самая длинная кнопка) цена не обрезается и не переносится посимвольно
- [ ] Строка «Подарочная коробка» вместе с галочкой — в пределах экрана
- [ ] Вкладки ракурсов 44px в высоту
- [ ] 1280 × 800: раскладка не изменилась

---

## T-191 — Убрать служебный текст с превью

**Problem:** U-10
**Depends on:** T-190
**Files:** `components/schematic/SchematicCover.tsx`, `components/configurator/Preview.tsx`

### Business
Под чертежом печатается имя файла `smooth_cognac_front.webp`, а оговорка «это не фотография» повторена дважды. Имя файла — заметка для фотографа; у неё есть своё место, страница `/shotlist`. Сайт должен выглядеть как работающий магазин. Оговорка нужна (D-01), но одна — та, что внутри чертежа.

### Steps

1. **`SchematicCover.tsx`** — удалить абзац с именем файла и ставший ненужным импорт:
   ```diff
   - import { previewFilename } from '@/lib/assets';
   ```
   ```diff
         <View config={config} compact={compact} parts={parts} dict={dict} />
   -
   -     {/* 'back' has no photo counterpart, so it has no file name either. */}
   -     {!compact && angle !== 'back' && (
   -       <p className="mt-2 text-center font-mono text-[11px] text-muted">
   -         {previewFilename(config.leather, config.color, angle)}
   -       </p>
   -     )}
   ```
   Если после этого `angle` используется только для выбора вида — так и должно быть. Обновить JSDoc у `compact`: `/** Small thumbnail: hide callouts and labels */`.

2. **`Preview.tsx`** — удалить абзац-оговорку под вкладками и импорт `SHOW_SCHEMATIC_NOTES`, если он больше нигде в файле не нужен:
   ```diff
   - {SHOW_SCHEMATIC_NOTES && (
   -   <p className="text-xs leading-relaxed text-muted">{dict.leather.schematicNote}</p>
   - )}
   ```

### Do NOT
- Не трогать `previewFilename` в `lib/assets.ts` — её использует `lib/shotlist.ts`.
- Не убирать красную оговорку `dict.schematic.note` внутри чертежа (`Notes` в `schematic-parts.tsx`) — это D-01.
- Не удалять ключ `dict.leather.schematicNote` — он используется на лендинге (`Leather.tsx`).

### Acceptance
- [ ] Ни на конструкторе, ни на лендинге под чертежом нет имени файла
- [ ] Оговорка «СХЕМАТИЧНЫЙ ЧЕРТЁЖ» внутри чертежа на месте
- [ ] Страница `/shotlist` по-прежнему показывает имена файлов кадров
- [ ] `npm run i18n` — 0 / 0 (ключ `schematicNote` не стал мёртвым)

---

## T-192 — Зоны нажатия ≥ 44px

**Problem:** U-12
**Depends on:** T-191
**Files:** `components/configurator/PocketsSelector.tsx`, `components/configurator/EmbossingInput.tsx`, `components/configurator/RestoreBanner.tsx`

### Business
Палец промахивается мимо целей меньше 44 × 44: галочка «Разделить на два» — 16px, стрелки кармана — 36px. На редакторе карманов это превращается в «нажал не то и удалил карман».

### Steps

1. **`PocketsSelector.tsx`**
   - Кнопки ↑ ↓ ×:
     ```diff
     - 'h-9 w-9 shrink-0 rounded-sm border …
     + 'h-11 w-11 shrink-0 rounded-sm border …
     ```
   - «Разделить на два» — вся подпись становится целью высотой 44px, галочка 20px:
     ```diff
     - <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
     + <label className="flex min-h-11 cursor-pointer items-center gap-2 pr-2 text-xs text-ink-soft">
     ```
     ```diff
     -   className="h-4 w-4 accent-[#8B4A2B]"
     +   className="h-5 w-5 accent-[#8B4A2B]"
     ```
   - Ряд «галочка + три кнопки» на 320px не помещается в одну строку — разрешить перенос:
     ```diff
     - <div className="mt-2 flex items-center justify-between gap-2">
     + <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
     ```

2. **`EmbossingInput.tsx`** — кнопки шрифта и места: `h-9` → `h-11` (оба места).

3. **`RestoreBanner.tsx`** — обе кнопки `size="sm"` → `size="md"`.

### Do NOT
- Не менять размер круга образца цвета (`Swatch`): кнопка образца 72px × ~70px, цель уже достаточная.

### Acceptance
- [ ] Скрипт в консоли на 375px возвращает пустой список (кроме нативных чекбоксов внутри `<label>` высотой ≥ 44px):
  ```js
  [...document.querySelectorAll('main button, main input, main label')]
    .map(e => [e, e.getBoundingClientRect()])
    .filter(([, r]) => r.width > 0 && (r.height < 44 || r.width < 44))
    .map(([e, r]) => `${e.tagName} ${(e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30)} ${Math.round(r.width)}×${Math.round(r.height)}`)
  ```
- [ ] Строка кармана на 320px не вылезает за рамку, кнопки переносятся под галочку

---

## T-193 — Контраст и размер мелкого текста

**Problem:** U-11
**Depends on:** T-192
**Files:** `tailwind.config.ts`, `lib/schematic-tokens.ts`, `components/ui/Swatch.tsx`, `components/configurator/PocketsSelector.tsx`

### Business
Серый `muted` (#8A7F72) даёт 3,67 : 1 на фоне страницы и 3,36 : 1 на карточках — ниже порога WCAG AA 4,5 : 1. Им набраны все подсказки, размеры и подписи, часто 10–11px. На телефоне на улице их не прочитать.

> Решение № 2 из `kroja-spec/19-mobile-ux-issues.md` (принято 09.10.2026): токен темнеет на всём сайте — бледный текст не проходит контраст везде, не только в конструкторе.

### Steps

1. **`tailwind.config.ts`**:
   ```diff
   - muted: '#8A7F72',      // подписи, мелкий текст
   + muted: '#73695D',      // подписи, мелкий текст. 5,03 : 1 на paper, 4,61 : 1 на paper-2
   ```

2. **`lib/schematic-tokens.ts`**: `MUTED = '#8A7F72'` → `'#73695D'`. Подписи чертежа должны совпадать с подписями интерфейса.

3. **`Swatch.tsx`** — подпись образца с 11px до 12px; пометки «под заказ» и причины — с 10px до 11px. Чтобы «Натуральный» и «Natural linen» поместились, кнопка шире на 4px (4 × 76 + 3 × 8 = 328 < 335 — четыре в ряд на 375px сохраняются):
   ```diff
   - 'group flex w-[72px] flex-col items-center gap-1.5 rounded-sm p-1',
   + 'group flex w-[76px] flex-col items-center gap-1.5 rounded-sm p-1',
   ```
   ```diff
   - <span className="text-center text-[11px] leading-tight text-ink-soft">{label}</span>
   + <span className="text-center text-xs leading-tight text-ink-soft">{label}</span>
   ```
   Два места `text-[10px]` → `text-[11px]`.

4. **`PocketsSelector.tsx`** — подписи «Верх», «Низ», «Добавить карман»: убрать `text-[10px]`, у `.label` уже `text-xs`.
   ```diff
   - <p className="label mb-1 text-[10px]">
   + <p className="label mb-1">
   ```
   (три места). `font-mono text-[11px]` с миллиметрами не трогать — их убирает T-200.

### Do NOT
- Не менять `ink`, `ink-soft`, `accent`, `paper`, `paper-2`, `line`.
- Не менять `#hex` внутри SVG-чертежей, кроме токена `MUTED`.

### Acceptance
- [ ] Контраст `muted` пересчитан: ≥ 4,5 : 1 на `#FAF7F2` и на `#F2EDE4`
- [ ] На 375px в образцах цвета и нити ни одна подпись не выходит за свою кнопку (6 языков)
- [ ] Цветов в ряду на 375px — 4, как и раньше
- [ ] Лендинг и корзина просмотрены глазами: серый текст стал темнее, ничего не сломалось

---

## T-194 — Схема размеров — в секцию «Размер»

**Problem:** U-4
**Depends on:** T-193
**Files:** `components/configurator/Preview.tsx`, `components/configurator/SizeSelector.tsx`, `types/i18n.ts`, `content/i18n/dict/{en,pl,de,by,uk,ru}.ts`

### Business
Схема «блокнот рядом с телефоном» — около 400px между превью и первой опцией. Это ответ на вопрос «какой размер выбрать», и место ему — в секции «Размер», по запросу. На десктопе, где превью закреплено сбоку, схема остаётся на месте.

### Steps

1. **Словарь**, раздел `configurator`:
   ```ts
   sizeCompareShow: string;
   sizeCompareHide: string;
   ```
   | Ключ | en | ru |
   |---|---|---|
   | `sizeCompareShow` | Compare with a phone | Сравнить с телефоном |
   | `sizeCompareHide` | Hide comparison | Скрыть сравнение |

2. **`Preview.tsx`** — блок со схемой только с `lg`:
   ```diff
   - <div className="rounded-sm border border-line p-4">
   + <div className="hidden rounded-sm border border-line p-4 lg:block">
       <SizeDiagram … />
   ```

3. **`SizeSelector.tsx`** — под карточками кнопка-переключатель и та же схема, только ниже `lg`:
   ```tsx
   const [compare, setCompare] = useState(false);
   const panelId = useId();
   …
   <div className="lg:hidden">
     <button
       type="button"
       aria-expanded={compare}
       aria-controls={panelId}
       onClick={() => setCompare((v) => !v)}
       className="mt-2 min-h-11 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
     >
       {compare ? dict.configurator.sizeCompareHide : dict.configurator.sizeCompareShow}
     </button>
     <div id={panelId} hidden={!compare} className="mt-2 rounded-sm border border-line p-4">
       <SizeDiagram
         active={config.size}
         mode="single"
         names={dict.sizes.names}
         mmUnit={dict.units.mm}
         aria={{ single: dict.schematic.sizeDiagramSingle, compare: dict.schematic.sizeDiagramCompare }}
         phoneLabel={dict.schematic.phone}
       />
     </div>
   </div>
   ```
   Пропсы `SizeDiagram` — те же, что в `Preview.tsx`, скопировать оттуда.

### Acceptance
- [ ] 375px: под превью схемы нет; в секции «Размер» есть «Сравнить с телефоном», по нажатию схема появляется и меняется вместе с размером
- [ ] 1280px: схема на прежнем месте под превью, в секции «Размер» кнопки нет
- [ ] Кнопка ≥ 44px в высоту, `aria-expanded` меняется
- [ ] 6 языков, `npm run i18n` — 0 / 0

---

## T-195 — Шапка на странице конструктора

**Problem:** U-9
**Depends on:** T-194
**Files:** `components/landing/Header.tsx`

### Business
На конструкторе шапка закреплена и показывает кнопку «Собрать свой», хотя покупатель уже собирает. Вместе с нижней плашкой служебные полосы занимают 17% экрана. Кроме того, T-197 закрепит мини-превью у верхнего края — две закреплённые полосы друг на друге оставят для опций слишком мало места. Главное действие на этой странице уже в нижней плашке.

### Steps

1. Определить страницу конструктора:
   ```tsx
   import { usePathname } from 'next/navigation';
   …
   const pathname = usePathname();
   const onConfigurator = pathname.endsWith('/configurator');
   ```

2. На конструкторе ниже `lg` шапка не закреплена:
   ```diff
   - <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
   + <header
   +   className={clsx(
   +     'top-0 z-30 border-b border-line bg-paper/95 backdrop-blur',
   +     onConfigurator ? 'relative lg:sticky' : 'sticky',
   +   )}
   + >
   ```

3. На конструкторе нет кнопки «Собрать свой»: обернуть `<Link …>{dict.nav.build}</Link>` в `{!onConfigurator && (…)}`.

4. Логотип в одну строку на всех страницах: добавить `whitespace-nowrap` в `className` ссылки с `dict.brand.name`.

### Do NOT
- Не делать прячущуюся при прокрутке шапку на JS — решение № 5.
- Не трогать навигацию `md:flex`.

### Acceptance
- [ ] 375px, конструктор: шапка уезжает при прокрутке, кнопки «Собрать свой» нет, «Naked Skin» в одну строку
- [ ] 375px, лендинг: шапка закреплена как раньше, кнопка «Собрать свой» на месте, логотип в одну строку, ширина страницы = 375
- [ ] 1280px, конструктор: шапка закреплена; кнопки «Собрать свой» нет
- [ ] Шесть языков, 320px: логотип, переключатель языка и «Корзина» помещаются в шапку (на лендинге — вместе с кнопкой конструктора)

---

## T-196 — Ракурс превью — состояние страницы

**Problem:** U-2 (подготовка)
**Depends on:** T-195
**Files:** новый `components/configurator/usePreviewAngle.ts`, `components/configurator/Preview.tsx`, `components/configurator/ConfiguratorClient.tsx`

### Business
Сейчас ракурс и автопереход на разворот (D-19) живут внутри `Preview`. В T-197 появится второе, мобильное превью, а в T-199 раскрытие секции «Карманы» тоже должно переключать ракурс. Обоим нужно одно общее состояние. Задача чисто техническая: поведение не меняется.

### Steps

1. Создать **`components/configurator/usePreviewAngle.ts`** — перенести туда `insideKey` и эффект из `Preview.tsx` без изменений логики:
   ```ts
   // components/configurator/usePreviewAngle.ts
   'use client';

   import { useEffect, useRef, useState } from 'react';
   import type { Angle, Configuration } from '@/types/config';
   import { serialisePockets } from '@/lib/pockets';

   /** Everything that is only visible on the open spread. A change here switches the view to it. */
   function insideKey(config: Configuration): string {
     const inserts = config.inserts.reduce((sum, i) => sum + i.qty, 0);
     return `${serialisePockets(config.pockets)}#${config.penHolder}#${inserts}`;
   }

   /**
    * The preview angle, shared by the desktop preview, the mobile preview and the option sections.
    * Pockets, the pen loop and the inserts live inside the cover: changing them shows the spread (D-19).
    */
   export function usePreviewAngle(config: Configuration) {
     const [angle, setAngle] = useState<Angle>('front');
     const inside = insideKey(config);
     const lastInside = useRef(inside);

     useEffect(() => {
       if (lastInside.current !== inside) {
         lastInside.current = inside;
         setAngle('open');
       }
     }, [inside]);

     return { angle, setAngle };
   }
   ```

2. **`Preview.tsx`** — стать управляемым компонентом:
   ```ts
   interface Props {
     config: Configuration;
     angle: Angle;
     onAngleChange: (angle: Angle) => void;
   }
   ```
   Удалить `useState`, `useRef`, `useEffect`, `insideKey` и импорт `serialisePockets`. `setAngle(a.angle)` → `onAngleChange(a.angle)`.

3. **`ConfiguratorClient.tsx`**:
   ```tsx
   const { angle, setAngle } = usePreviewAngle(config);
   …
   <Preview config={config} angle={angle} onAngleChange={setAngle} />
   ```

### Acceptance
- [ ] Поведение не изменилось: вкладки переключают ракурс; «+ Средний» в карманах переключает превью на «Развёрнутый»; изменение количества вкладышей и петли — тоже
- [ ] В `Preview.tsx` нет `useState` / `useEffect`

---

## T-197 — Закреплённое мини-превью на телефоне

**Problem:** U-2
**Depends on:** T-196
**Files:** новый `components/configurator/MobilePreview.tsx`, `components/configurator/ConfiguratorClient.tsx`, `types/i18n.ts`, `content/i18n/dict/{en,pl,de,by,uk,ru}.ts`

### Business
Главная задача эпика. На телефоне покупатель должен видеть изделие в тот момент, когда меняет его. Решение D-01 — «ось, которую не видно, покупатель воспринимает как несуществующую» — сейчас на мобильном нарушено для всех осей.

Ниже `lg` под заголовком страницы закрепляется полоса высотой ~26% экрана: слева чертёж (компактный, без подписей — при такой высоте они нечитаемы), справа столбик из четырёх вкладок ракурсов. Нажатие на чертёж открывает его крупно, с подписями и оговоркой. Десктоп не меняется.

**Отвергнуто:**
- *Закрепить нынешнее превью целиком* — ~1000px, больше экрана.
- *Миниатюра в нижней плашке* — 48px, деталей (карманы, нить) не видно; это не обратная связь, а иконка.
- *Прятать превью при прокрутке вниз* — пропадает ровно тогда, когда человек выбирает.

### Почему отдельный блок, а не CSS-вариант `Preview`
`position: sticky` липнет только в пределах родителя. На мобильном левая ячейка сетки по высоте равна самому превью — внутри неё закреплять бесполезно. Мини-превью должно быть прямым ребёнком `<main>`, вне сетки.

### Steps

1. **Словарь**, раздел `configurator`:
   ```ts
   previewTitle: string;
   previewExpand: string;
   previewClose: string;
   ```
   | Ключ | en | ru |
   |---|---|---|
   | `previewTitle` | Your notebook | Ваш блокнот |
   | `previewExpand` | Enlarge the drawing | Увеличить чертёж |
   | `previewClose` | Close | Закрыть |

2. Создать **`components/configurator/MobilePreview.tsx`**:
   ```tsx
   // components/configurator/MobilePreview.tsx
   'use client';

   import { useState } from 'react';
   import clsx from 'clsx';
   import type { Angle, Configuration } from '@/types/config';
   import { schematicAngleList } from '@/lib/data';
   import { useI18n } from '@/components/i18n/I18nProvider';
   import SchematicCover from '@/components/schematic/SchematicCover';
   import Modal from '@/components/ui/Modal';
   import Button from '@/components/ui/Button';

   interface Props {
     config: Configuration;
     angle: Angle;
     onAngleChange: (angle: Angle) => void;
   }

   /**
    * Below lg the full preview sits far above the options, so every choice was made blind.
    * This strip stays pinned under the top edge while the options scroll beneath it.
    * Must be a direct child of <main>: sticky only works inside a tall parent.
    */
   export default function MobilePreview({ config, angle, onAngleChange }: Props) {
     const { dict } = useI18n();
     const [expanded, setExpanded] = useState(false);

     return (
       <>
         <div className="sticky top-0 z-20 -mx-5 mb-8 border-b border-line bg-paper/95 px-5 py-2 backdrop-blur md:-mx-8 md:px-8 lg:hidden">
           <div className="flex items-stretch gap-3">
             <button
               type="button"
               onClick={() => setExpanded(true)}
               aria-label={dict.configurator.previewExpand}
               className="relative flex h-[26svh] min-h-[176px] min-w-0 flex-1 items-center justify-center rounded-sm border border-line bg-paper-2 p-1 [&>div]:h-full [&_svg]:mx-auto [&_svg]:h-full [&_svg]:w-auto"
             >
               <SchematicCover config={config} angle={angle} compact />
               <span aria-hidden className="absolute bottom-1 right-2 text-sm text-ink-soft">⤢</span>
             </button>

             <div
               role="tablist"
               aria-label={dict.a11y.previewAngle}
               aria-orientation="vertical"
               className="flex w-28 shrink-0 flex-col gap-1"
             >
               {schematicAngleList.map((a) => (
                 <button
                   key={a.angle}
                   type="button"
                   role="tab"
                   aria-selected={angle === a.angle}
                   onClick={() => onAngleChange(a.angle)}
                   className={clsx(
                     'min-h-11 flex-1 rounded-sm border px-2 text-xs transition-colors duration-150',
                     angle === a.angle ? 'border-ink bg-paper-2 text-ink' : 'border-line text-ink-soft',
                   )}
                 >
                   {dict.angles[a.angle]}
                 </button>
               ))}
             </div>
           </div>
         </div>

         <Modal
           open={expanded}
           title={dict.configurator.previewTitle}
           onClose={() => setExpanded(false)}
           footer={
             <Button variant="secondary" onClick={() => setExpanded(false)}>
               {dict.configurator.previewClose}
             </Button>
           }
         >
           <SchematicCover config={config} angle={angle} />
         </Modal>
       </>
     );
   }
   ```
   Высота: 4 вкладки × 44 + 3 × 4 = 188px, поэтому `min-h-[176px]` + `py-2` вмещают столбик даже на экране 568px.

3. **`ConfiguratorClient.tsx`**:
   - Вставить `<MobilePreview config={config} angle={angle} onAngleChange={setAngle} />` прямым ребёнком `<main>` — после баннера конфликтов, перед сеткой.
   - Левую ячейку сетки с полным превью показать только с `lg`:
     ```diff
     - <div className="lg:sticky lg:top-24 lg:self-start">
     + <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
     ```

### Do NOT
- Не менять координаты и `viewBox` видов чертежа — размер задаётся только снаружи.
- Не рисовать отдельную иконку «увеличить» в SVG — символ `⤢` текстом, `aria-hidden`.
- Не убирать автопереход на разворот (D-19): он теперь наконец виден.

### Acceptance
- [ ] 375 × 812: при прокрутке до любой секции мини-превью видно у верхнего края
- [ ] Выбор цвета, кожи, застёжки, тиснения сразу виден в мини-превью
- [ ] «+ Средний» в карманах — мини-превью само переходит на «Развёрнутый», активная вкладка подсвечена
- [ ] Нажатие на чертёж открывает крупный вид с подписями и оговоркой; Esc и «Закрыть» закрывают, фокус возвращается на чертёж
- [ ] 320 × 568: мини-превью ≤ 200px, четыре вкладки помещаются, ни одна не обрезана (6 языков)
- [ ] Первая опция («Размер») начинается выше 812px на экране 375 × 812
- [ ] 1280px: мини-превью нет, полное превью как раньше
- [ ] Ширина страницы = ширине экрана на 320 и 375

---

## T-198 — Сворачиваемая секция и сводки

**Problem:** U-3, U-13
**Depends on:** T-197
**Files:** новые `components/configurator/OptionSection.tsx` и `components/configurator/summary.ts`, `types/i18n.ts`, `content/i18n/dict/{en,pl,de,by,uk,ru}.ts`

### Business
Строительные блоки для T-199. Секция «Деталей» в свёрнутом виде — одна строка: название, текущий выбор, надбавка. Так покупатель видит, что всё уже выбрано, и открывает только то, что хочет поменять. Здесь же вводится единое правило цен (U-13): надбавка текущего выбора — акцентом, цена невыбранной опции — серым, заголовки без цен.

В этой задаче компоненты только создаются; подключение — T-199. Сборка зелёная, на странице ничего не меняется.

### Steps

1. **Словарь**, раздел `configurator`:
   ```ts
   groupDetails: string;
   groupDetailsHint: string;
   /** Uses {front} and {back} */
   pocketsSummary: string;
   /** Uses {qty} and {name} */
   insertsSummary: string;
   ```
   | Ключ | en | ru |
   |---|---|---|
   | `groupDetails` | Details | Детали |
   | `groupDetailsHint` | Already set up for you — open a line to change it. | Уже настроено за вас — откройте строку, чтобы изменить. |
   | `pocketsSummary` | Front: {front} · Back: {back} | Спереди: {front} · Сзади: {back} |
   | `insertsSummary` | {qty} × {name} | {qty} × {name} |

   «Спереди: 1» вместо «1 карман спереди» — чтобы не зависеть от склонения числительных в by, uk, ru, pl.

2. Создать **`components/configurator/OptionSection.tsx`**:
   ```tsx
   // components/configurator/OptionSection.tsx
   'use client';

   import { useId, type ReactNode } from 'react';
   import clsx from 'clsx';

   interface Props {
     title: string;
     /** Collapsible sections show the current choice in one line. Main sections pass nothing. */
     summary?: string;
     /** Price note in the collapsed line, e.g. "+20 zł" or "Included". */
     delta?: string;
     /** true — already in the total (accent); false — what it would cost (muted). */
     deltaActive?: boolean;
     /** Passing onToggle makes the section collapsible. */
     open?: boolean;
     onToggle?: () => void;
     children: ReactNode;
   }

   export default function OptionSection({
     title, summary, delta, deltaActive = false, open = false, onToggle, children,
   }: Props) {
     const panelId = useId();

     if (!onToggle) {
       return (
         <section>
           <h2 className="label mb-3">{title}</h2>
           {children}
         </section>
       );
     }

     return (
       <section className="border-b border-line">
         <h3>
           <button
             type="button"
             aria-expanded={open}
             aria-controls={panelId}
             onClick={onToggle}
             className="flex min-h-14 w-full items-center gap-3 py-3 text-left"
           >
             <span className="label shrink-0">{title}</span>
             <span className="ml-auto min-w-0 truncate text-right text-sm text-ink">{summary}</span>
             {delta && (
               <span className={clsx('shrink-0 text-xs', deltaActive ? 'text-accent' : 'text-muted')}>
                 {delta}
               </span>
             )}
             <span
               aria-hidden
               className={clsx(
                 'shrink-0 text-lg leading-none text-muted transition-transform duration-150',
                 open && 'rotate-45',
               )}
             >
               +
             </span>
           </button>
         </h3>
         <div id={panelId} hidden={!open} className="pb-6">
           {children}
         </div>
       </section>
     );
   }
   ```

3. Создать **`components/configurator/summary.ts`** — чистые функции, язык приходит словарём (D-12):
   ```ts
   // components/configurator/summary.ts
   // One-line summaries of the collapsed "Details" sections. Codes in, words out.
   import type { Configuration } from '@/types/config';
   import type { Dictionary } from '@/types/i18n';
   import { PEN_HOLDER_MINOR } from '@/lib/data';
   import { calculatePrice } from '@/lib/pricing';
   import { fill, formatDelta } from '@/lib/format';

   export type DetailId = 'thread' | 'penHolder' | 'pockets' | 'inserts';

   export const DETAIL_IDS: DetailId[] = ['thread', 'penHolder', 'pockets', 'inserts'];

   export interface SectionSummary {
     summary: string;
     delta?: string;
     deltaActive?: boolean;
   }

   export function detailSummaries(
     config: Configuration,
     dict: Dictionary,
   ): Record<DetailId, SectionSummary> {
     const price = calculatePrice(config);

     return {
       thread: {
         summary: dict.threads[config.thread],
         delta: formatDelta(price.threadMinor) || undefined,
         deltaActive: true,
       },
       penHolder: {
         summary: dict.options.penHolders[config.penHolder].title,
         delta: formatDelta(price.penHolderMinor || PEN_HOLDER_MINOR),
         deltaActive: price.penHolderMinor > 0,
       },
       pockets: {
         summary: fill(dict.configurator.pocketsSummary, {
           front: config.pockets.front.length,
           back: config.pockets.back.length,
         }),
         delta: dict.configurator.pocketsIncluded,
         deltaActive: false,
       },
       inserts: {
         summary: config.inserts
           .map((i) => fill(dict.configurator.insertsSummary, { qty: i.qty, name: dict.insertTypes[i.type] }))
           .join(', '),
         delta: formatDelta(price.insertsMinor) || undefined,
         deltaActive: true,
       },
     };
   }
   ```

4. Пока ключи не используются на странице, `npm run i18n` покажет их мёртвыми, если детектор не видит `summary.ts`. Детектор сканирует `components/` — `summary.ts` их читает, мёртвых быть не должно. `groupDetails` и `groupDetailsHint` станут живыми в T-199: если детектор на них ругается — допустимо **только в этом коммите**, записать в заметку задачи.

### Do NOT
- Не использовать существующий `components/ui/Accordion.tsx`: у него тело — строка, а нужны селекторы.
- Не писать цены в `summary.ts` числами — только из `calculatePrice` и констант `lib/data`.

### Acceptance
- [ ] `npx tsc --noEmit` зелёный
- [ ] Страница выглядит как до задачи
- [ ] Сводки для конфигурации по умолчанию (ru): «В тон коже»; «Без петли для ручки · +20 zł» серым; «Спереди: 1 · Сзади: 0 · В цене» серым; «1 × В точку» без надбавки. Строки «Тиснение» нет — оно не входит в «Детали»

---

## T-199 — Группы «Основное» и «Детали»

**Problem:** U-3, U-13
**Depends on:** T-198
**Files:** `components/configurator/ConfiguratorClient.tsx`, все селекторы: `SizeSelector.tsx`, `LeatherSelector.tsx`, `ColorSelector.tsx`, `ThreadSelector.tsx`, `ClosureSelector.tsx`, `PenHolderSelector.tsx`, `PocketsSelector.tsx`, `InsertsSelector.tsx`, `EmbossingInput.tsx`

### Business
Девять раскрытых секций: четыре основные остаются открытыми, четыре уходят в свёрнутые строки «Деталей», тиснение остаётся открытым в конце. Опций не становится меньше — они показываются по запросу. Ожидаемая высота страницы на 375px с закрытыми «Деталями» — около 2,6 экрана вместо 6,6.

Решение № 1 (принято 09.10.2026): сворачивание работает на всех ширинах, включая десктоп. Одно поведение — одна модель в голове покупателя и один код.

**Тиснение в «Детали» не входит** (ревью 09.10.2026). Это эмоциональная опция и допродажа +40 zł: свёрнутой её не найдут. Поле короткое — остаётся открытым и стоит в конце, после «Деталей»: страница заканчивается личным — инициалы, затем коробка — перед кнопкой «В корзину».

### Steps

1. **Заголовки уходят из селекторов в `OptionSection`.** В каждом из девяти селекторов:
   - внешний `<section …>` → `<div …>` (классы `space-y-*` сохранить);
   - удалить `<h2 className="label …">…</h2>` вместе с вложенными `<span>` цены (у петли `formatDelta(PEN_HOLDER_MINOR)`, у тиснения `formatDelta(EMBOSSING_MINOR)`, у карманов `pocketsIncluded`) — цена теперь в строке сводки и на карточках (U-13);
   - у тиснения цена переезжает к счётчику: `0 / 2 · +40 zł` (`<span className="text-xs text-accent">` рядом с `{text.length} / …`);
   - подзаголовочные абзацы (`threadThickness`, `pocketsHint`, `insertsHint`, `insertsIncluded`) оставить; убрать у них верхний отступ, если он был рассчитан на заголовок (`mb-1` → нет).
   - Удалить ставшие ненужными импорты (`PEN_HOLDER_MINOR`, `EMBOSSING_MINOR`, `formatDelta` — где больше не используются).

2. **`ConfiguratorClient.tsx`** — состояние открытых строк и связь с ракурсом:
   ```tsx
   import OptionSection from './OptionSection';
   import { DETAIL_IDS, detailSummaries, type DetailId } from './summary';

   /** Opening one of these shows the spread: they live inside the cover (D-19). */
   const INSIDE: DetailId[] = ['penHolder', 'pockets', 'inserts'];

   …
   const [openDetails, setOpenDetails] = useState<DetailId[]>([]);
   const summaries = detailSummaries(config, dict);

   function toggleDetail(id: DetailId) {
     const opening = !openDetails.includes(id);
     setOpenDetails((prev) => (opening ? [...prev, id] : prev.filter((x) => x !== id)));
     if (opening && INSIDE.includes(id)) setAngle('open');
   }

   const detailTitle: Record<DetailId, string> = {
     thread: dict.configurator.steps.thread,
     penHolder: dict.configurator.steps.penHolder,
     pockets: dict.configurator.steps.pockets,
     inserts: dict.configurator.steps.inserts,
   };

   function renderDetail(id: DetailId) {
     switch (id) {
       case 'thread': return <ThreadSelector config={config} onChange={update} />;
       case 'penHolder': return <PenHolderSelector config={config} onChange={update} />;
       case 'pockets': return <PocketsSelector config={config} onChange={update} />;
       case 'inserts': return <InsertsSelector config={config} onChange={update} />;
     }
   }
   ```

3. Правая колонка:
   ```tsx
   <div className="flex flex-col gap-10">
     <OptionSection title={dict.configurator.steps.size}>
       <SizeSelector config={config} onChange={update} />
     </OptionSection>
     <OptionSection title={dict.configurator.steps.leather}>
       <LeatherSelector config={config} onChange={update} />
     </OptionSection>
     <OptionSection title={dict.configurator.steps.color}>
       <ColorSelector config={config} onChange={update} />
     </OptionSection>
     <OptionSection title={dict.configurator.steps.closure}>
       <ClosureSelector config={config} onChange={update} />
     </OptionSection>

     <div>
       <h2 className="font-display text-xl text-ink">{dict.configurator.groupDetails}</h2>
       <p className="mb-2 mt-1 text-sm text-ink-soft">{dict.configurator.groupDetailsHint}</p>
       <div className="border-t border-line">
         {DETAIL_IDS.map((id) => (
           <OptionSection
             key={id}
             title={detailTitle[id]}
             {...summaries[id]}
             open={openDetails.includes(id)}
             onToggle={() => toggleDetail(id)}
           >
             {renderDetail(id)}
           </OptionSection>
         ))}
       </div>
     </div>

     {/* Embossing is the personal touch and a +40 zł upsell: open, last, right before the gift box. */}
     <div onFocusCapture={() => setAngle('front')}>
       <OptionSection title={dict.configurator.steps.embossing}>
         <EmbossingInput config={config} onChange={update} />
       </OptionSection>
     </div>
   </div>
   ```
   Фокус в поле тиснения показывает вид спереди — там видны буквы.

   Нить переезжает из основных в «Детали»: на чертеже её почти не видно, и у неё есть разумное значение по умолчанию.

### Do NOT
- Не открывать «Детали» автоматически, если в ссылке не значения по умолчанию: сводка уже показывает, что выбрано.
- Не сворачивать четыре основные секции.
- Не менять порядок осей в `configToSearchParams` и в корзине.

### Acceptance
- [ ] 375 × 812, конфигурация по умолчанию, «Детали» закрыты: высота страницы ≤ 2436px (3 экрана); записать фактическую в заметку
- [ ] Каждая строка «Деталей» показывает текущий выбор и надбавку по правилу U-13; после изменения внутри строки сводка обновляется
- [ ] Открытие «Карманы», «Петля», «Вкладыши» переключает превью (и мини-превью) на «Развёрнутый»; фокус в поле «Тиснение» — на «Передний»
- [ ] Ссылка `?…&pk=d,c%2B|m&pen=wide&emboss=AB` — строки закрыты, сводки: «Спереди: 2 · Сзади: 1», «Толстая ручка · +20 zł» акцентом; в открытом «Тиснении» — «AB»
- [ ] Скринридер: строка читается как кнопка с состоянием «свёрнуто/развёрнуто»; заголовки — h2 «Детали», h3 у строк
- [ ] Ни в одном заголовке секции нет цены (U-13)
- [ ] 1280px: «Детали» тоже свёрнуты, превью слева закреплено
- [ ] Порядок на странице: Размер → Кожа → Цвет → Застёжка → Детали (4 строки) → Тиснение (открыто)
- [ ] 375 × 667 (iPhone SE), фокус в поле тиснения, открыта клавиатура: поле ввода видно между мини-превью и клавиатурой. Если закрыто — добавить в `EmbossingInput` `onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'center' })}` и записать в заметку
- [ ] 6 языков на 320px: длинные сводки обрезаются многоточием в одну строку, а не ломают строку

---

## ⏸ Стоп после T-199 — проверка на 5 людях

Не агентская задача. После T-199 заказчик проводит проверку на людях по сценарию из `kroja-spec/19-mobile-ux-issues.md`, раздел «Проверка на людях». T-200 начинается, только когда в `STATUS.md` записан итог: «4–5 из 5 — дальше» или список того, что чинить.

---

## T-200 — Карманы: готовые раскладки

**Problem:** U-5
**Depends on:** T-199
**Files:** новый `content/pocket-presets.ts`, `types/config.ts`, `lib/data.ts`, `lib/pockets.ts`, `components/configurator/PocketsSelector.tsx`, `components/configurator/summary.ts`, `types/i18n.ts`, `content/i18n/dict/{en,pl,de,by,uk,ru}.ts`

### Business
Модель карманов (D-04) верна, но у неё нет входа для покупателя. Большинству нужен один из нескольких типичных вариантов. Готовые раскладки — это вход в ту же модель: выбор раскладки записывает обычный `pockets` в конфигурацию и ссылку. Ручной редактор остаётся под «Настроить вручную» — и раскрыт сам, если раскладка своя.

### Состав раскладок

Решение № 4 (принято 09.10.2026). Названия — по тому, что человек носит с собой, а не по устройству кармана. Каждая помещается в самый маленький размер (A6, бюджет 142 мм), поэтому `resolveConfiguration` никогда не будет их обрезать.

| Код | ru | Передняя створка | Задняя | Высота спереди |
|---|---|---|---|---|
| `none` | Без карманов | — | — | 0 |
| `classic` | Для документов | глубокий | — | 100 мм |
| `cards` | Для карт | карта, карта, карта | — | 3 × 55 − 2 × 15 = 135 мм |
| `travel` | Документы и карты | глубокий, карта | средний | 100 + 55 − 15 = 140 мм |

`classic` совпадает с `DEFAULT_POCKETS`.

### Steps

1. **`types/config.ts`**:
   ```ts
   export type PocketPresetCode = 'none' | 'classic' | 'cards' | 'travel';
   ```

2. Создать **`content/pocket-presets.ts`**:
   ```ts
   // content/pocket-presets.ts
   // Ready-made layouts shown before the manual pocket editor. Each fits the smallest size
   // (A6, 142 mm budget): 'cards' takes 135 mm, the front flap of 'travel' 140 mm.
   import type { Pocket, PocketLayout, PocketPresetCode } from '@/types/config';
   import { DEFAULT_POCKETS } from './pockets';

   export interface PocketPresetDef {
     code: PocketPresetCode;
     layout: PocketLayout;
     order: number;
   }

   const card: Pocket = { kind: 'card', divided: false };

   export const pocketPresets: Record<PocketPresetCode, PocketPresetDef> = {
     none: { code: 'none', order: 1, layout: { front: [], back: [] } },
     classic: { code: 'classic', order: 2, layout: DEFAULT_POCKETS },
     cards: { code: 'cards', order: 3, layout: { front: [card, card, card], back: [] } },
     travel: {
       code: 'travel',
       order: 4,
       layout: {
         front: [{ kind: 'deep', divided: false }, card],
         back: [{ kind: 'medium', divided: false }],
       },
     },
   };

   export const pocketPresetList: PocketPresetDef[] = Object.values(pocketPresets).sort(
     (a, b) => a.order - b.order,
   );
   ```

3. **`lib/data.ts`** — экспорт `pocketPresets`, `pocketPresetList` и типа `PocketPresetDef` рядом с блоком карманов.

4. **`lib/pockets.ts`** — две чистые функции. `canAddPocket` переписать через новую, чтобы правила жили в одном месте:
   ```ts
   import type { PocketPresetCode } from '@/types/config';
   import { pocketPresetList } from '@/content/pocket-presets';

   export type AddPocketBlocker = 'max' | 'corner' | 'budget';

   /** Why a pocket of this kind cannot go on top of the stack, or null if it can. */
   export function addPocketBlocker(
     stack: Pocket[],
     kind: PocketKind,
     size: SizeCode,
   ): AddPocketBlocker | null {
     if (stack.length >= MAX_POCKETS_PER_FLAP) return 'max';
     // A corner holds a sheet by its corner: only at the very bottom, so only on an empty flap.
     if (kind === 'corner' && stack.length > 0) return 'corner';
     if (stackHeightMm([...stack, { kind, divided: false }]) > pocketBudgetMm(size)) return 'budget';
     return null;
   }

   export function canAddPocket(stack: Pocket[], kind: PocketKind, size: SizeCode): boolean {
     return addPocketBlocker(stack, kind, size) === null;
   }

   /** The ready-made layout this one equals, or null for a custom layout. */
   export function matchPocketPreset(layout: PocketLayout): PocketPresetCode | null {
     const key = serialisePockets(layout);
     return pocketPresetList.find((p) => serialisePockets(p.layout) === key)?.code ?? null;
   }
   ```

5. **Словарь**:
   - Раздел `options`: `pocketPresets: Record<PocketPresetCode, { title: string; meta: string }>;`
   - Раздел `configurator`: `pocketsCustom`, `pocketsCustomMeta`, `pocketsCustomize`, `pocketsCustomizeHide`, `pocketsBlocked: Record<AddPocketBlocker, string>`.

   | Ключ | en | ru |
   |---|---|---|
   | `pocketPresets.none` | No pockets · Clean leather inside | Без карманов · Чистая кожа внутри |
   | `pocketPresets.classic` | For documents · One deep pocket: passport, folded A4 | Для документов · Один глубокий: паспорт, сложенный A4 |
   | `pocketPresets.cards` | For cards · Three card pockets in front | Для карт · Три кармана для карт спереди |
   | `pocketPresets.travel` | Documents and cards · Deep and card in front, medium at the back | Документы и карты · Глубокий и для карт спереди, средний сзади |
   | `pocketsCustom` | Custom layout | Своя раскладка |
   | `pocketsCustomMeta` | Set up below | Настроена ниже |
   | `pocketsCustomize` | Set up by hand | Настроить вручную |
   | `pocketsCustomizeHide` | Hide manual setup | Скрыть ручную настройку |
   | `pocketsBlocked.max` | No more than four | Не больше четырёх |
   | `pocketsBlocked.corner` | Only on an empty flap | Только на пустую створку |
   | `pocketsBlocked.budget` | Not enough room | Не хватает места |

   В таблице `title · meta` через «·».

6. **`PocketsSelector.tsx`**:
   - Сверху — выбор раскладки:
     ```tsx
     const matched = matchPocketPreset(config.pockets);
     const [manual, setManual] = useState(matched === null);
     // A layout edited by hand that no longer matches a preset keeps the editor open.
     useEffect(() => {
       if (matched === null) setManual(true);
     }, [matched]);

     const presetItems = pocketPresetList.map((p) => ({
       value: p.code,
       title: dict.options.pocketPresets[p.code].title,
       meta: dict.options.pocketPresets[p.code].meta,
     }));
     const items = matched
       ? presetItems
       : [...presetItems, { value: 'custom', title: dict.configurator.pocketsCustom, meta: dict.configurator.pocketsCustomMeta }];

     <OptionCardGroup
       label={dict.configurator.steps.pockets}
       columns="grid-cols-1 sm:grid-cols-2"
       value={matched ?? 'custom'}
       onChange={(v) => {
         if (v !== 'custom') onChange({ pockets: pocketPresets[v as PocketPresetCode].layout });
       }}
       items={items}
     />
     <button
       type="button"
       aria-expanded={manual}
       onClick={() => setManual((m) => !m)}
       className="mt-3 min-h-11 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
     >
       {manual ? dict.configurator.pocketsCustomizeHide : dict.configurator.pocketsCustomize}
     </button>
     {manual && <div className="mt-4 space-y-4">{/* existing FlapEditor × 2 */}</div>}
     ```
     Абзац `pocketsHint` перенести внутрь ручной настройки — он про нахлёст и нужен только там.
   - В `FlapEditor` убрать миллиметры из строк карманов и из кнопок «+» (`{def.heightMm} {mm}`). Шкалу и «Занято X из Y мм» оставить — это D-04.
   - Под неактивной кнопкой «+» — причина:
     ```tsx
     const blocker = addPocketBlocker(stack, def.code, config.size);
     …
     disabled={blocker !== null}
     …
     {blocker && <span className="text-[11px] text-ink-soft">{dict.configurator.pocketsBlocked[blocker]}</span>}
     ```
     Причина стоит внутри кнопки, но с `ink-soft`, а не на `opacity-35`: убрать `disabled:opacity-35` и вместо этого приглушить только название `+ …` (`group-disabled:text-muted`, кнопке — `group`).

7. **`summary.ts`** — сводка карманов называет раскладку, если она готовая:
   ```ts
   const preset = matchPocketPreset(config.pockets);
   summary: preset
     ? dict.options.pocketPresets[preset].title
     : fill(dict.configurator.pocketsSummary, { front: …, back: … }),
   ```

### Do NOT
- Не менять `canAddPocket`, `canMovePocket`, `normaliseStack` по смыслу — только выразить `canAddPocket` через `addPocketBlocker`.
- Не рисовать SVG-иконки для раскладок — их нет в задаче.
- Не добавлять раскладку в ссылку отдельным параметром: ссылка хранит `pk`, раскладка вычисляется по нему.

### Acceptance
- [ ] По умолчанию выбрана «Для документов», ручная настройка закрыта; сводка «Деталей» — «Для документов · В цене»
- [ ] Каждая раскладка на каждом из четырёх размеров применяется без тоста «изменено» (никто не обрезан)
- [ ] Выбор «Документы и карты» — превью переходит на разворот, видны 2 кармана спереди и 1 сзади
- [ ] После «+ Средний» в ручной настройке раскладка становится «Своя раскладка», ручная настройка остаётся открытой
- [ ] Ссылка с `pk=k,c|` открывает конструктор с «Своя раскладка» и раскрытой ручной настройкой
- [ ] Ни в кнопках «+», ни в строках карманов нет миллиметров; шкала «Занято … из … мм» на месте
- [ ] У неактивной кнопки «+» видна причина; на A6 после «Документы и карты» у «+ Глубокий» спереди — «Не хватает места»
- [ ] 6 языков, `npm run i18n` — 0 / 0

---

## T-201 — Петля: круги только на большом экране

**Problem:** U-6
**Depends on:** T-200
**Files:** `components/configurator/PenHolderSelector.tsx`, `types/i18n.ts`, `content/i18n/dict/{en,pl,de,by,uk,ru}.ts`

### Business
Круги рассчитаны на миллиметры экрана компьютера, а подпись честно об этом говорит. На телефоне это шум, а совет «сравните с кругами» не работает. Текст про то, какая ручка во что влезает, полезен везде — остаётся.

### Steps

1. **Словарь** — разделить `penHolderHelp` на два ключа. В каждом из шести языков последняя фраза уходит в новый ключ `penHolderMeasure`:

   | Ключ | en | ru |
   |---|---|---|
   | `penHolderHelp` | Ballpoint, gel pen or a thin pencil — slim. Metal body, fountain pen or thick marker — wide. | Шариковая, гелевая ручка или тонкий карандаш — тонкая петля. Металлический корпус, перьевая ручка или толстый маркер — толстая. |
   | `penHolderMeasure` | Not sure? Measure the widest part of the barrel and compare with the circles. | Не уверены? Измерьте самое широкое место корпуса и сравните с кругами. |

2. **`PenHolderSelector.tsx`**:
   ```tsx
   <p className="text-xs leading-relaxed text-ink-soft">{dict.configurator.penHolderHelp}</p>
   <div className="hidden space-y-2 md:block">
     <p className="text-xs leading-relaxed text-ink-soft">{dict.configurator.penHolderMeasure}</p>
     <PenSizeGuide active={config.penHolder} />
   </div>
   ```

### Acceptance
- [ ] 375px: под карточками петли один абзац, кругов нет
- [ ] 768px и 1280px: абзац, фраза про сравнение, круги
- [ ] Во всех шести языках `penHolderHelp` не заканчивается отсылкой к кругам

---

## T-202 — Карточки-строки на узком экране

**Problem:** U-8
**Depends on:** T-201
**Files:** `components/ui/OptionCard.tsx`, `components/ui/OptionCardGroup.tsx`, `components/configurator/LeatherSelector.tsx`, `components/configurator/ClosureSelector.tsx`, `components/configurator/PenHolderSelector.tsx`

### Business
Три полноширинные карточки с иконкой по центру занимают пол-экрана на выбор из трёх. На узком экране карточка становится строкой: иконка слева, текст справа — ~56px вместо ~110px. Три колонки не подходят: немецкие «Messingschnalle» и «Keine Stiftschlaufe» не помещаются в треть экрана 320px.

### Steps

1. **`OptionCard.tsx`** — новый необязательный проп и текст в отдельной обёртке (в режиме столбика внешний вид не меняется):
   ```ts
   /** Below sm: visual on the left, text on the right. From sm up: the usual column. */
   rowOnMobile?: boolean;
   ```
   ```tsx
   className={clsx(
     'flex min-h-[44px] rounded-sm border p-3 text-left transition-colors duration-150',
     rowOnMobile
       ? 'flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-1'
       : 'flex-col items-start gap-1',
     …
   )}
   …
   {visual && (
     <span className={clsx('block', rowOnMobile ? 'w-14 shrink-0 sm:mb-1 sm:w-full' : 'mb-1 w-full')}>
       {visual}
     </span>
   )}
   <span className="flex min-w-0 flex-col gap-1">
     <span className="text-sm font-medium text-ink">{title}</span>
     {meta && …}
     {delta && …}
     {disabled && disabledReason && …}
   </span>
   ```

2. **`OptionCardGroup.tsx`** — проп `rowOnMobile?: boolean`, передаётся каждой карточке.

3. Включить в трёх селекторах (колонки остаются `grid-cols-1 sm:grid-cols-3`):
   - `LeatherSelector` — `rowOnMobile`;
   - `ClosureSelector` — `rowOnMobile`;
   - `PenHolderSelector` — `rowOnMobile`.

   Размер, раскладки карманов и прочие группы без иконок — не трогать.

### Acceptance
- [ ] 375px: карточки кожи, застёжки и петли — строки, иконка/штриховка слева 56px, высота строки ≤ 72px (кожа с описанием — ≤ 96px)
- [ ] 640px и шире — карточки как до задачи
- [ ] 320px, все 6 языков: ни одно название не выходит за карточку
- [ ] Выбранная карточка и недоступная (`disabled`) выглядят как раньше

---

## T-203 — Подарочная коробка отдельной строкой

**Problem:** U-7
**Depends on:** T-202
**Files:** новый `components/configurator/GiftBoxToggle.tsx`, `components/configurator/InsertsSelector.tsx`, `components/configurator/ConfiguratorClient.tsx`

### Business
Коробка — не вкладыш, а упаковка. Внутри «Вкладышей» её пропускают, а после T-199 она вообще оказалась бы внутри свёрнутой строки. Её место — отдельная строка в самом конце, перед плашкой с ценой: «а ещё можно подарить».

### Steps

1. Создать **`components/configurator/GiftBoxToggle.tsx`** — строка-переключатель с ролью `switch`:
   ```tsx
   // components/configurator/GiftBoxToggle.tsx
   'use client';

   import clsx from 'clsx';
   import type { Configuration } from '@/types/config';
   import { GIFT_BOX_MINOR } from '@/lib/data';
   import { useI18n } from '@/components/i18n/I18nProvider';
   import { formatDelta } from '@/lib/format';

   interface Props {
     config: Configuration;
     onChange: (patch: Partial<Configuration>) => void;
   }

   export default function GiftBoxToggle({ config, onChange }: Props) {
     const { dict } = useI18n();
     const on = config.giftBox;

     return (
       <button
         type="button"
         role="switch"
         aria-checked={on}
         onClick={() => onChange({ giftBox: !on })}
         className={clsx(
           'flex min-h-14 w-full items-center gap-3 rounded-sm border p-3 text-left transition-colors duration-150',
           on ? 'border-ink bg-paper-2' : 'border-line hover:border-ink-soft',
         )}
       >
         <span className="min-w-0 flex-1">
           <span className="block text-sm text-ink">{dict.configurator.giftBoxLabel}</span>
           <span className="block text-xs text-accent">{formatDelta(GIFT_BOX_MINOR)}</span>
         </span>
         <span
           aria-hidden
           className={clsx(
             'relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-150',
             on ? 'border-accent bg-accent' : 'border-line bg-paper',
           )}
         >
           <span
             className={clsx(
               'absolute top-0.5 h-4 w-4 rounded-full bg-paper shadow transition-[left] duration-150',
               on ? 'left-5' : 'left-0.5',
             )}
           />
         </span>
       </button>
     );
   }
   ```

2. **`InsertsSelector.tsx`** — удалить `<label>` с чекбоксом коробки и импорт `GIFT_BOX_MINOR`, если он больше не нужен.

3. **`ConfiguratorClient.tsx`** — после блока «Деталей»:
   ```tsx
   <GiftBoxToggle config={config} onChange={update} />
   ```

### Acceptance
- [ ] Строка коробки — последняя перед плашкой; нажатие по любой её части переключает; цена в плашке меняется на 35 zł
- [ ] Скринридер читает «переключатель, выключен/включён»
- [ ] Ссылка `?…&box=1` открывается с включённой коробкой
- [ ] Во «Вкладышах» коробки нет
- [ ] `npm run i18n` — 0 / 0 (ключ `steps.giftBox` не используется — не трогать, если детектор не помечает его мёртвым; если помечает — удалить из типа и шести словарей и записать в заметку)

---

## T-204 — Приёмка эпика и документация

**Depends on:** T-190 … T-203
**Files:** `kroja-spec/19-mobile-ux-issues.md`, `docs/03-configurator.md`, `docs/06-decisions.md`, `STATUS.md`

### Business
Эпик закрыт, когда замеры из `kroja-spec/19-mobile-ux-issues.md` переснятыми цифрами показывают «после», а документация описывает систему как она есть.

### Steps

1. **Повторить замеры** на 375 × 812 с мобильной эмуляцией, конфигурация по умолчанию, `/ru/configurator`, затем ещё на `/de/configurator` (самый длинный текст). Заполнить колонку «После» в таблице «Замеры» в `kroja-spec/19-mobile-ux-issues.md`:

   | Метрика | Как мерить |
   |---|---|
   | Ширина страницы | `document.scrollingElement.scrollWidth` |
   | Высота страницы | `document.scrollingElement.scrollHeight` |
   | Начало «Размера» | `document.querySelector('main h2').getBoundingClientRect().top + scrollY` |
   | Превью видно при выборе | прокрутить к «Цвет», выбрать «Олива» — мини-превью меняет цвет |
   | Зоны нажатия | скрипт из T-192 — пустой список |
   | Контраст `muted` | пересчитать формулой WCAG |
   | Плашка | `getBoundingClientRect().bottom` плашки ≤ `innerHeight` |

2. Прогнать весь сценарий покупки на 375px: выбрать B6 → замшу → оливу → пряжку → раскладку «Документы и карты» → 2 вкладыша → тиснение «AB» → коробку → «В корзину». Записать в заметку число прокруток экрана.

3. **`docs/06-decisions.md`** — три новых решения в формате журнала:
   - **D-27. «Детали» свёрнуты со сводкой — действует.** Почему: сложность ощущается по количеству видимого, а не по количеству опций; у деталей разумные значения по умолчанию (D-03). Отвергнуто: пошаговый мастер (ломает свободный порядок и ссылку), удаление опций.
   - **D-28. Карманы — сначала готовые раскладки — действует.** Вход в модель D-04, а не замена; раскладка вычисляется по `pk`, в ссылку не пишется; все раскладки помещаются в A6.
   - **D-29. Закреплённое мини-превью на телефоне — действует.** Продолжение D-01 и D-19: на мобильном ось должна быть видна в момент выбора. Отвергнуто: закреплять полное превью, миниатюра в плашке, прятать при прокрутке.
   Дополнить D-19: «Раскрытие секций „Петля“, „Карманы“, „Вкладыши“ тоже переключает на разворот».

4. **`docs/03-configurator.md`** — раздел о раскладке страницы: две группы, мини-превью, готовые раскладки карманов, `usePreviewAngle`.

5. **`STATUS.md`** — все задачи ✅, эпик 14 в верхней таблице — «завершён», расхождения записаны.

### Acceptance
- [ ] Все цели из таблицы «Замеры» в `kroja-spec/19-mobile-ux-issues.md` достигнуты, цифры «после» записаны
- [ ] Сценарий покупки пройден на 375px в ru и de без горизонтальной прокрутки и без потери плашки
- [ ] 1280 × 800: сценарий покупки пройден, десктопная раскладка работает
- [ ] `npx tsc --noEmit && npm run lint && npm run build` — зелёные
- [ ] D-27, D-28, D-29 записаны, D-19 дополнено
