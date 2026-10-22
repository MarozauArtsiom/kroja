// components/schematic/SchematicCover.tsx
'use client';

import type { Configuration, Angle } from '@/types/config';
import { useI18n } from '@/components/i18n/I18nProvider';
import { schematicParts } from './schematic-parts';
import FrontView from './views/FrontView';
import BackView from './views/BackView';
import OpenView from './views/OpenView';
import DetailView from './views/DetailView';

interface Props {
  config: Configuration;
  angle: Angle;
  /** Small thumbnail: hide callouts and labels */
  compact?: boolean;
}

const views = {
  front: FrontView,
  back: BackView,
  open: OpenView,
  detail: DetailView,
} as const;

export default function SchematicCover({ config, angle, compact = false }: Props) {
  const { dict } = useI18n();
  const View = views[angle];
  const parts = schematicParts(config, dict);

  return (
    <div className="w-full">
      <View config={config} compact={compact} parts={parts} dict={dict} />
    </div>
  );
}
