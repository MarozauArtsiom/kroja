// components/configurator/usePreviewAngle.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Angle, Configuration } from '@/types/config';
import { serialisePockets } from '@/lib/pockets';

/** Everything that is only visible on the open spread. A change here switches the view to it. */
function insideKey(config: Configuration): string {
  const inserts = config.inserts.reduce((sum, i) => sum + i.qty, 0);
  return `${serialisePockets(config.pockets)}#${config.penHolder}#${inserts}`;
}

/**
 * The preview angle, shared by the desktop preview, the mobile preview and the option sections.
 * Pockets, the pen loop and the inserts live inside the cover: changing them shows the spread (D-19).
 */
export function usePreviewAngle(config: Configuration) {
  const [angle, setAngle] = useState<Angle>('front');
  const inside = insideKey(config);
  const lastInside = useRef(inside);

  useEffect(() => {
    if (lastInside.current !== inside) {
      lastInside.current = inside;
      setAngle('open');
    }
  }, [inside]);

  return { angle, setAngle };
}
