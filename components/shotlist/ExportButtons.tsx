// components/shotlist/ExportButtons.tsx
'use client';

import { copy } from '@/content/copy';
import { toMarkdown, toCsv } from '@/lib/shotlist';
import Button from '@/components/ui/Button';

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => window.print()}>
        {copy.shotlist.print}
      </Button>
      <Button
        variant="secondary"
        onClick={() => download('shotlist.md', toMarkdown(), 'text/markdown')}
      >
        {copy.shotlist.exportMd}
      </Button>
      <Button
        variant="secondary"
        onClick={() => download('shotlist.csv', toCsv(), 'text/csv')}
      >
        {copy.shotlist.exportCsv}
      </Button>
    </div>
  );
}
