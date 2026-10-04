// scripts/check-i18n.mjs
// Finds two kinds of i18n gaps and prints them as a to-do list:
//   A. keys that exist in every dictionary but are never read by the code (dead translations)
//   B. human-readable English literals in code that never went through the dictionary
//
// Run:  npm run i18n
// Exit code 1 when anything is found, so it can gate a build.
//
// A string that is genuinely not user-facing (a font stack, a file name, a CSS value)
// goes into scripts/i18n-allowlist.json with a one-line reason. Nothing else is silenced.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const allowlistPath = path.join(rootDir, 'scripts/i18n-allowlist.json');
const allow = existsSync(allowlistPath)
  ? JSON.parse(readFileSync(allowlistPath, 'utf8'))
  : { strings: [], files: [] };
const allowStrings = new Set(allow.strings ?? []);
const allowFiles = allow.files ?? [];

/* ------------------------------------------------------------------ files */

const SCAN_DIRS = ['components', 'app', 'lib', 'content', 'store'];
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'i18n']);

function collect(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full, acc);
    else if (/\.(ts|tsx)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const files = SCAN_DIRS.flatMap((d) => collect(path.join(rootDir, d)))
  .map((f) => path.relative(rootDir, f))
  .filter((f) => f !== 'types/i18n.ts' && !allowFiles.some((a) => f.startsWith(a)));

/* --------------------------------------------------- A. unused dictionary keys */

function dictionaryLeaves() {
  const src = readFileSync(path.join(rootDir, 'types/i18n.ts'), 'utf8').split('\n');
  const start = src.findIndex((l) => l.includes('export interface Dictionary'));
  if (start === -1) return [];
  const stack = [];
  const leaves = [];
  for (let i = start + 1; i < src.length; i++) {
    const t = src[i].trim();
    if (/^\}[;,]?$/.test(t)) {
      if (stack.length === 0) break;
      stack.pop();
      continue;
    }
    let m = t.match(/^'?([A-Za-z0-9_-]+)'?\??:\s*\{$/);
    if (m) {
      stack.push(m[1]);
      continue;
    }
    m = t.match(/^'?([A-Za-z0-9_-]+)'?\??:\s*[^{].*[;,]$/);
    if (m) leaves.push([...stack, m[1]].join('.'));
  }
  return leaves;
}

const allSource = files.map((f) => readFileSync(path.join(rootDir, f), 'utf8')).join('\n');

const unusedKeys = dictionaryLeaves().filter((leaf) => {
  const parts = leaf.split('.');
  // A key counts as used if it, or any of its ancestors, is referenced as dict.<path>
  for (let k = parts.length; k >= 1; k--) {
    if (allSource.includes('dict.' + parts.slice(0, k).join('.'))) return false;
  }
  return true;
});

/* ------------------------------------------- B. hardcoded human-readable strings */

/** Attributes whose value a person reads or a screen reader announces. */
const TEXT_ATTRS = ['aria-label', 'aria-description', 'alt', 'placeholder', 'title', 'label'];

/** Looks like a sentence a human reads, not an identifier or a CSS value. */
function looksHuman(s) {
  const v = s.trim();
  if (v.length < 4) return false;
  if (allowStrings.has(v)) return false;
  if (!/[A-Za-z]/.test(v)) return false;
  if (/^[\d\s.,×/–-]+$/.test(v)) return false;
  if (/^[#$@/.]|^https?:|\.(svg|png|jpg|webp|css|ts|tsx|md|csv|json)$/i.test(v)) return false;
  if (/^[a-z0-9_-]+$/.test(v)) return false; // single lowercase token: a code
  if (/^[A-Za-z0-9_]+$/.test(v) && !/[A-Z][a-z]/.test(v)) return false; // SCREAMING_CASE
  if (/(^|\s)(px|rem|em|vh|vw|grid-|flex|text-|bg-|border-|rounded-|hover:|md:|lg:)/.test(v)) return false;
  if (/^(calc|env|var|url|rgba?|linear-gradient|repeating-linear-gradient)\(/.test(v)) return false;
  // needs at least two words, or one capitalised word of 4+ letters
  return /\s/.test(v) || /^[A-Z][a-z]{3,}$/.test(v);
}

const hardcoded = [];

for (const file of files) {
  const lines = readFileSync(path.join(rootDir, file), 'utf8').split('\n');
  let inBlockComment = false;

  lines.forEach((raw, idx) => {
    const line = raw;
    const trimmed = line.trim();

    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      return;
    }
    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inBlockComment = true;
      return;
    }
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    if (trimmed.startsWith('import ') || trimmed.startsWith('export {')) return;
    if (/^['"]use (client|server)['"];?$/.test(trimmed)) return; // React directive, not copy

    const report = (text, kind) => {
      if (!looksHuman(text)) return;
      hardcoded.push({ file, line: idx + 1, kind, text: text.trim() });
    };

    // 1. readable attributes. The lookbehind keeps `label=` from also matching `aria-label=`.
    const seenAttr = new Set();
    for (const attr of TEXT_ATTRS) {
      const re = new RegExp(`(?<![\\w-])${attr}=(["'])([^"']+)\\1`, 'g');
      let m;
      while ((m = re.exec(line))) {
        if (seenAttr.has(m.index)) continue;
        seenAttr.add(m.index);
        report(m[2], attr);
      }
    }

    // 2. JSX text nodes: >Some words<. Only .tsx can hold JSX; in .ts an arrow `=>`
    //    followed by a `<` comparison would otherwise look like a text node.
    const textNode = file.endsWith('.tsx') ? line.match(/>\s*([^<>{}\n][^<>{}]*?)\s*</g) : null;
    if (textNode) {
      for (const t of textNode) report(t.slice(1, -1), 'jsx-text');
    }

    // 3. quoted strings and template literals in data and logic files
    if (/^(lib|content|store)\//.test(file) || /\.(push|join)\(|:\s*['"`]/.test(line)) {
      const quoted = line.match(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g) ?? [];
      for (const q of quoted) {
        const text = q.slice(1, -1);
        if (text.includes('${')) {
          // template literal: check the plain-text parts only
          for (const part of text.split(/\$\{[^}]*\}/)) report(part, 'template');
        } else {
          report(text, 'string');
        }
      }
    }
  });
}

/* ---------------------------------------------------------------- reporting */

const byFile = new Map();
for (const h of hardcoded) {
  if (!byFile.has(h.file)) byFile.set(h.file, []);
  byFile.get(h.file).push(h);
}

console.log('\n=== A. Переводы есть, код их не использует ===\n');
if (unusedKeys.length === 0) {
  console.log('  нет\n');
} else {
  for (const k of unusedKeys) console.log(`  dict.${k}`);
  console.log('');
}

console.log('=== B. Текст в коде мимо словаря ===\n');
if (byFile.size === 0) {
  console.log('  нет\n');
} else {
  for (const [file, items] of [...byFile].sort()) {
    console.log(`  ${file}`);
    for (const i of items) console.log(`    ${String(i.line).padStart(4)}  [${i.kind}]  ${i.text}`);
    console.log('');
  }
}

const total = unusedKeys.length + hardcoded.length;
console.log(
  `Итого: ${unusedKeys.length} неиспользованных ключей, ${hardcoded.length} строк мимо словаря.\n`,
);

process.exit(total === 0 ? 0 : 1);
