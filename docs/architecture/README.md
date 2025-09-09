# TCSAS Architecture Assets

This folder hosts architecture diagrams and related assets for TCSAS documentation.

Recommended practices:

- Location: store images under this folder (e.g., `tcsas-architecture-ja.png`, `tcsas-architecture-en.png`).
- Formats: PNG or SVG preferred. Use SVG for scalability; use PNG when embedding in Markdown renderers with limited SVG support.
- Source files: keep editable sources (e.g., draw.io `.drawio`, Figma export `.svg`) in a `source/` subfolder, or link to the canonical design file in this README.
- Naming: `<topic>-<locale>.<ext>` (e.g., `tcsas-architecture-ja.png`).
- Size: target width 1200–1600px for PNG; keep under ~1 MB when possible.
- Versioning: if diagrams change with product versions, include a suffix like `-v1`, `-2025-01`.
- Hosting alternatives: if binary size is a concern, consider Git LFS or GitHub Releases assets. Avoid third-party CDNs unless necessary.

Example placeholder path referenced by README.ja.md:

- `docs/architecture/tcsas-architecture-ja.png`

