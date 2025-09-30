#!/usr/bin/env node
/**
 * Upload IDE binary + checksum to a GitHub Release.
 *
 * Usage:
 *   GITHUB_TOKEN=xxxxx node scripts/upload-ide-release.js \
 *     --tag ide-v2.2.1211 \
 *     --file ide/TCSAS-Devtools_x64_2.2.1211_202509021611.exe \
 *     --checksum ide/TCSAS-Devtools_x64_2.2.1211_202509021611.exe.sha256 \
 *     --repo yuejiangli/mini-programs
 *
 * If the release (tag) does not exist, it will be created as a draft.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const val = args[i + 1];
      opts[key] = val;
      i++;
    }
  }
  return opts;
}

async function requestJson(method, url, token, body) {
  const { hostname, pathname, search } = new URL(url);
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      path: pathname + (search || ''),
      method,
      headers: {
        'User-Agent': 'ide-release-uploader',
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch { resolve({ raw: data }); }
        } else {
          reject(new Error(`Request ${method} ${url} failed: ${res.statusCode} ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function uploadAsset(uploadUrlTemplate, filePath, token) {
  const fileName = path.basename(filePath);
  // upload_url includes a template: { ?name,label }
  const base = uploadUrlTemplate.split('{')[0];
  const url = new URL(base + `?name=${encodeURIComponent(fileName)}`);
  const stat = fs.statSync(filePath);
  const fileBuf = fs.readFileSync(filePath);
  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'User-Agent': 'ide-release-uploader',
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size
      }
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch { resolve({ raw: data }); }
        } else {
          reject(new Error(`Upload asset failed: ${res.statusCode} ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(fileBuf);
    req.end();
  });
}

(async () => {
  const { tag, file, checksum, repo } = parseArgs();
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN env not set');
    process.exit(1);
  }
  if (!tag || !file || !repo) {
    console.error('--tag, --file, --repo are required');
    process.exit(1);
  }
  if (!fs.existsSync(file)) {
    console.error('File not found:', file);
    process.exit(1);
  }
  if (checksum && !fs.existsSync(checksum)) {
    console.error('Checksum file not found:', checksum);
    process.exit(1);
  }

  const [owner, name] = repo.split('/');
  const apiBase = `https://api.github.com/repos/${owner}/${name}`;

  let release;
  // Try to get release by tag
  try {
    release = await requestJson('GET', `${apiBase}/releases/tags/${tag}`, token);
    console.log('Found existing release:', release.id);
  } catch (e) {
    console.log('Release not found, creating draft...', e.message);
    release = await requestJson('POST', `${apiBase}/releases`, token, {
      tag_name: tag,
      name: tag,
      body: 'Automated draft release for IDE binary upload.',
      draft: true,
      prerelease: false
    });
    console.log('Created draft release:', release.id);
  }

  // Check if asset already exists
  const existing = (release.assets || []).map(a => a.name);
  const toUpload = [file, checksum].filter(Boolean).filter(f => !existing.includes(path.basename(f)));
  if (toUpload.length === 0) {
    console.log('No new assets to upload. Existing assets:', existing);
    process.exit(0);
  }

  for (const asset of toUpload) {
    console.log('Uploading asset:', asset);
    await uploadAsset(release.upload_url, asset, token);
    console.log('Uploaded:', path.basename(asset));
  }

  console.log('Done. Visit release page to publish if still draft.');
})();
