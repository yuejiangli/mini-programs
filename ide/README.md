# IDE Binary Distribution

The Windows executable `TCSAS-Devtools_x64_2.2.1211_202509021611.exe` is large (~168MB) and is intentionally **not stored in the git repository** to avoid bloating clone size.

## Recommended Distribution Method
Use **GitHub Releases** and attach the `.exe` as a release asset.

### Steps (Web UI)
1. Go to the repository page: https://github.com/yuejiangli/mini-programs
2. Click "Releases" > "Draft a new release".
3. Tag version: e.g. `ide-v2.2.1211` (create new tag).
4. Release title: `TCSAS Devtools 2.2.1211`.
5. Description: brief changelog (what changed in this build).
6. Drag & drop the `TCSAS-Devtools_x64_2.2.1211_202509021611.exe` file to the assets area.
7. Publish release.

After publishing, users can download directly from the release asset URL (GitHub will serve it with proper headers and good CDN caching).

### Steps (CLI)
If you have `gh` (GitHub CLI) installed and authenticated:
```bash
# Set variables
TAG="ide-v2.2.1211"
NAME="TCSAS Devtools 2.2.1211"
FILE="ide/TCSAS-Devtools_x64_2.2.1211_202509021611.exe"
DESC="Initial public release of TCSAS Devtools 2.2.1211"

# Create release and upload asset
gh release create "$TAG" "$FILE" \
  --repo yuejiangli/mini-programs \
  --title "$NAME" \
  --notes "$DESC"
```

## Why Not Commit the Binary?
- Git history becomes permanently large (every clone pays the cost).
- Harder to diff / review.
- Better separation of code vs. build artifacts.

## Alternative: Git LFS (Not Recommended Here)
You could enable Git LFS for `*.exe`, but:
- Requires contributors to install LFS.
- Still increases clone/pull time (though pointer files help a bit).
- Releases are simpler for end-users.

## Updating Future Versions
1. Replace the old `.exe` locally (keep previous versions outside the repo or in a build artifacts folder ignored by git).
2. Draft a new release with incremented tag, e.g. `ide-v2.2.1300`.
3. Upload new asset & changelog.
4. Optionally link the latest release in main `README.md`.

## Linking From Main README
Add a section:
```markdown
### TCSAS Devtools Download
Latest Windows build: [Download here](https://github.com/yuejiangli/mini-programs/releases)
```

## Integrity / Verification (Optional)
You can publish hashes:
```bash
sha256sum ide/TCSAS-Devtools_x64_2.2.1211_202509021611.exe > ide/TCSAS-Devtools_x64_2.2.1211_202509021611.exe.sha256
```
Then attach the `.sha256` file to the release too.

---
If you need automation (CI pipeline) later, we can add a GitHub Action to draft releases and upload artifacts automatically.

## Automation

### Local Script (Node.js)
You can use the provided helper script to (create if missing and) upload assets:
```bash
export GITHUB_TOKEN=YOUR_TOKEN  # repo scope
node scripts/upload-ide-release.js \
  --tag ide-v2.2.1211 \
  --file ide/TCSAS-Devtools_x64_2.2.1211_202509021611.exe \
  --checksum ide/TCSAS-Devtools_x64_2.2.1211_202509021611.exe.sha256 \
  --repo yuejiangli/mini-programs
```

If the release for the tag does not exist, a draft will be created.

### GitHub Action (Manual Dispatch)
Navigate to Actions > Upload IDE Binary > Run workflow, fill inputs and run. This uses `.github/workflows/release-ide.yml`.

### GitHub Action (Automatic Tag Push)
Push a tag matching `ide-v*`:
```bash
git tag ide-v2.2.1211
git push origin ide-v2.2.1211
```
The workflow will attempt to attach the binary & checksum.
