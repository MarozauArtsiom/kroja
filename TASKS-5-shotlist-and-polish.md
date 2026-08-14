# TASKS 5 — Список кадров и отделка (EPIC 7, EPIC 8)

Задачи T-100 … T-115.

---

# EPIC 7 — Список кадров

> ⚠️ **Главный артефакт проекта для заказчика.** Это то, что мастер откроет, распечатает и возьмёт в мастерскую. Всё остальное существует, чтобы объяснить содержимое этой страницы.

## T-100 — Генерация списка кадров

**Depends on:** T-014, T-016
**Estimate:** 2ч
**Files:** создать `lib/shotlist.ts`

### Business
Список строится **из данных сайта**, а не пишется руками. Поэтому его невозможно рассинхронизировать с матрицей доступности: убрал комбинацию из наличия — кадр исчез из списка.

Комбинации со статусом `unavailable` в список **не попадают**: снимать то, что не продаётся, незачем.

### Code

```ts
// lib/shotlist.ts
import type { LeatherCode, ColorCode, Angle } from '@/types/config';
import { leatherList, leathers } from '@/content/leathers';
import { colors } from '@/content/colors';
import { angleList } from '@/content/shots';
import { getStock } from '@/lib/availability';
import { previewFilename } from '@/lib/assets';
import { globalShotRules } from '@/content/shots';

export interface ProductShot {
  index: number;
  leather: LeatherCode;
  leatherName: string;
  color: ColorCode;
  colorName: string;
  angle: Angle;
  angleName: string;
  ratio: string;
  filename: string;
  mustShow: string[];
}

export interface StoryShot {
  index: number;
  id: string;
  subject: string;
  requirement: string;
  why: string;
  ratio: string;
}

/**
 * Every product shot that has to be taken.
 * Grouped by angle first, because it is far easier to shoot a whole series
 * with one scene set up than to keep re-staging per colour.
 */
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
          leatherName: leather.name,
          color: colorCode,
          colorName: colors[colorCode].name,
          angle: angle.angle,
          angleName: angle.name,
          ratio: angle.ratio,
          filename: previewFilename(leather.code, colorCode, angle.angle),
          mustShow: angle.mustShow,
        });
      }
    }
  }

  return shots;
}

/** Story shots for the landing page. Kept here so the list stays in one place. */
export const storyShots: StoryShot[] = [
  { index: 1, id: 'S1-hero', subject: 'Cover held in one hand or resting on a desk', requirement: 'Warm side light, horizontal frame with space for text', why: 'Hero image — the first thing anyone sees', ratio: '4 / 3' },
  { index: 2, id: 'S2-stitch-macro', subject: 'Macro: saddle stitch on the cover edge', requirement: 'Side light to reveal thread relief, 4–5 stitches fill the frame', why: 'Proves the stitching is done by hand', ratio: '4 / 5' },
  { index: 3, id: 'S2-grain-macro', subject: 'Macro: full-grain leather surface', requirement: 'At least 2000 px, no retouching of the texture', why: 'Shows what full-grain actually looks like', ratio: '4 / 5' },
  { index: 4, id: 'S2-edge-macro', subject: 'Macro: burnished edge', requirement: 'Raking light along the edge', why: 'Edge finish is the clearest sign of skill', ratio: '4 / 5' },
  { index: 5, id: 'S4-leather-veg-tan', subject: 'Macro: vegetable-tanned grain', requirement: 'Flat even light, square frame', why: 'Leather comparison section', ratio: '1 / 1' },
  { index: 6, id: 'S4-leather-crazy-horse', subject: 'Macro: Crazy Horse grain with pull marks', requirement: 'Flat even light, square frame, same distance as the others', why: 'Leather comparison section', ratio: '1 / 1' },
  { index: 7, id: 'S4-leather-pull-up', subject: 'Macro: Pull-up grain, bend it to show colour lift', requirement: 'Flat even light, square frame, same distance as the others', why: 'Leather comparison section', ratio: '1 / 1' },
  { index: 8, id: 'S4-not-defect', subject: 'Natural marks: scars, insect bites, uneven colour', requirement: 'Marks clearly visible, close crop', why: 'The "this is not a defect" block', ratio: '4 / 3' },
  { index: 9, id: 'S6-hands', subject: 'Hands at work with a tool', requirement: 'Shot during real work, not staged afterwards', why: 'Proof the work is manual', ratio: '4 / 3' },
  { index: 10, id: 'S6-portrait', subject: 'Portrait of the maker at the bench, face visible', requirement: 'Natural light, no posing', why: 'An anonymous "craftsman" does not build trust', ratio: '4 / 5' },
  { index: 11, id: 'S7-kit', subject: 'Everything that ships, laid out flat', requirement: 'Top-down, even light, neutral surface', why: 'Sets expectations about what arrives', ratio: '4 / 3' },
];

export function getShotCounts() {
  const product = getProductShots().length;
  return { product, story: storyShots.length, total: product + storyShots.length };
}

/** Markdown export, used both by the page and by the npm script. */
export function toMarkdown(): string {
  const product = getProductShots();
  const counts = getShotCounts();
  const date = new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    '# KROJA — Shot list',
    '',
    `Generated ${date}. **${counts.total} shots total** — ${counts.product} product, ${counts.story} story.`,
    '',
    '## Rules for every product shot',
    '',
  ];

  for (const rule of globalShotRules) lines.push(`- ${rule}`);

  lines.push('', '## Product matrix', '');
  lines.push('| # | File | Leather | Colour | Angle | Done |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of product) {
    lines.push(`| ${s.index} | \`${s.filename}\` | ${s.leatherName} | ${s.colorName} | ${s.angleName} | ☐ |`);
  }

  lines.push('', '## Story shots', '');
  lines.push('| # | Id | Subject | Requirement | Done |');
  lines.push('|---|---|---|---|---|');
  for (const s of storyShots) {
    lines.push(`| ${s.index} | \`${s.id}\` | ${s.subject} | ${s.requirement} | ☐ |`);
  }

  return lines.join('\n');
}

export function toCsv(): string {
  const rows: string[] = ['index,type,file,leather,colour,angle,ratio'];
  for (const s of getProductShots()) {
    rows.push(`${s.index},product,${s.filename},${s.leatherName},${s.colorName},${s.angleName},"${s.ratio}"`);
  }
  for (const s of storyShots) {
    rows.push(`${s.index},story,${s.id},,,,"${s.ratio}"`);
  }
  return rows.join('\n');
}
```

### Do NOT
- ❌ Не включать в список комбинации со статусом `unavailable`
- ❌ Не включать размер в имя файла
- ❌ Не хардкодить количество кадров — оно вычисляется

### Acceptance
- [ ] `getProductShots()` возвращает 36 кадров (12 доступных комбинаций × 3 ракурса)
- [ ] `pull-up_burgundy` отсутствует в списке
- [ ] `getShotCounts().total === 47`
- [ ] Список сгруппирован по ракурсам: сначала все `front`, потом все `open`, потом `detail`

---

## T-101 — ShotMatrix

**Depends on:** T-100, T-041
**Estimate:** 3ч
**Files:** создать `components/shotlist/ShotMatrix.tsx`

### Business
Таблица со схемой-миниатюрой для каждого кадра. Мастер видит не список строк, а список картинок с именами файлов — это принципиально понятнее.

Чекбоксы нужны для печатной версии: отмечать сделанное карандашом.

### Steps

1. Получить кадры через `getProductShots()`
2. Сгруппировать по `angle`
3. Для каждой группы: заголовок с названием ракурса, пропорцией и требованиями `mustShow`
4. Внутри группы — сетка карточек. Каждая карточка:
   - `<SchematicCover config={...} angle={...} compact />` — миниатюра ~120 px
   - Название кожи и цвета
   - Имя файла моноширинным шрифтом
   - Пустой квадрат-чекбокс 16×16 px с рамкой
5. Конфигурацию для миниатюры собрать так:
```ts
const config: Configuration = {
  size: 'a5', leather: shot.leather, color: shot.color,
  thread: 'natural', cord: 'black', engraving: null,
  inserts: [{ type: 'dot', qty: 2 }], giftBox: false,
};
```
6. Над таблицей — блок с общими правилами из `globalShotRules`
7. Легенда штриховок: три образца паттернов с подписями типов кожи

### Do NOT
- ❌ Не делать чекбоксы интерактивными: состояние нигде не хранится, а неработающая галочка хуже, чем печатный квадрат

### Acceptance
- [ ] Три группы по ракурсам, в каждой 12 карточек
- [ ] У каждой карточки видна схема, название и имя файла
- [ ] Общие правила выведены над матрицей
- [ ] Легенда штриховок присутствует

---

## T-102 — StorySlots

**Depends on:** T-100, T-036
**Estimate:** 1.5ч
**Files:** создать `components/shotlist/StorySlots.tsx`

### Steps

1. Получить `storyShots` из `lib/shotlist.ts`
2. Отрисовать сеткой карточек: id, сюжет, требование, обоснование, пропорция, чекбокс
3. Использовать компонент `PhotoSlot` — он уже показывает всё нужное

### Acceptance
- [ ] 11 карточек
- [ ] У каждой видны сюжет, требование и обоснование
- [ ] Пропорция кадра соблюдается визуально

---

## T-103 — Страница /shotlist

**Depends on:** T-101, T-102
**Estimate:** 1.5ч
**Files:** изменить `app/shotlist/page.tsx`

### Business
Первое, что видит мастер на этой странице — **итоговое число кадров крупно**. Не «много кадров», а «47». Конечное число снижает тревогу и делает задачу выполнимой.

### Code

```tsx
// app/shotlist/page.tsx
import { copy } from '@/content/copy';
import { getShotCounts } from '@/lib/shotlist';
import Header from '@/components/landing/Header';
import ShotMatrix from '@/components/shotlist/ShotMatrix';
import StorySlots from '@/components/shotlist/StorySlots';
import ExportButtons from '@/components/shotlist/ExportButtons';

export const metadata = {
  title: 'Shot list — KROJA',
  robots: { index: false, follow: false },
};

export default function ShotlistPage() {
  const counts = getShotCounts();
  const date = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="print:hidden">
        <Header />
      </div>

      <main className="container-content py-10">
        <header className="mb-10 border-b border-line pb-8">
          <h1 className="mb-2">{copy.shotlist.title}</h1>
          <p className="mb-6 text-ink-soft">{copy.shotlist.subtitle}</p>

          <p className="font-display text-5xl text-ink">
            {counts.total}{' '}
            <span className="text-xl text-muted">{copy.shotlist.totalLabel}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {counts.product} product · {counts.story} story · {copy.shotlist.generated} {date}
          </p>

          <div className="mt-6 print:hidden">
            <ExportButtons />
          </div>
        </header>

        <section className="mb-16">
          <h2 className="mb-6">{copy.shotlist.productShots}</h2>
          <ShotMatrix />
        </section>

        <section className="break-before-page">
          <h2 className="mb-6">{copy.shotlist.storyShots}</h2>
          <StorySlots />
        </section>
      </main>
    </>
  );
}
```

### Do NOT
- ❌ Не индексировать страницу поисковиками — она служебная

### Acceptance
- [ ] Итоговое число выведено крупно
- [ ] Обе секции на месте
- [ ] `robots: noindex` установлен
- [ ] Кнопки экспорта скрываются при печати

---

## T-104 — Печатная версия A4

**Depends on:** T-103
**Estimate:** 2ч
**Files:** изменить `app/globals.css`

### Business
Мастер работает руками, у него нет ноутбука на верстаке. Печатный список с чекбоксами — рабочий инструмент, а веб-страница — нет.

### Code

Добавить в конец `app/globals.css`:

```css
@media print {
  @page {
    size: A4 portrait;
    margin: 15mm;
  }

  html, body {
    background: #fff !important;
    color: #000 !important;
    font-size: 10pt;
  }

  /* Hide everything that is not the list */
  header.sticky,
  nav,
  .print\:hidden,
  [data-print-hide] {
    display: none !important;
  }

  /* Schematics: pure black lines, no fills that eat toner */
  svg {
    max-width: 100%;
  }

  /* Keep a shot card whole on one page */
  [data-shot-card] {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Start each angle group on a new page */
  [data-shot-group] {
    break-before: page;
    page-break-before: always;
  }
  [data-shot-group]:first-of-type {
    break-before: auto;
    page-break-before: auto;
  }

  /* Checkboxes large enough to tick with a pen */
  [data-shot-checkbox] {
    width: 5mm !important;
    height: 5mm !important;
    border: 0.4mm solid #000 !important;
  }

  a[href]::after {
    content: '';
  }
}
```

В компонентах `ShotMatrix` и `StorySlots` добавить атрибуты `data-shot-group`, `data-shot-card`, `data-shot-checkbox` на соответствующие элементы.

### Acceptance
- [ ] `Ctrl+P` показывает список без навигации и кнопок
- [ ] Каждая группа ракурсов начинается с новой страницы
- [ ] Карточки не разрываются между страницами
- [ ] Чекбоксы размером 5 мм
- [ ] Схемы читаемы в чёрно-белой печати

---

## T-105 — ExportButtons

**Depends on:** T-100
**Estimate:** 1.5ч
**Files:** создать `components/shotlist/ExportButtons.tsx`

### Code

```tsx
// components/shotlist/ExportButtons.tsx
'use client';

import { copy } from '@/content/copy';
import { toMarkdown, toCsv } from '@/lib/shotlist';
import Button from '@/components/ui/Button';

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => window.print()}>
        {copy.shotlist.print}
      </Button>
      <Button
        variant="secondary"
        onClick={() => download('shotlist.md', toMarkdown(), 'text/markdown')}
      >
        {copy.shotlist.exportMd}
      </Button>
      <Button
        variant="secondary"
        onClick={() => download('shotlist.csv', toCsv(), 'text/csv')}
      >
        {copy.shotlist.exportCsv}
      </Button>
    </div>
  );
}
```

### Acceptance
- [ ] «Print» открывает диалог печати
- [ ] «Export markdown» скачивает файл с таблицами
- [ ] «Export CSV» скачивает файл, открывающийся в таблицах

---

## T-106 — npm-скрипт shotlist

**Depends on:** T-100
**Estimate:** 1ч
**Files:** создать `scripts/generate-shotlist.mjs`, изменить `package.json`

### Business
Список нужен в репозитории как файл, чтобы его можно было отправить в мессенджере, не открывая сайт.

### Steps

1. Создать `scripts/generate-shotlist.mjs`:
```js
// scripts/generate-shotlist.mjs
import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// tsx is not a dependency, so compile-free approach:
// run the export through a tiny Next.js-free TS transform is overkill.
// Instead we call the already-built app route. Simplest reliable option:
// duplicate nothing — import from the compiled output is fragile.
// => We generate by reading the same content files through a small loader.

console.log('Generating shotlist.md …');
execSync('npx tsc lib/shotlist.ts --outDir .tmp-shotlist --module esnext --target es2020 --moduleResolution bundler --skipLibCheck --baseUrl . --paths \'{"@/*":["./*"]}\'', { stdio: 'inherit' });

const { toMarkdown } = await import('../.tmp-shotlist/lib/shotlist.js');
writeFileSync('shotlist.md', toMarkdown(), 'utf8');
console.log('Done: shotlist.md');
```

2. **Если этот подход не заработает** (вероятно, из-за путей `@/`), использовать запасной вариант — он проще и надёжнее:
   - Добавить в `app/shotlist/` route handler `app/shotlist/export/route.ts`, который возвращает markdown как текст
   - Скрипт делает `fetch('http://localhost:3000/shotlist/export')` при запущенном dev-сервере и пишет результат в файл
   - Это работает без сборочных ухищрений

3. Добавить в `package.json`:
```json
"scripts": {
  "shotlist": "node scripts/generate-shotlist.mjs"
}
```

### Acceptance
- [ ] `npm run shotlist` создаёт `shotlist.md` в корне
- [ ] В файле 36 продуктовых и 11 сюжетных кадров
- [ ] Файл открывается как читаемый markdown с таблицами

---

# EPIC 8 — Отделка

## T-110 — SEO и метаданные

**Depends on:** T-090
**Estimate:** 2ч
**Files:** изменить `app/layout.tsx`, `app/page.tsx`

### Steps

1. В `app/layout.tsx` расширить `metadata`:
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://kroja.example'),
  title: {
    default: 'KROJA — Handmade leather notebook covers',
    template: '%s — KROJA',
  },
  description:
    'Refillable full-grain leather notebook covers, hand-stitched in Kraków. Choose size, leather, colour and engraving. Ships across the EU.',
  openGraph: {
    type: 'website',
    siteName: 'KROJA',
    title: 'KROJA — Handmade leather notebook covers',
    description: 'Hand-stitched in Kraków. Built to your specification.',
    images: ['/illustrations/hero.svg'],
  },
  robots: { index: true, follow: true },
};
```

2. В `app/page.tsx` добавить JSON-LD:
```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KROJA',
  description: 'Handmade leather notebook covers',
  address: { '@type': 'PostalAddress', addressLocality: 'Kraków', addressCountry: 'PL' },
};
// В JSX:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

3. Создать `app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://kroja.example/', priority: 1 },
    { url: 'https://kroja.example/configurator', priority: 0.8 },
  ];
}
```
`/shotlist` в sitemap не включать.

4. Создать `app/robots.ts`, запретив `/shotlist`.

### Acceptance
- [ ] Метатеги видны в исходнике страницы
- [ ] OG-изображение указано
- [ ] `/sitemap.xml` отдаёт два URL
- [ ] `/robots.txt` запрещает `/shotlist`

---

## T-111 — 404 и favicon

**Depends on:** T-004
**Estimate:** 1ч
**Files:** создать `app/not-found.tsx`, `app/icon.svg`

### Code

`app/icon.svg` — простая монограмма:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#1C1917"/>
  <text x="16" y="22" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#FAF7F2">K</text>
</svg>
```

`app/not-found.tsx`:
```tsx
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-content flex min-h-[50vh] flex-col items-start justify-center">
        <h1 className="mb-4">This page does not exist</h1>
        <p className="mb-8 text-ink-soft">
          It may have moved, or the link may be wrong.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-sm bg-accent px-6 text-sm text-paper"
        >
          Back to the start
        </Link>
      </main>
      <Footer />
    </>
  );
}
```

### Acceptance
- [ ] Несуществующий URL показывает страницу 404 с шапкой и футером
- [ ] Favicon виден во вкладке браузера

---

## T-112 — Аудит доступности

**Depends on:** всё
**Estimate:** 3ч
**Files:** правки по результатам

### Чеклист проверки

**Клавиатура:**
- [ ] Tab проходит весь конструктор в логическом порядке
- [ ] Свотчи переключаются стрелками внутри группы
- [ ] Escape закрывает модалку и корзину
- [ ] Фокус после закрытия модалки возвращается на кнопку, которая её открыла
- [ ] Из модалки нельзя выйти табом
- [ ] Видимое кольцо фокуса на каждом интерактивном элементе

**Скринридер (VoiceOver или NVDA):**
- [ ] Группы свотчей объявляются как radiogroup с названием
- [ ] Недоступные свотчи объявляют причину
- [ ] Изменение цены объявляется (`aria-live="polite"` в StickyBar)
- [ ] Схема имеет осмысленный `aria-label`, а не «image»
- [ ] Тосты объявляются

**Контраст (проверить в DevTools):**
- [ ] Весь текст ≥ 4.5:1
- [ ] Текст поверх фотографий ≥ 4.5:1 — при необходимости добавить градиентную подложку
- [ ] Рамки интерактивных элементов ≥ 3:1

**Зоны нажатия:**
- [ ] Все кнопки и ссылки ≥ 44 × 44 px

**Прочее:**
- [ ] Цвет нигде не является единственным признаком состояния
- [ ] У каждого изображения осмысленный `alt`
- [ ] `prefers-reduced-motion` отключает анимации (сделано в T-003)

### Acceptance
- [ ] Все пункты чеклиста отмечены
- [ ] Lighthouse Accessibility ≥ 95 на всех трёх страницах

---

## T-113 — Адаптив

**Depends on:** всё
**Estimate:** 2ч
**Files:** правки по результатам

### Проверить на ширинах 360, 390, 768, 1024, 1440 px

**Лендинг:**
- [ ] Нет горизонтального скролла на 360 px
- [ ] Заголовок Hero не переносится уродливо
- [ ] Схема сравнения размеров помещается и читается
- [ ] Sticky CTA не перекрывает контент критически

**Конструктор:**
- [ ] Превью сверху, опции снизу на мобайле
- [ ] Sticky-панель не перекрывается мобильной клавиатурой при вводе гравировки
- [ ] Свотчи не выходят за экран, переносятся на новую строку
- [ ] Карточки кож в одну колонку на узком экране

**Корзина:**
- [ ] На мобайле занимает всю ширину
- [ ] Список позиций скроллится, футер с итогом остаётся видимым

**Shotlist:**
- [ ] Матрица переходит в 2 колонки на планшете, 1 на мобайле

### Acceptance
- [ ] Ни одной горизонтальной прокрутки ни на одной ширине
- [ ] Проверено на реальном телефоне, а не только в эмуляторе DevTools

---

## T-114 — Оптимизация и Lighthouse

**Depends on:** всё
**Estimate:** 2ч

### Steps

1. В проекте нет растровых изображений — сжимать нечего. Проверить, что в `public/` нет ни одного `.jpg` или `.png`
2. Проверить, что у всех `<Image>` с SVG заданы `width` и `height`
3. Проверить, что у героической иллюстрации стоит `priority`, а у остальных нет
4. Проверить CLS: у всех изображений и SVG фиксированная пропорция
5. Запустить Lighthouse в режиме инкогнито на production-сборке (`npm run build && npm start`)

### Целевые значения

| Страница | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | ≥ 95 | ≥ 95 | ≥ 95 | ≥ 95 |
| `/configurator` | ≥ 90 | ≥ 95 | ≥ 95 | — |
| `/shotlist` | ≥ 90 | ≥ 90 | ≥ 90 | — |

### Acceptance
- [ ] Целевые значения достигнуты
- [ ] CLS ≤ 0.05 на лендинге
- [ ] Ни одной ошибки в консоли браузера
- [ ] Ни одного предупреждения о hydration

---

## T-115 — Финальный чеклист приёмки

**Depends on:** всё
**Estimate:** 1ч

### Функциональные проверки

**Конструктор:**
- [ ] Все 12 доступных комбинаций кожа×цвет дают корректную схему
- [ ] Смена размера меняет пропорции контура, но **не** имя файла
- [ ] Смена кожи меняет штриховку
- [ ] Смена цвета меняет чип, но не заливку контура
- [ ] Смена нити меняет цвет пунктира шва
- [ ] Плашка «NOT IN FRAME» видна на всех трёх ракурсах
- [ ] Цена корректна для всех комбинаций опций
- [ ] Срок 14 дней показывается для made-to-order комбинаций

**URL и состояние:**
- [ ] `/configurator?size=xl&leather=pull-up&color=olive&engraving=🔥` не роняет страницу
- [ ] Скопированная ссылка восстанавливает конфигурацию полностью
- [ ] Кнопка «назад» после 10 переключений цвета уводит на предыдущую страницу
- [ ] `?utm_source=test` игнорируется

**Корзина:**
- [ ] Одинаковые конфигурации складываются в одну позицию
- [ ] Разные — в разные позиции
- [ ] «Edit» возвращает в конструктор с той же конфигурацией
- [ ] Перезагрузка сохраняет корзину
- [ ] Резерв отправляется и показывает подтверждение

**Гравировка:**
- [ ] Эмодзи не вводятся
- [ ] Больше 20 символов не вводится
- [ ] Пробелы не оплачиваются
- [ ] Модалка подтверждения появляется только при непустой гравировке

**Список кадров:**
- [ ] 47 кадров: 36 продуктовых, 11 сюжетных
- [ ] `pull-up_burgundy` отсутствует
- [ ] Печатается на A4 без потери информации
- [ ] `npm run shotlist` создаёт файл

**Лендинг:**
- [ ] Ни одной серой плашки-заглушки
- [ ] Секции патины и отзывов отсутствуют в DOM
- [ ] Все CTA ведут в конструктор
- [ ] Карточки размеров ведут с преселектом

### Технические проверки

- [ ] `npm run build` без ошибок и предупреждений
- [ ] Ни одного `any` в проекте
- [ ] Ни одного `#hex` в компонентах вне схем и свотчей
- [ ] Ни одной дробной цены
- [ ] Ни одного пакета вне списка из `BACKLOG.md`
- [ ] Ни одного `console.log` в клиентском коде

### Финальная демонстрация

Пройти путь целиком, как это увидит заказчик:

1. Открыть лендинг с телефона → пролистать до конца
2. Нажать «Build yours» → собрать блокнот
3. Скопировать ссылку → открыть в другой вкладке
4. Добавить в корзину → зарезервировать
5. Открыть `/shotlist` → распечатать

- [ ] Все пять шагов проходят без единой ошибки
- [ ] Проект готов к передаче
