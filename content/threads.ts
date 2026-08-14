// content/threads.ts
import type { ThreadCode } from '@/types/config';

export interface ThreadDef {
  code: ThreadCode;
  name: string;
  /** Used for the dashed stitch line on the schematic */
  hex: string;
  description: string;
  order: number;
}

export const threads: Record<ThreadCode, ThreadDef> = {
  natural:  { code: 'natural',  name: 'Natural linen', hex: '#C9B79A', description: 'Undyed linen thread', order: 1 },
  tonal:    { code: 'tonal',    name: 'Tonal',         hex: '#6B4A33', description: 'Matches the leather', order: 2 },
  contrast: { code: 'contrast', name: 'Contrast',      hex: '#2A3345', description: 'Deliberately visible stitching', order: 3 },
};

export const threadList: ThreadDef[] = Object.values(threads).sort((a, b) => a.order - b.order);

export const DEFAULT_THREAD: ThreadCode = 'natural';
