#!/usr/bin/env node
// Fetch a web page, download images, and convert the main content to Markdown.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import slugify from 'slugify';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

function guessExtFromContentTypeOrUrl(contentType, urlPath) {
  if (contentType) {
    const ct = contentType.split(';')[0].trim();
    if (ct === 'image/webp') return '.webp';
    if (ct === 'image/png') return '.png';
    if (ct === 'image/jpeg') return '.jpg';
    if (ct === 'image/jpg') return '.jpg';
    if (ct === 'image/gif') return '.gif';
    if (ct === 'image/svg+xml') return '.svg';
  }
  const m = /\.([a-zA-Z0-9]{1,6})(?:[?#].*)?$/.exec(urlPath);
  return m ? `.${m[1]}` : '.bin';
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.6',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return await res.text();
}

function absolutizeUrl(base, relative) {
  try {
    return new URL(relative, base).toString();
  } catch {
    return relative;
  }
}

async function downloadImage(src, baseUrl, assetsDir, namePrefix) {
  if (!src) return null;
  if (src.startsWith('data:')) {
    try {
      const [header, b64] = src.split(',', 1)[0] ? src.split(',') : [null, null];
      const ct = header?.split(';')[0].split(':')[1] || '';
      const buf = Buffer.from(src.slice(src.indexOf(',') + 1), 'base64');
      const ext = guessExtFromContentTypeOrUrl(ct, '');
      const h = sha1(buf).slice(0, 10);
      const filename = `${namePrefix}-${h}${ext}`;
      const outPath = path.join(assetsDir, filename);
      if (!fs.existsSync(outPath)) fs.writeFileSync(outPath, buf);
      return outPath;
    } catch {
      return null;
    }
  }
  const absUrl = absolutizeUrl(baseUrl, src);
  try {
    const res = await fetch(absUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = guessExtFromContentTypeOrUrl(ct, absUrl);
    const h = sha1(buf).slice(0, 10);
    const filename = `${namePrefix}-${h}${ext}`;
    const outPath = path.join(assetsDir, filename);
    if (!fs.existsSync(outPath)) fs.writeFileSync(outPath, buf);
    return outPath;
  } catch {
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: fetch_to_md.mjs <url> [--out <path>] [--assets-dir <dir>] [--title-level <n>]');
    process.exit(1);
  }
  const url = args[0];
  const getArg = (name, def) => {
    const i = args.indexOf(name);
    return i !== -1 && args[i + 1] ? args[i + 1] : def;
  };
  const outPath = getArg('--out', path.join(__dirname, '../docs/officialdocs/getting-started.md'));
  const assetsDir = getArg('--assets-dir', path.join(__dirname, '../docs/officialdocs/assets'));
  const titleLevel = parseInt(getArg('--title-level', '1'), 10) || 1;

  ensureDir(path.dirname(outPath));
  ensureDir(assetsDir);

  const html = await fetchHtml(url);
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  const title = article?.title || dom.window.document.title || 'document';

  const articleDom = new JSDOM(article?.content || '', { url });
  const doc = articleDom.window.document;

  // Remove unwanted tags
  doc.querySelectorAll('script, style, noscript').forEach((el) => el.remove());

  // Absolutize links
  doc.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('href', absolutizeUrl(url, a.getAttribute('href')));
  });

  // Process images: download and rewrite src to local relative path
  const pageSlug = slugify(title, { lower: true, strict: true }) || 'document';
  const assetsAbs = path.resolve(assetsDir);
  const mdDir = path.dirname(path.resolve(outPath));

  for (const img of Array.from(doc.images)) {
    const alt = img.getAttribute('alt') || '';
    const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy-src') || img.getAttribute('data-actualsrc');
    if (!src) { img.remove(); continue; }
    const namePrefix = (alt ? slugify(alt, { lower: true, strict: true }) : pageSlug) || pageSlug;
    const localPath = await downloadImage(src, url, assetsAbs, namePrefix);
    if (localPath) {
      const rel = path.relative(mdDir, localPath).split(path.sep).join('/');
      img.setAttribute('src', rel);
    } else {
      // If failed, keep absolute URL
      img.setAttribute('src', absolutizeUrl(url, src));
    }
  }

  // Convert to Markdown using Turndown with GFM
  const turndownService = new TurndownService({ codeBlockStyle: 'fenced', headingStyle: 'atx', hr: '---' });
  turndownService.use(gfm);

  // Preserve line breaks better
  turndownService.addRule('preserveBr', {
    filter: 'br',
    replacement: () => '  \n',
  });

  const bodyHtml = doc.body.innerHTML;
  let md = turndownService.turndown(bodyHtml).trim();
  md = md.replace(/\n{3,}/g, '\n\n');

  const top = '#'.repeat(Math.max(1, Math.min(titleLevel, 6)));
  const finalMd = `${top} ${title}\n\n${md}\n`;
  fs.writeFileSync(outPath, finalMd, 'utf-8');
  console.log(`[OK] Markdown saved to: ${outPath}`);
  console.log(`[OK] Assets saved under: ${assetsAbs}`);
}

main().catch((e) => {
  console.error('[ERROR]', e.message);
  process.exit(1);
});
