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
