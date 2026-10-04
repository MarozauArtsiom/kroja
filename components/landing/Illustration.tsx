// components/landing/Illustration.tsx
'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useI18n } from '@/components/i18n/I18nProvider';
import StitchIllustration from './illustrations/StitchIllustration';
import RefillIllustration from './illustrations/RefillIllustration';

type Name = 'hero' | 'stitch' | 'refill';

/**
 * The hero has no text in it, so it stays a plain image. The other two carry captions
 * that must follow the page language, so they are drawn inline from the dictionary.
 */
export default function Illustration({
  name, className, priority = false,
}: {
  name: Name;
  className?: string;
  priority?: boolean;
}) {
  const { dict } = useI18n();
  const classes = clsx('h-auto w-full', className);

  if (name === 'stitch') return <StitchIllustration className={classes} />;
  if (name === 'refill') return <RefillIllustration className={classes} />;

  return (
    <Image
      src="/illustrations/hero.svg"
      alt={dict.illustrations.hero}
      width={600}
      height={450}
      priority={priority}
      className={classes}
    />
  );
}
