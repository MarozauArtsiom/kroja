// components/shotlist/StorySlots.tsx
import { storyShots } from '@/lib/shotlist';
import PhotoSlot from '@/components/ui/PhotoSlot';

export default function StorySlots() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {storyShots.map((shot) => (
        <div
          key={shot.id}
          data-shot-card
          className="flex flex-col justify-between rounded-sm border border-line bg-paper p-4"
        >
          <PhotoSlot
            id={shot.id}
            ratio={shot.ratio}
            subject={shot.subject}
            requirement={shot.requirement}
            why={shot.why}
            className="mb-4"
          />

          <div className="flex items-center justify-between border-t border-line pt-3">
            <span className="font-mono text-xs text-muted">Shot #{shot.index}</span>
            <div
              data-shot-checkbox
              className="h-4 w-4 rounded-sm border border-ink"
              aria-hidden="true"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
