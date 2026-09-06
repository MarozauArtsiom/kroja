// components/landing/Illustration.tsx
'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useI18n } from '@/components/i18n/I18nProvider';

const sources = {
  hero: { src: '/illustrations/hero.svg', w: 600, h: 450 },
  stitch: { src: '/illustrations/stitch.svg', w: 400, h: 320 },
  refill: { src: '/illustrations/refill.svg', w: 400, h: 300 },
} as const;

export default function Illustration({
  name, className, priority = false,
 }: {
  name: keyof typeof sources;
  className?: string;
  priority?: boolean;
}) {
  const { dict } = useI18n();
  const s = sources[name];
  return (
    <Image
      src={s.src}
      alt={dict.illustrations[name]}
      width={s.w}
      height={s.h}
      priority={priority}
      className={clsx('h-auto w-full', className)}
    />
  );
}
