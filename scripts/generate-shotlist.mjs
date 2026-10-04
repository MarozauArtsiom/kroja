// scripts/generate-shotlist.mjs
import { writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.resolve(rootDir, '.tmp-shotlist');

console.log('Generating shotlist.md …');

try {
  try {
    rmSync(outDir, { recursive: true, force: true });
  } catch {}

  execSync('npx tsc -p tsconfig.shotlist.json', { cwd: rootDir, stdio: 'inherit' });

  // Fix alias paths in compiled files (.tmp-shotlist/lib and .tmp-shotlist/content)
  function fixAliases(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        fixAliases(fullPath);
      } else if (entry.name.endsWith('.js')) {
        let content = readFileSync(fullPath, 'utf8');
        content = content.replace(/from\s+['"]@\/([^'"]+)['"]/g, (_match, target) => {
          const fileDir = path.dirname(fullPath);
          const targetPath = path.join(outDir, target);
          let rel = path.relative(fileDir, targetPath).replace(/\\/g, '/');
          if (!rel.startsWith('.')) {
            rel = './' + rel;
          }
          return `from '${rel}.js'`;
        });
        // Relative imports ('./pricing') need the extension too: Node ESM does not guess it.
        content = content.replace(/from\s+['"](\.\.?\/[^'"]+)['"]/g, (match, target) =>
          target.endsWith('.js') ? match : `from '${target}.js'`,
        );
        writeFileSync(fullPath, content, 'utf8');
      }
    }
  }

  fixAliases(outDir);

  const shotlistModule = await import(`file://${outDir}/lib/shotlist.js`);
  const enModule = await import(`file://${outDir}/content/i18n/dict/en.js`);
  const md = shotlistModule.toMarkdown(enModule.en);
  writeFileSync(path.resolve(rootDir, 'shotlist.md'), md, 'utf8');
  console.log('Done: shotlist.md generated successfully.');
} catch (err) {
  console.error('Error generating shotlist:', err);
  process.exit(1);
} finally {
  try {
    rmSync(outDir, { recursive: true, force: true });
  } catch {}
}
