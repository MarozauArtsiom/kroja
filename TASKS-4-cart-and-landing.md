# TASKS 4 — Корзина и лендинг (EPIC 5, EPIC 6)

Задачи T-071 … T-090.

> ℹ️ T-048 (стор корзины) и T-049 (модалка гравировки) перенесены в `TASKS-3-configurator.md` — они нужны раньше, для sticky-панели конструктора.

---

# EPIC 5 — Корзина

> Корзина заканчивается **резервом конфигурации**, а не оплатой. Чекаута в проекте нет.
> Стор корзины уже создан в T-048.

## T-071 — CartDrawer

**Depends on:** T-048, T-045
**Estimate:** 3ч
**Files:** создать `components/cart/CartDrawer.tsx`

### Business
Позиция раскрывает **всю** конфигурацию текстом. Человек должен видеть, что именно он заказал, не пытаясь вспомнить, какой цвет ниток выбрал. Кнопка «Edit» возвращает в конструктор с восстановленной конфигурацией — за это отвечает URL.

### Code

```tsx
// components/cart/CartDrawer.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { CartItem } from '@/types/config';
import { sizes } from '@/content/sizes';
import { leathers } from '@/content/leathers';
import { colors } from '@/content/colors';
import { threads } from '@/content/threads';
import { cords } from '@/content/cords';
import { insertNames } from '@/content/pricing';
import { copy } from '@/content/copy';
import { formatPrice } from '@/lib/format';
import { configToQueryString } from '@/lib/config-url';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/Button';
import SchematicCover from '@/components/schematic/SchematicCover';

function ItemRow({ item }: { item: CartItem }) {
  const c = item.config;
  const removeItem = useCartStore((s) => s.removeItem);

  const lines = [
    `${sizes[c.size].name} · ${leathers[c.leather].name} · ${colors[c.color].name}`,
    `Thread: ${threads[c.thread].name} · Cord: ${cords[c.cord].name}`,
    c.engraving ? `Engraving: “${c.engraving.text}” (${c.engraving.position})` : null,
    c.inserts.filter((i) => i.qty > 0).length > 0
      ? `Inserts: ${c.inserts.filter((i) => i.qty > 0).map((i) => `${i.qty} × ${insertNames[i.type]}`).join(', ')}`
      : null,
    c.giftBox ? 'Gift box included' : null,
    `Ready in ${c.productionDays} working days`,
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

        <div className="mt-2 flex gap-3 text-xs">
          <Link
            href={`/configurator${configToQueryString(c)}`}
            className="text-accent underline underline-offset-2"
          >
            {copy.cart.edit}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-muted underline underline-offset-2"
          >
            {copy.cart.remove}
          </button>
        </div>
      </div>
    </li>
  );
}

export default function CartDrawer() {
  const { items, isOpen, close, totalMinor } = useCartStore();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={close} aria-hidden />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={copy.cart.title}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-xl">{copy.cart.title}</h2>
          <button type="button" onClick={close} aria-label="Close" className="h-11 w-11 text-2xl leading-none">
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="py-10 text-sm text-muted">{copy.cart.empty}</p>
          ) : (
            <ul>
              {items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-line px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted">{copy.cart.total}</span>
              <span className="text-lg font-medium text-ink">{formatPrice(totalMinor())}</span>
            </div>
            {/* SLOT: ReserveBlock — filled in T-073 */}
          </footer>
        )}
      </aside>
    </div>
  );
}
```

### Do NOT
- ❌ Не добавлять кнопку «Checkout» или «Pay» — чекаута в проекте нет
- ❌ Не импортировать `ReserveBlock` — он создаётся в T-073. Оставить маркер `{/* SLOT: ReserveBlock */}`
- ❌ Не сокращать список конфигурации: показывать все выбранные параметры

### Acceptance
- [ ] Открывается справа, на мобайле занимает всю ширину
- [ ] Показана полная конфигурация каждой позиции
- [ ] «Edit» возвращает в конструктор с восстановленной конфигурацией
- [ ] Escape и клик по затемнению закрывают
- [ ] Фон не скроллится при открытой корзине

---

## T-073 — ReserveBlock

**Depends on:** T-071
**Estimate:** 1.5ч
**Files:** создать `components/cart/ReserveBlock.tsx`

### Business
Ключевой момент воронки. Лендинг обещает, что товар можно купить, поэтому корзина **не может** упираться в «мы не продаём» — это разрушает впечатление за один экран. Формулировка честная, но сохраняет импульс: «первая партия открывается тогда-то, зарезервируй».

Собранные конфигурации — самые ценные данные проекта: они показывают, какие сочетания люди реально хотят, ещё до закупки кожи.

### Code

```tsx
// components/cart/ReserveBlock.tsx
'use client';

import { useState } from 'react';
import { copy } from '@/content/copy';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/Button';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function ReserveBlock() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const items = useCartStore((s) => s.items);
  const totalMinor = useCartStore((s) => s.totalMinor);

  async function submit() {
    if (!email.includes('@') || email.length < 5) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'reservation',
          email,
          cart: items.map((i) => ({ config: i.config, qty: i.qty })),
          cartTotalMinor: totalMinor(),
          ts: Date.now(),
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-sm border border-line bg-paper-2 p-4 text-sm text-ink">
        {copy.reserve.success}
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-paper-2 p-4">
      <p className="mb-1 text-sm font-medium text-ink">{copy.reserve.title}</p>
      <p className="mb-3 text-xs leading-relaxed text-ink-soft">{copy.reserve.body}</p>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.reserve.placeholder}
          aria-label="Email"
          className="h-11 min-w-0 flex-1 rounded-sm border border-line bg-paper px-3 text-base"
        />
        <Button onClick={submit} disabled={status === 'sending'}>
          {copy.reserve.button}
        </Button>
      </div>

      {status === 'error' && <p className="mt-2 text-xs text-alert">{copy.reserve.error}</p>}
    </div>
  );
}
```

### Подключение

В `components/cart/CartDrawer.tsx` заменить строку `{/* SLOT: ReserveBlock — filled in T-073 */}` на `<ReserveBlock />` и добавить импорт `import ReserveBlock from './ReserveBlock';`

### Do NOT
- ❌ Не писать «мы не продаём» — формулировка «первая партия открывается» правдива и сохраняет импульс
- ❌ Не блокировать интерфейс при ошибке сети

### Acceptance
- [ ] Блок виден внизу корзины, когда в ней есть товары
- [ ] Отправка показывает подтверждение
- [ ] Ошибка сети показывает сообщение, но не ломает корзину
- [ ] Кнопка не отправляет пустой или невалидный email

---

## T-074 — API route /api/reserve

**Depends on:** T-073
**Estimate:** 1ч
**Files:** создать `app/api/reserve/route.ts`

### Business
Единственная серверная ручка в проекте. Принимает два типа заявок: резерв конфигурации из корзины и подписка на появление комбинации. Пока пишет в лог сервера; когда появится ключ Resend — отправляет письмо.

### Code

```ts
// app/api/reserve/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { configSchema } from '@/lib/config-schema';

const payloadSchema = z.union([
  z.object({
    kind: z.literal('reservation'),
    email: z.string().email(),
    cart: z.array(
      z.object({
        config: configSchema.passthrough(),
        qty: z.number().int().min(1),
      }),
    ),
    cartTotalMinor: z.number().int().min(0),
    ts: z.number(),
  }),
  z.object({
    kind: z.literal('stock-notify'),
    email: z.string().email(),
    leather: z.string(),
    color: z.string(),
  }),
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid payload' }, { status: 400 });
  }

  const data = parsed.data;

  // Until an email provider is connected, log it. Vercel keeps function logs.
  console.log('[KROJA reserve]', JSON.stringify(data));

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESERVE_NOTIFY_EMAIL;

  if (apiKey && to) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'KROJA <onboarding@resend.dev>',
          to,
          subject:
            data.kind === 'reservation'
              ? `New reservation from ${data.email}`
              : `Stock notify request: ${data.leather} / ${data.color}`,
          text: JSON.stringify(data, null, 2),
        }),
      });
    } catch (error) {
      console.error('[KROJA reserve] email failed', error);
      // Do not fail the user's request because email failed.
    }
  }

  return NextResponse.json({ ok: true });
}
```

Создать `.env.example`:
```
# Optional. Without these the API route only logs to the server console.
RESEND_API_KEY=
RESERVE_NOTIFY_EMAIL=
```

### Do NOT
- ❌ Не подключать библиотеку `resend` — используем `fetch`, чтобы не добавлять зависимость
- ❌ Не возвращать ошибку пользователю, если не отправилось письмо

### Acceptance
- [ ] POST с валидным телом возвращает `{ ok: true }`
- [ ] POST с битым JSON возвращает 400 и не роняет сервер
- [ ] Заявка видна в консоли сервера
- [ ] Отсутствие переменных окружения не ломает ручку

---

## T-075 — Иконка корзины в шапке

**Depends on:** T-048
**Estimate:** 0.5ч
**Files:** создать `components/cart/CartButton.tsx`

### Code

```tsx
// components/cart/CartButton.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';
import { copy } from '@/content/copy';

export default function CartButton() {
  const [mounted, setMounted] = useState(false);
  const open = useCartStore((s) => s.open);
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  // Avoid hydration mismatch: localStorage is only available on the client.
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`${copy.nav.cart}${mounted && count > 0 ? `, ${count} items` : ''}`}
      className="flex h-11 items-center gap-1.5 px-2 text-sm text-ink"
    >
      {copy.nav.cart}
      {mounted && count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] text-paper">
          {count}
        </span>
      )}
    </button>
  );
}
```

### Do NOT
- ❌ Не рендерить счётчик до монтирования — иначе React выдаст ошибку гидратации

### Acceptance
- [ ] Счётчик показывает суммарное количество
- [ ] Нет предупреждений о hydration mismatch в консоли
- [ ] Клик открывает корзину

---

# EPIC 6 — Лендинг

> ⚠️ **Стандарт лендинга выше, чем у остального проекта.** Он должен читаться как работающий магазин: финальные тексты, настоящие фотографии, Lighthouse ≥ 95. Ни одной серой плашки-заглушки в основном потоке.

## T-080 — Header и Footer

**Depends on:** T-030, T-075
**Estimate:** 2ч
**Files:** создать `components/landing/Header.tsx`, `components/landing/Footer.tsx`

### Code

`components/landing/Header.tsx`:
```tsx
// components/landing/Header.tsx
'use client';

import Link from 'next/link';
import { copy } from '@/content/copy';
import CartButton from '@/components/cart/CartButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl tracking-wide text-ink">
          {copy.brand.name}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
          <a href="#leather" className="hover:text-ink">{copy.nav.materials}</a>
          <a href="#craft" className="hover:text-ink">{copy.nav.craft}</a>
          <a href="#faq" className="hover:text-ink">{copy.nav.faq}</a>
          <Link href="/shotlist" className="hover:text-ink">{copy.nav.shotlist}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <CartButton />
          <Link
            href="/configurator"
            className="inline-flex h-11 items-center rounded-sm bg-accent px-5 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
          >
            {copy.nav.build}
          </Link>
        </div>
      </div>
    </header>
  );
}
```

`components/landing/Footer.tsx`:
```tsx
// components/landing/Footer.tsx
import { copy } from '@/content/copy';

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="container-content flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xl text-ink">{copy.brand.name}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">{copy.footer.line}</p>
        </div>
        <div className="text-sm text-muted">
          <p>{copy.brand.city}</p>
          <p className="mt-1">hello@kroja.example</p>
          <p className="mt-3 text-xs">© {new Date().getFullYear()} KROJA. {copy.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
```

### Acceptance
- [ ] Шапка липкая, не перекрывает якорные переходы (за это отвечает `scroll-padding-top` из T-003)
- [ ] Ссылка «Build yours» акцентная, высотой 44 px
- [ ] На мобайле навигация скрыта, кнопка и корзина видны

---

## T-081 — S1 Hero

**Depends on:** T-080, T-018
**Estimate:** 2ч
**Files:** создать `components/landing/Hero.tsx`

### Business
Пять секунд, чтобы объяснить, что это, и дать первый вход в конструктор. Заголовок — обещание («обложка переживёт блокнот»), а не описание товара.

### Business (уточнение)
Фотографий у проекта нет и не будет. Вместо снимка — готовая SVG-иллюстрация из T-043.

### Code

```tsx
// components/landing/Hero.tsx
import Link from 'next/link';
import { copy } from '@/lib/data';
import Illustration from './Illustration';

export default function Hero() {
  return (
    <section className="container-content pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="mb-5">{copy.hero.title}</h1>
          <p className="mb-8 max-w-prose text-lg text-ink-soft">{copy.hero.subtitle}</p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/configurator"
              className="inline-flex h-14 items-center rounded-sm bg-accent px-8 text-base font-medium text-paper transition-colors hover:bg-accent-dark"
            >
              {copy.hero.cta}
            </Link>
            <a
              href="#leather"
              className="inline-flex h-14 items-center px-4 text-base text-ink underline underline-offset-4"
            >
              {copy.hero.ctaSecondary}
            </a>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.1em] text-muted">{copy.hero.trust}</p>
        </div>

        <div className="rounded-sm border border-line bg-paper-2 p-6 md:p-8">
          <Illustration name="hero" priority />
        </div>
      </div>
    </section>
  );
}
```

### Acceptance
- [ ] Заголовок виден без скролла на 360 px
- [ ] Кнопка ведёт на `/configurator`
- [ ] Иллюстрация имеет `priority` и не вызывает сдвига макета
- [ ] На странице нет ни одного `<img>` с фотографией
- [ ] Вторая кнопка скроллит к секции кожи

---

## T-082 — S2 Три причины

**Depends on:** T-081
**Estimate:** 1.5ч
**Files:** создать `components/landing/Reasons.tsx`

### Business
Отвечает на главное возражение: «чем это лучше блокнота за 90 zł». Третий пункт — про то, что бумага расходник, а обложка нет — самый сильный, и он идёт последним, чтобы запомниться.

Использует пилотные кадры 2, 3, 4 (макро шва, кромки, фактуры).

### Code

```tsx
// components/landing/Reasons.tsx
import { copy } from '@/lib/data';
import Illustration from './Illustration';
import SchematicCover from '@/components/schematic/SchematicCover';
import { DEFAULT_CONFIG } from '@/lib/config-schema';

/** One illustration per reason. The third reuses the open-cover schematic. */
const visuals = ['stitch', 'refill', 'schematic'] as const;

export default function Reasons() {
  return (
    <section className="section bg-paper-2">
      <div className="container-content">
        <h2 className="mb-10 max-w-prose">{copy.reasons.title}</h2>

        <div className="grid gap-8 md:grid-cols-3">
          {copy.reasons.items.map((item, i) => (
            <article key={item.title}>
              <div className="mb-4 rounded-sm border border-line bg-paper p-5">
                {visuals[i] === 'schematic' ? (
                  <SchematicCover config={DEFAULT_CONFIG} angle="open" compact />
                ) : (
                  <Illustration name={visuals[i]} />
                )}
              </div>
              <h3 className="mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Acceptance
- [ ] Три колонки на десктопе, одна на мобайле
- [ ] Все три текста из `copy.reasons.items`
- [ ] Иллюстрации не сдвигают макет при загрузке
- [ ] Ни одной фотографии на странице

---

## T-083 — S3 Выбор размера

**Depends on:** T-081, T-044
**Estimate:** 2.5ч
**Files:** создать `components/landing/Sizes.tsx`

### Business
Секция, полностью построенная на SVG-схемах — фотографий не требует вообще. Это ключевое преимущество: размер объясняется чертежом, и потому одна фотография покрывает все четыре формата.

Каждая карточка ведёт в конструктор с предвыбранным размером: `?size=a5`.

### Code

```tsx
// components/landing/Sizes.tsx
import Link from 'next/link';
import { sizeList } from '@/content/sizes';
import { copy } from '@/content/copy';
import { formatDimensions, formatPrice, formatWeight } from '@/lib/format';
import SizeDiagram from '@/components/schematic/SizeDiagram';

export default function Sizes() {
  return (
    <section id="sizes" className="section">
      <div className="container-content">
        <h2 className="mb-2">{copy.sizes.title}</h2>
        <p className="mb-10 max-w-prose text-ink-soft">{copy.sizes.subtitle}</p>

        <div className="mb-12 rounded-sm border border-line p-6">
          <SizeDiagram active="a5" mode="compare" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sizeList.map((s) => (
            <Link
              key={s.code}
              href={`/configurator?size=${s.code}`}
              className="group flex flex-col rounded-sm border border-line p-5 transition-colors hover:border-ink"
            >
              <h3 className="mb-1 text-lg">{s.name}</h3>
              <p className="mb-3 text-sm text-muted">{formatDimensions(s.coverMm)}</p>
              <p className="mb-4 flex-1 text-sm text-ink-soft">{s.useCase}</p>
              <dl className="mb-4 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <dt>{copy.sizes.capacity}</dt>
                  <dd>{s.insertCapacity} {copy.sizes.inserts}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Weight</dt>
                  <dd>{formatWeight(s.weightG)}</dd>
                </div>
              </dl>
              <p className="text-sm text-ink">
                {formatPrice(s.basePriceMinor)}
                <span className="ml-2 text-accent underline underline-offset-4 group-hover:no-underline">
                  {copy.sizes.build}
                </span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Acceptance
- [ ] Схема сравнения показывает четыре формата и телефон в одном масштабе
- [ ] Клик по карточке открывает конструктор с нужным размером
- [ ] Габариты, вес и вместимость выведены для каждого формата

---

## T-084 — S4 Кожа

**Depends on:** T-081, T-033
**Estimate:** 3ч
**Files:** создать `components/landing/Leather.tsx`

### Business
Самая длинная секция. Заменяет собой отдельную страницу материалов и снимает главное возражение — «а вдруг придёт не то, что на фото».

Блок «Это не дефект» обязателен: он снижает возвраты, повышает доверие и работает как знак экспертности. Брендов, которые честно предупреждают о недостатках материала, почти нет.

### Steps

1. Три вкладки по типам кожи
2. По каждому: фото фактуры, описание, происхождение, толщина, три этапа старения
3. Сравнительная таблица по трём параметрам (устойчивость к царапинам, скорость патины, мягкость) — шкала 1–5, отрисовать точками
4. Блок «This is not a defect» — на всю ширину, визуально выделен
5. Аккордеон «Care»
6. CTA в конструктор с преселектом типа кожи: `/configurator?leather=crazy-horse`

### Code (структура)

```tsx
// components/landing/Leather.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { LeatherCode } from '@/types/config';
import { leatherList, leathers, copy } from '@/lib/data';
import { DEFAULT_CONFIG } from '@/lib/config-schema';
import SchematicCover from '@/components/schematic/SchematicCover';
import { formatThickness } from '@/lib/format';
import Accordion from '@/components/ui/Accordion';
import clsx from 'clsx';

function Scale({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="flex gap-1" aria-label={`${label}: ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={clsx('h-2 w-2 rounded-full', n <= value ? 'bg-ink' : 'bg-line')}
          />
        ))}
      </span>
    </div>
  );
}

export default function Leather() {
  const [active, setActive] = useState<LeatherCode>('veg-tan');
  const l = leathers[active];

  return (
    <section id="leather" className="section">
      <div className="container-content">
        <h2 className="mb-2">{copy.leather.title}</h2>
        <p className="mb-10 max-w-prose text-ink-soft">{copy.leather.subtitle}</p>

        {/* Tabs */}
        <div role="tablist" aria-label="Leather types" className="mb-8 flex flex-wrap gap-2">
          {leatherList.map((item) => (
            <button
              key={item.code}
              role="tab"
              aria-selected={active === item.code}
              onClick={() => setActive(item.code)}
              className={clsx(
                'h-11 rounded-sm border px-5 text-sm transition-colors',
                active === item.code ? 'border-ink bg-paper-2 text-ink' : 'border-line text-muted hover:border-ink-soft',
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-sm border border-line bg-paper-2 p-6">
            <SchematicCover
              config={{ ...DEFAULT_CONFIG, leather: active, color: leathers[active].availableColors[0] }}
              angle="detail"
              compact
            />
            <p className="mt-3 text-center text-xs text-muted">
              Schematic hatch, not a photograph of the actual grain.
            </p>
          </div>

          <div>
            <p className="mb-6 text-ink-soft">{l.description}</p>

            <dl className="mb-6 space-y-1 border-y border-line py-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">{copy.leather.origin}</dt><dd>{l.origin}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Tanning</dt><dd>{l.tanning}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">{copy.leather.thickness}</dt><dd>{formatThickness(l.thicknessMm)}</dd></div>
            </dl>

            <div className="mb-6">
              <Scale value={l.scratchResistance} label={copy.leather.scratchResistance} />
              <Scale value={l.patinaSpeed} label={copy.leather.patinaSpeed} />
              <Scale value={l.softness} label={copy.leather.softness} />
            </div>

            <h3 className="mb-3 text-base">{copy.leather.ageingTitle}</h3>
            <dl className="mb-8 space-y-2 text-sm">
              <div><dt className="text-muted">{copy.leather.m6}</dt><dd className="text-ink-soft">{l.ageing.m6}</dd></div>
              <div><dt className="text-muted">{copy.leather.m12}</dt><dd className="text-ink-soft">{l.ageing.m12}</dd></div>
              <div><dt className="text-muted">{copy.leather.m36}</dt><dd className="text-ink-soft">{l.ageing.m36}</dd></div>
            </dl>

            <Link
              href={`/configurator?leather=${active}`}
              className="inline-flex h-11 items-center rounded-sm border border-ink px-5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              {copy.leather.build}
            </Link>
          </div>
        </div>

        {/* This is not a defect */}
        <div className="mt-16 rounded-sm border border-line bg-paper-2 p-6 md:p-10">
          <h3 className="mb-3">{copy.leather.notDefect.title}</h3>
          <p className="max-w-prose text-ink-soft">{copy.leather.notDefect.body}</p>
        </div>

        <div className="mt-10">
          <Accordion
            items={[{ id: 'care', title: copy.leather.careTitle, body: copy.leather.careBody }]}
          />
        </div>
      </div>
    </section>
  );
}
```

### Do NOT
- ❌ Не убирать блок «This is not a defect» и не смягчать его формулировку

### Acceptance
- [ ] Три вкладки переключаются, содержимое меняется полностью
- [ ] Шкалы 1–5 отрисованы точками и имеют `aria-label`
- [ ] CTA ведёт в конструктор с нужной кожей
- [ ] Блок «This is not a defect» визуально выделен

---

## T-085 — S6 Как это делается

**Depends on:** T-081
**Estimate:** 1.5ч
**Files:** создать `components/landing/Process.tsx`

### Business
Доказывает, что handmade настоящий. Лицо мастера обязательно: обезличенный «мастер» не работает.

В режиме `compact` (задан в `content/sections.ts`) используется два пилотных кадра вместо шести. Шесть шагов процесса всё равно перечисляются текстом.

### Business (уточнение)
Фотографий процесса нет. Секция строится **только на типографике**: шесть шагов нумерованным списком в две колонки, крупные цифры, короткие описания. Это работает — секция объясняет процесс словами, а не картинками.

### Steps

1. Прочитать `sections.process`. Если `false` — вернуть `null`
2. Отрисовать шесть шагов из `copy.process.steps`: крупная цифра шага серифом, заголовок, описание
3. Раскладка: две колонки на десктопе, одна на мобайле
4. Под списком — строка «Made by hand in Kraków, Poland»
5. Никаких изображений в этой секции

### Acceptance
- [ ] Шесть шагов выведены с нумерацией
- [ ] При `sections.process === false` секция не рендерится вообще
- [ ] Город указан
- [ ] В секции нет ни одного изображения

---

## T-086 — S7 Что входит и сроки

**Depends on:** T-081
**Estimate:** 1ч
**Files:** создать `components/landing/Included.tsx`

### Business
Секция без фотографий. Главное здесь — **явное указание совместимости** со сторонними вкладышами (Moleskine, Leuchtturm1917, Traveler's Notebook). Это расширяет аудиторию за счёт людей, уже живущих в чужой экосистеме, и снимает страх «а что потом с бумагой».

### Acceptance
- [ ] Перечислено всё из `copy.included.items`
- [ ] Названия совместимых брендов указаны прямо
- [ ] Сроки 5 и 14 дней указаны явно

---

## T-087 — S9 FAQ

**Depends on:** T-081, T-033
**Estimate:** 1.5ч
**Files:** создать `components/landing/Faq.tsx`

### Code

```tsx
// components/landing/Faq.tsx
import { copy } from '@/content/copy';
import Accordion from '@/components/ui/Accordion';

export default function Faq() {
  return (
    <section id="faq" className="section">
      <div className="container-content max-w-3xl">
        <h2 className="mb-8">{copy.faq.title}</h2>
        <Accordion
          items={copy.faq.items.map((item, i) => ({
            id: `faq-${i}`,
            title: item.q,
            body: item.a,
          }))}
        />
      </div>
    </section>
  );
}
```

### Do NOT
- ❌ Не менять формулировку ответа про возврат. Она намеренно нейтральна: юридические условия ещё не финализированы, и обещать конкретику нельзя

### Acceptance
- [ ] Девять вопросов
- [ ] Открыт может быть один
- [ ] Ответ про возврат совпадает с текстом из `copy.ts` дословно

---

## T-088 — S10 Финальный CTA

**Depends on:** T-081
**Estimate:** 0.5ч
**Files:** создать `components/landing/FinalCta.tsx`

### Acceptance
- [ ] Заголовок и текст из `copy.finalCta`
- [ ] Кнопка ведёт на `/configurator`
- [ ] Секция визуально отделена фоном `bg-paper-2`

---

## T-089 — Sticky CTA на мобайле

**Depends on:** T-081
**Estimate:** 1ч
**Files:** создать `components/landing/StickyCta.tsx`

### Business
Лендинг длинный, решение может созреть на любой секции. Возможность действовать не должна требовать прокрутки обратно наверх.

### Code

```tsx
// components/landing/StickyCta.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { copy } from '@/content/copy';

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={clsx(
        'fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 p-3 backdrop-blur transition-transform duration-200 md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <Link
        href="/configurator"
        className="flex h-12 w-full items-center justify-center rounded-sm bg-accent text-sm font-medium text-paper"
      >
        {copy.hero.cta}
      </Link>
    </div>
  );
}
```

### Acceptance
- [ ] Появляется после прокрутки первого экрана
- [ ] Виден только на мобайле
- [ ] Не перекрывает футер критически

---

## T-090 — Сборка страницы

**Depends on:** T-081 … T-089
**Estimate:** 1ч
**Files:** изменить `app/page.tsx`

### Code

```tsx
// app/page.tsx
import { sections } from '@/content/sections';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import Reasons from '@/components/landing/Reasons';
import Sizes from '@/components/landing/Sizes';
import Leather from '@/components/landing/Leather';
import Process from '@/components/landing/Process';
import Included from '@/components/landing/Included';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';
import StickyCta from '@/components/landing/StickyCta';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Reasons />
        <Sizes />
        <Leather />
        {/* S5 Patina: hidden — no year-old photograph exists */}
        {sections.process !== false && <Process />}
        <Included />
        {/* S8 Reviews: hidden — real reviews only, never invented */}
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <CartDrawer />
    </>
  );
}
```

### Do NOT
- ❌ Не оставлять на странице ни одного `<PhotoSlot>` — он используется только на `/shotlist`
- ❌ Не добавлять фотографии. Весь визуал лендинга — SVG-иллюстрации и типографика

### Acceptance
- [ ] Все секции идут в правильном порядке
- [ ] Секции патины и отзывов отсутствуют в DOM
- [ ] На странице нет ни одной серой плашки-заглушки и ни одной фотографии
- [ ] Корзина открывается с лендинга
- [ ] `npm run build` проходит

---

## Контрольная точка EPIC 5–6

- [ ] Полный путь работает: лендинг → конструктор → корзина → резерв
- [ ] Из корзины «Edit» возвращает в конструктор с той же конфигурацией
- [ ] На лендинге нет плашек-заглушек
- [ ] Lighthouse на `/` ≥ 90 (до финальной оптимизации в T-114)
