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
