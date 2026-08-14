# TASKS 2 — UI-примитивы и схемы (EPIC 2, EPIC 3)

Задачи T-030 … T-045.

---

# EPIC 2 — UI-примитивы

> Все компоненты этого эпика — «глупые»: они не знают о конфигурации блокнота, не ходят в стор, не знают о бизнес-логике. Они принимают props и рисуют.

## T-030 — Button

**Depends on:** T-003
**Estimate:** 0.5ч
**Files:** создать `components/ui/Button.tsx`

### Code

```tsx
// components/ui/Button.tsx
'use client';

import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-paper hover:bg-accent-dark',
  secondary: 'bg-transparent text-ink border border-line hover:border-ink',
  ghost: 'bg-transparent text-ink-soft hover:text-ink underline underline-offset-4',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-sm font-medium',
        'transition-colors duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
```

### Acceptance
- [ ] Кнопка отрисовывается во всех трёх вариантах
- [ ] Высота `md` ровно 44 px (класс `h-11`) — это минимальная зона нажатия

---

## T-031 — Swatch и SwatchGroup

**Depends on:** T-030
**Estimate:** 2ч
**Files:** создать `components/ui/Swatch.tsx`, `components/ui/SwatchGroup.tsx`

### Business
Свотч цвета — самый частый элемент конструктора. Три требования, каждое обязательно:
1. **Цвет никогда не единственный признак** — под свотчем всегда есть название текстом, иначе интерфейс непроходим для человека с нарушением цветовосприятия
2. **Недоступный вариант не исчезает** — он затемняется и объясняет причину
3. **Зона нажатия ≥ 44 × 44 px** — иначе на телефоне невозможно попасть

### Code

`components/ui/Swatch.tsx`:
```tsx
// components/ui/Swatch.tsx
'use client';

import clsx from 'clsx';

export interface SwatchProps {
  value: string;
  label: string;
  hex: string;
  selected: boolean;
  /** 'available' | 'made-to-order' | 'disabled' */
  state: 'available' | 'made-to-order' | 'disabled';
  /** Shown under the label when state is 'disabled' or 'made-to-order' */
  note?: string;
  onSelect: (value: string) => void;
}

export default function Swatch({
  value, label, hex, selected, state, note, onSelect,
}: SwatchProps) {
  const disabled = state === 'disabled';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      // Disabled swatches stay focusable so screen readers can announce the reason.
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(value)}
      className={clsx(
        'group flex w-[72px] flex-col items-center gap-1.5 rounded-sm p-1',
        'transition-opacity duration-150',
        disabled && 'opacity-40',
      )}
      title={note ?? label}
    >
      <span
        className={clsx(
          'relative block h-11 w-11 rounded-full border transition-all duration-150',
          selected ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'border-line',
          !disabled && !selected && 'group-hover:border-ink',
        )}
        style={{ backgroundColor: hex }}
      >
        {disabled && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(250,247,242,.85) 3px, rgba(250,247,242,.85) 5px)',
            }}
          />
        )}
      </span>

      <span className="text-center text-[11px] leading-tight text-ink-soft">{label}</span>

      {state === 'made-to-order' && (
        <span className="text-center text-[10px] leading-tight text-muted">Made to order</span>
      )}
      {disabled && note && (
        <span className="text-center text-[10px] leading-tight text-muted">{note}</span>
      )}
    </button>
  );
}
```

`components/ui/SwatchGroup.tsx`:
```tsx
// components/ui/SwatchGroup.tsx
'use client';

import { useRef } from 'react';
import Swatch, { type SwatchProps } from './Swatch';

export interface SwatchItem extends Omit<SwatchProps, 'onSelect' | 'selected'> {}

interface Props {
  label: string;
  items: SwatchItem[];
  value: string;
  onChange: (value: string) => void;
}

export default function SwatchGroup({ label, items, value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Arrow-key navigation inside the radio group.
  function handleKeyDown(e: React.KeyboardEvent) {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const selectable = items.filter((i) => i.state !== 'disabled');
    const currentIndex = selectable.findIndex((i) => i.value === value);
    if (currentIndex === -1) return;

    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const nextIndex = forward
      ? (currentIndex + 1) % selectable.length
      : (currentIndex - 1 + selectable.length) % selectable.length;

    onChange(selectable[nextIndex].value);
    // Move focus to the newly selected swatch.
    requestAnimationFrame(() => {
      const buttons = ref.current?.querySelectorAll('button');
      buttons?.[items.findIndex((i) => i.value === selectable[nextIndex].value)]?.focus();
    });
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => (
        <Swatch
          key={item.value}
          {...item}
          selected={item.value === value}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
```

### Do NOT
- ❌ Не скрывать недоступные свотчи
- ❌ Не убирать текстовую подпись под свотчем
- ❌ Не делать круг меньше `h-11 w-11`

### Acceptance
- [ ] Стрелками клавиатуры выбор переключается только между доступными свотчами
- [ ] Недоступный свотч виден, затемнён и имеет диагональную штриховку
- [ ] У каждого свотча есть подпись текстом
- [ ] Выбранный свотч имеет видимое кольцо

---

## T-032 — OptionCard и OptionCardGroup

**Depends on:** T-030
**Estimate:** 1.5ч
**Files:** создать `components/ui/OptionCard.tsx`, `components/ui/OptionCardGroup.tsx`

### Business
Крупные карточки для выбора размера и типа кожи — там, где нужно показать больше, чем цветной кружок: габариты, вес, цену, надбавку.

### Code

`components/ui/OptionCard.tsx`:
```tsx
// components/ui/OptionCard.tsx
'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface OptionCardProps {
  value: string;
  title: string;
  /** Second line, e.g. "148 × 210 mm" */
  meta?: string;
  /** Third line, e.g. "+30 zł" */
  delta?: string;
  /** Optional visual: hatch preview, small diagram */
  visual?: ReactNode;
  selected: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onSelect: (value: string) => void;
}

export default function OptionCard({
  value, title, meta, delta, visual, selected, disabled, disabledReason, onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={selected ? 0 : -1}
      onClick={() => !disabled && onSelect(value)}
      className={clsx(
        'flex min-h-[44px] flex-col items-start gap-1 rounded-sm border p-3 text-left',
        'transition-colors duration-150',
        selected ? 'border-ink bg-paper-2' : 'border-line hover:border-ink-soft',
        disabled && 'cursor-not-allowed opacity-40 hover:border-line',
      )}
    >
      {visual && <span className="mb-1 block w-full">{visual}</span>}
      <span className="text-sm font-medium text-ink">{title}</span>
      {meta && <span className="text-xs text-muted">{meta}</span>}
      {delta && <span className="text-xs text-accent">{delta}</span>}
      {disabled && disabledReason && (
        <span className="text-xs text-muted">{disabledReason}</span>
      )}
    </button>
  );
}
```

`components/ui/OptionCardGroup.tsx`:
```tsx
// components/ui/OptionCardGroup.tsx
'use client';

import OptionCard, { type OptionCardProps } from './OptionCard';

export interface OptionCardItem extends Omit<OptionCardProps, 'onSelect' | 'selected'> {}

interface Props {
  label: string;
  items: OptionCardItem[];
  value: string;
  onChange: (value: string) => void;
  /** Tailwind grid columns class, e.g. 'grid-cols-2 md:grid-cols-4' */
  columns?: string;
}

export default function OptionCardGroup({
  label, items, value, onChange, columns = 'grid-cols-2',
}: Props) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-2 ${columns}`}>
      {items.map((item) => (
        <OptionCard
          key={item.value}
          {...item}
          selected={item.value === value}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
```

### Acceptance
- [ ] Недоступная карточка не реагирует на клик
- [ ] Недоступная карточка показывает причину текстом
- [ ] Выбранная карточка визуально отличается рамкой и фоном

---

## T-033 — Accordion

**Depends on:** T-030
**Estimate:** 1ч
**Files:** создать `components/ui/Accordion.tsx`

### Code

```tsx
// components/ui/Accordion.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';

export interface AccordionItem {
  id: string;
  title: string;
  body: string;
}

interface Props {
  items: AccordionItem[];
  /** Called when an item opens. Used for analytics later. */
  onOpen?: (id: string) => void;
}

export default function Accordion({ items, onOpen }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next && onOpen) onOpen(next);
  }

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`panel-${item.id}`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-base text-ink">{item.title}</span>
              <span
                aria-hidden
                className={clsx(
                  'shrink-0 text-xl leading-none text-muted transition-transform duration-150',
                  open && 'rotate-45',
                )}
              >
                +
              </span>
            </button>
            <div
              id={`panel-${item.id}`}
              hidden={!open}
              className="max-w-prose pb-5 text-sm leading-relaxed text-ink-soft"
            >
              {item.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Acceptance
- [ ] Открыт может быть только один пункт
- [ ] `aria-expanded` меняется при открытии
- [ ] Плюс поворачивается в крестик

---

## T-034 — Modal

**Depends on:** T-030
**Estimate:** 1.5ч
**Files:** создать `components/ui/Modal.tsx`

### Business
Используется в одном критичном месте: подтверждение текста гравировки перед добавлением в корзину. Цена ошибки максимальная — гравировку нельзя переделать.

### Code

```tsx
// components/ui/Modal.tsx
'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Rendered at the bottom, usually buttons */
  footer?: ReactNode;
}

export default function Modal({ open, title, onClose, children, footer }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    const first = ref.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // Focus trap
      const focusables = ref.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-sm border border-line bg-paper p-6 shadow-lg"
      >
        <h3 className="mb-3 text-xl">{title}</h3>
        <div className="mb-6 text-sm text-ink-soft">{children}</div>
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
```

### Acceptance
- [ ] Escape закрывает модалку
- [ ] Tab не выходит за пределы модалки
- [ ] После закрытия фокус возвращается на кнопку, которая её открыла
- [ ] Клик по затемнению закрывает

---

## T-035 — Toast и ToastProvider

**Depends on:** T-030
**Estimate:** 1.5ч
**Files:** создать `components/ui/Toast.tsx`

### Business
Показывает неблокирующие сообщения о том, что конфигурация была изменена автоматически: «Colour changed to Cognac — Burgundy isn't available in Crazy Horse». Без такого сообщения человек не понимает, почему цвет вдруг стал другим.

### Code

```tsx
// components/ui/Toast.tsx
'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-24 left-1/2 z-40 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-sm border border-line bg-paper px-4 py-3 text-sm text-ink shadow-md"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

### Do NOT
- ❌ Не делать тосты блокирующими и не требовать закрытия вручную
- ❌ Не показывать тост дольше 4 секунд

### Acceptance
- [ ] `showToast('test')` показывает сообщение и оно исчезает через 4 секунды
- [ ] Два подряд вызванных тоста показываются оба
- [ ] Контейнер имеет `aria-live="polite"`

---

## T-036 — PhotoSlot

**Depends on:** T-030
**Estimate:** 1ч
**Files:** создать `components/ui/PhotoSlot.tsx`

### Business
Место под будущую фотографию. Не серый прямоугольник, а **карточка-задание**: что за кадр, какие требования, зачем он нужен. Мастер листает страницу и понимает список сюжетов в контексте.

Второе назначение: все слоты автоматически собираются в список кадров на `/shotlist`.

### Code

```tsx
// components/ui/PhotoSlot.tsx
import clsx from 'clsx';

export interface PhotoSlotSpec {
  id: string;
  /** CSS aspect-ratio, e.g. '4 / 5' */
  ratio: string;
  subject: string;
  requirement: string;
  why: string;
}

interface Props extends PhotoSlotSpec {
  className?: string;
}

export default function PhotoSlot({
  id, ratio, subject, requirement, why, className,
}: Props) {
  return (
    <figure
      data-photo-slot={id}
      style={{ aspectRatio: ratio }}
      className={clsx(
        'flex flex-col justify-between border border-dashed border-line bg-paper-2 p-4',
        className,
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{id}</span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink">{subject}</p>
        <p className="text-xs text-ink-soft">{requirement}</p>
        <p className="text-xs italic text-muted">{why}</p>
      </div>
    </figure>
  );
}
```

### Do NOT
- ❌ Не использовать этот компонент на лендинге в основном потоке. Лендинг наполняется настоящими фотографиями, а секции без фото скрываются целиком (см. T-090)
- ❌ Не убирать `data-photo-slot` — по этому атрибуту работает сбор списка кадров

### Acceptance
- [ ] Слот сохраняет заданную пропорцию при любой ширине
- [ ] В DOM присутствует атрибут `data-photo-slot`
- [ ] Видны все три текста: сюжет, требование, обоснование

---

# EPIC 3 — Схематические чертежи

> ⚠️ **Главная часть проекта.** Схема — это техническое задание фотографу, отрисованное в браузере.
>
> **Все SVG уже нарисованы** и лежат в папке `kroja-svg/`. Задача — скопировать их и перенести в React-компонент, а не рисовать заново. Она не изображает кожу и не пытается быть красивой картинкой товара. Она объясняет: какая геометрия кадра, что должно быть в фокусе, чего в кадре быть не должно, каким именем ляжет файл.

## T-040 — Копирование готовых SVG-файлов

**Depends on:** T-004
**Estimate:** 0.25ч
**Files:** скопировать 6 файлов в `public/schematic/` и `public/illustrations/`

### Business
Все чертежи и иллюстрации **уже нарисованы и лежат в папке `kroja-svg/`**. Рисовать ничего не нужно.

### Steps

1. Создать папки `public/schematic/` и `public/illustrations/`
2. Скопировать из `kroja-svg/`:
   - `cover-front.svg` → `public/schematic/cover-front.svg`
   - `cover-open.svg` → `public/schematic/cover-open.svg`
   - `cover-detail.svg` → `public/schematic/cover-detail.svg`
   - `hero-illustration.svg` → `public/illustrations/hero.svg`
   - `stitch-detail.svg` → `public/illustrations/stitch.svg`
   - `refill-diagram.svg` → `public/illustrations/refill.svg`
3. Ничего в них не менять

### Do NOT
- ❌ Не редактировать SVG
- ❌ Не перерисовывать, не «улучшать», не менять координаты
- ❌ Не оптимизировать через SVGO

### Acceptance
- [ ] Шесть файлов лежат по указанным путям
- [ ] Каждый открывается в браузере и показывает чертёж

---

## T-041 — SchematicCover: компонент из готового SVG

**Depends on:** T-040, T-012
**Estimate:** 2ч
**Files:** создать `components/schematic/SchematicCover.tsx`

### Business
React-версия файла `cover-front.svg`. Отличие от файла ровно одно: значения подставляются из конфигурации.

**Три вещи меняются от выбора пользователя:**
1. Заливка `#cover-body` и чипа — цвет из `colors[color].hex`
2. Штриховка `#cover-hatch` — паттерн по типу кожи
3. Цвет пунктира шва — из `threads[thread].hex`

Плюс подписи: название цвета, название кожи, текст гравировки, имя файла.

### Code

```tsx
// components/schematic/SchematicCover.tsx
import type { Configuration, Angle } from '@/types/config';
import { leathers, colors, threads, angleSpecs, NOT_IN_FRAME } from '@/lib/data';
import { previewFilename } from '@/lib/assets';
import type { HatchPattern } from '@/content/leathers';

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

const hatchId: Record<HatchPattern, string> = {
  'diagonal-fine': 'hatch-fine',
  'diagonal-coarse': 'hatch-coarse',
  'cross-hatch': 'hatch-cross',
};

/** Shared hatch patterns. Rendered inside every schematic SVG. */
function HatchDefs({ scale = 1 }: { scale?: number }) {
  return (
    <defs>
      <pattern id="hatch-fine" width={4 * scale} height={4 * scale}
               patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2={4 * scale} stroke={INK}
              strokeWidth={0.5 * scale} opacity="0.35" />
      </pattern>
      <pattern id="hatch-coarse" width={9 * scale} height={9 * scale}
               patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2={9 * scale} stroke={INK}
              strokeWidth={1.4 * scale} opacity="0.4" />
      </pattern>
      <pattern id="hatch-cross" width={7 * scale} height={7 * scale} patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2={7 * scale} y2={7 * scale} stroke={INK}
              strokeWidth={0.7 * scale} opacity="0.32" />
        <line x1={7 * scale} y1="0" x2="0" y2={7 * scale} stroke={INK}
              strokeWidth={0.7 * scale} opacity="0.32" />
      </pattern>
    </defs>
  );
}

export default function SchematicCover({ config, angle, compact = false }: Props) {
  const leather = leathers[config.leather];
  const color = colors[config.color];
  const thread = threads[config.thread];
  const spec = angleSpecs[angle];
  const hatch = `url(#${hatchId[leather.schematicHatch]})`;
  const fill = color.hex;
  const stitch = thread.hex;
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

  return (
    <div className="w-full">
      {angle === 'front' && (
        <svg viewBox="0 0 400 500" className="block h-auto w-full" role="img"
             aria-label={`Technical drawing: ${leather.name} cover in ${color.name}, front view`}>
          <HatchDefs />
          <rect x="8" y="8" width="384" height="484" fill="none" stroke={LINE}
                strokeWidth="1" strokeDasharray="6 4" />
          <rect x="102" y="110" width="196" height="280" rx="6" fill={fill}
                stroke={INK} strokeWidth="1.5" />
          <rect x="102" y="110" width="196" height="280" rx="6" fill={hatch} />
          <line x1="128" y1="110" x2="128" y2="390" stroke={INK} strokeWidth="0.8"
                strokeDasharray="4 4" opacity="0.5" />
          <rect x="114" y="122" width="172" height="256" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.4" strokeDasharray="4 4" />
          {config.engraving && (
            <>
              <rect x="198" y="330" width="76" height="28" fill="none" stroke={MUTED}
                    strokeWidth="1" strokeDasharray="2 2" />
              <text x="236" y="349" textAnchor="middle" fontSize="11" fill={MUTED}
                    fontFamily={config.engraving.font === 'serif' ? 'Georgia, serif' : 'sans-serif'}>
                {config.engraving.text}
              </text>
            </>
          )}
          {labels}
          {!compact && (
            <>
              {spec.mustShow.slice(0, 3).map((item, i) => (
                <text key={item} x="20" y={416 + i * 13} fontSize="9.5" fill={MUTED}>
                  → must show: {item}
                </text>
              ))}
              <text x="20" y="470" fontSize="9.5" fontWeight="600" fill={ALERT}>{NOT_IN_FRAME}</text>
            </>
          )}
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
          {Array.from({ length: insertCount }).map((_, i) => (
            <rect key={i} x={212 + i * 6} y={64 + i * 4} width="112" height="156" rx="2"
                  fill={PAPER} stroke={INK} strokeWidth="0.9" />
          ))}
          <line x1="200" y1="46" x2="200" y2="238" stroke={stitch} strokeWidth="2.5" />
          <rect x="72" y="64" width="256" height="156" rx="3" fill="none"
                stroke={stitch} strokeWidth="1.3" strokeDasharray="4 4" />
          {labels}
          {!compact && (
            <>
              <text x="20" y="256" fontSize="9.5" fill={MUTED}>
                → must show: {spec.mustShow.join(' · ')}
              </text>
              <text x="20" y="278" fontSize="9.5" fontWeight="600" fill={ALERT}>{NOT_IN_FRAME}</text>
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
              <text x="20" y="228" fontSize="9.5" fill={MUTED}>stitch density</text>
              <text x="20" y="372" fontSize="9.5" fontWeight="600" fill={ALERT}>{NOT_IN_FRAME}</text>
            </>
          )}
          {labels}
        </svg>
      )}

      {!compact && (
        <p className="mt-2 text-center font-mono text-[11px] text-muted">
          {previewFilename(config.leather, config.color, angle)}
        </p>
      )}
    </div>
  );
}
```

### Do NOT
- ❌ Не менять координаты — они взяты из готовых SVG-файлов
- ❌ Не добавлять градиенты, тени, имитацию объёма
- ❌ Не рисовать шнур: он накладывается на фото программно, и плашка объясняет почему
- ❌ Не включать размер в имя файла

### Acceptance
- [ ] Смена цвета меняет заливку обложки и чип
- [ ] Смена кожи меняет штриховку
- [ ] Смена нити меняет цвет пунктира шва
- [ ] Все три ракурса рисуются
- [ ] В ракурсе `open` количество страниц равно сумме вкладышей, максимум 4
- [ ] Смена размера **не** меняет имя файла под чертежом
- [ ] При `compact` подписи и выноски скрыты

---

## T-042 — Проверка трёх ракурсов

**Depends on:** T-041
**Estimate:** 0.5ч
**Files:** изменений кода нет

### Steps

Создать временную страницу `app/dev/page.tsx`, отрисовать `SchematicCover` для всех трёх ракурсов и трёх типов кожи, глазами проверить чеклист ниже, затем **удалить страницу**.

### Acceptance
- [ ] Три штриховки визуально различимы
- [ ] Ракурс `detail` выходит за рамку кадра с двух сторон
- [ ] Ни один текст не наезжает на чертёж
- [ ] Файл `app/dev/page.tsx` удалён

---

## T-043 — Иллюстрации лендинга

**Depends on:** T-040
**Estimate:** 1ч
**Files:** создать `components/landing/Illustration.tsx`

### Business
На лендинге фотографий не будет вообще. Вместо них — три готовые SVG-иллюстрации из `public/illustrations/`.

### Code

```tsx
// components/landing/Illustration.tsx
import Image from 'next/image';
import clsx from 'clsx';

const sources = {
  hero: { src: '/illustrations/hero.svg', w: 600, h: 450, alt: 'A leather cover with paper inserts and an elastic cord' },
  stitch: { src: '/illustrations/stitch.svg', w: 400, h: 320, alt: 'How a hand saddle stitch locks against itself' },
  refill: { src: '/illustrations/refill.svg', w: 400, h: 300, alt: 'One cover, many paper refills' },
} as const;

export default function Illustration({
  name, className, priority = false,
}: {
  name: keyof typeof sources;
  className?: string;
  priority?: boolean;
}) {
  const s = sources[name];
  return (
    <Image
      src={s.src}
      alt={s.alt}
      width={s.w}
      height={s.h}
      priority={priority}
      className={clsx('h-auto w-full', className)}
    />
  );
}
```

### Do NOT
- ❌ Не искать и не добавлять фотографии, стоковые или чужие
- ❌ Не генерировать изображения

### Acceptance
- [ ] `<Illustration name="hero" priority />` отрисовывается
- [ ] Все три иллюстрации доступны
- [ ] Макет не сдвигается при загрузке

---

## T-044 — SizeDiagram

**Depends on:** T-011
**Estimate:** 2ч
**Files:** создать `components/schematic/SizeDiagram.tsx`

### Business
Заменяет фотографию для показа размера. Это ключевое решение проекта: **размер показывается схемой, а не фотографией**, поэтому одна фотография покрывает все четыре формата, и объём съёмки сокращается вчетверо.

Используется в двух местах: под превью в конструкторе и в секции размеров на лендинге.

### Code

```tsx
// components/schematic/SizeDiagram.tsx
import type { SizeCode } from '@/types/config';
import { sizes, sizeList } from '@/content/sizes';
import { formatDimensions } from '@/lib/format';

interface Props {
  /** Highlighted size */
  active: SizeCode;
  /** Show all four outlines for comparison (landing) or just the active one (configurator) */
  mode?: 'single' | 'compare';
}

const PHONE_MM: [number, number] = [70, 150];
const INK = '#1C1917';
const LINE = '#DED5C7';
const MUTED = '#8A7F72';

export default function SizeDiagram({ active, mode = 'single' }: Props) {
  const shown = mode === 'compare' ? sizeList : [sizes[active]];

  // Scale: fit the tallest object (phone or largest cover) into 200 units of height
  const maxMmH = Math.max(PHONE_MM[1], ...shown.map((s) => s.coverMm[1]));
  const scale = 200 / maxMmH;

  const gap = 12;
  const widths = shown.map((s) => s.coverMm[0] * scale);
  const phoneW = PHONE_MM[0] * scale;
  const totalW = widths.reduce((a, b) => a + b, 0) + phoneW + gap * shown.length;
  const vbH = 200 + 40;

  let cursor = 0;

  return (
    <svg
      viewBox={`0 0 ${Math.ceil(totalW)} ${vbH}`}
      className="block h-auto w-full"
      role="img"
      aria-label={
        mode === 'compare'
          ? 'Size comparison of all four notebook formats, drawn to scale next to a phone'
          : `Size diagram: ${sizes[active].name}, ${formatDimensions(sizes[active].coverMm)}`
      }
    >
      {shown.map((s) => {
        const w = s.coverMm[0] * scale;
        const h = s.coverMm[1] * scale;
        const x = cursor;
        const y = 200 - h;
        cursor += w + gap;
        const isActive = s.code === active;

        return (
          <g key={s.code}>
            <rect
              x={x} y={y} width={w} height={h} rx="3"
              fill="none"
              stroke={isActive ? INK : LINE}
              strokeWidth={isActive ? 1.6 : 1}
            />
            <text
              x={x + w / 2} y={218}
              textAnchor="middle" fontSize="9"
              fill={isActive ? INK : MUTED}
            >
              {s.name}
            </text>
            <text
              x={x + w / 2} y={230}
              textAnchor="middle" fontSize="8" fill={MUTED}
            >
              {formatDimensions(s.coverMm)}
            </text>
          </g>
        );
      })}

      {/* Phone silhouette for scale */}
      <g opacity="0.4">
        <rect
          x={cursor} y={200 - PHONE_MM[1] * scale}
          width={phoneW} height={PHONE_MM[1] * scale} rx="8"
          fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3"
        />
        <text x={cursor + phoneW / 2} y={218} textAnchor="middle" fontSize="9" fill={MUTED}>
          Phone
        </text>
      </g>
    </svg>
  );
}
```

### Acceptance
- [ ] В режиме `compare` видны четыре контура и телефон, все в одном масштабе
- [ ] Активный размер выделен более толстой линией
- [ ] Габариты подписаны в мм под каждым контуром
- [ ] Пропорции контуров соответствуют реальным `coverMm`

---

## T-045 — Preview

**Depends on:** T-041, T-044
**Estimate:** 2ч
**Files:** создать `components/configurator/Preview.tsx`

### Business
Обёртка вокруг чертежей: переключение трёх ракурсов миниатюрами, схема габаритов, поясняющая подпись. Компонент разветвляется по `ASSET_MODE`: сейчас рисует чертёж, после съёмки будет рисовать фотографию — и больше ничего в проекте менять не придётся.

### Code

```tsx
// components/configurator/Preview.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { Configuration, Angle } from '@/types/config';
import { angleList } from '@/content/shots';
import { copy } from '@/content/copy';
import { getPreview, SHOW_SCHEMATIC_NOTES } from '@/lib/assets';
import SchematicCover from '@/components/schematic/SchematicCover';
import SizeDiagram from '@/components/schematic/SizeDiagram';

export default function Preview({ config }: { config: Configuration }) {
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

      {/* Angle thumbnails */}
      <div className="flex gap-2" role="tablist" aria-label="Preview angle">
        {angleList.map((a) => (
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
            {a.name}
          </button>
        ))}
      </div>

      {SHOW_SCHEMATIC_NOTES && (
        <p className="text-xs leading-relaxed text-muted">{copy.configurator.schematicNote}</p>
      )}

      <div className="rounded-sm border border-line p-4">
        <SizeDiagram active={config.size} mode="single" />
        {SHOW_SCHEMATIC_NOTES && (
          <p className="mt-2 text-xs leading-relaxed text-muted">{copy.configurator.sizeNote}</p>
        )}
      </div>
    </div>
  );
}
```

### Do NOT
- ❌ Не добавлять спиннеры загрузки. Чертёж рисуется мгновенно, сетевых запросов нет
- ❌ Не убирать поясняющую подпись под чертежом — без неё мастер может принять схему за готовое изображение

### Acceptance
- [ ] Переключаются три ракурса
- [ ] Схема габаритов обновляется при смене размера
- [ ] Видны обе поясняющие подписи
- [ ] Макет не «прыгает» при переключении ракурсов

---

## Контрольная точка EPIC 2–3

- [ ] `npm run build` проходит
- [ ] Все компоненты в `components/ui/` и `components/schematic/` не импортируют ничего из `store/`
- [ ] Схема отрисовывается для всех 12 доступных комбинаций кожа×цвет
- [ ] Ни в одном компоненте нет захардкоженного `#hex`, кроме констант `INK`, `LINE`, `ALERT`, `MUTED` в схемах
