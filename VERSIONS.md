# Pocket Export Converter – Version History

This document outlines the development progress and version changes of the Pocket Export Converter tool. Each version tracks meaningful changes, including new features, improvements, bug fixes, and compatibility enhancements.

---

## v1.0.0 (2025-05-28 10:45 AM)

**Improved CLI with Flexible Output Options**

- ✅ Extracted CLI logic into `cli.js` to separate interface concerns from conversion logic.
- ✅ Added support for three output formats: `csv`, `html`, and `json` in the CLI.
- ✅ CLI now accepts output type, input path, and optional output path: `node ./src/cli.js [format] [inputPath] [outputPath]`.
- ✅ Automatically derives output path if none is provided, matching input filename with new extension.
- ✅ Outputs CSV with properly quoted and pipe-delimited tag fields.
- ✅ Improved error messages and usage guidance in CLI entry point.
- ✅ Added simplify bookmarks step to unify and normalize fields (resolving title/title2, url/url2, and flattening tag arrays).

## v0.1.0 (2025-05-26 11:38 AM)

**Initial CLI and Web Dual Support**

- ✅ Added core `convert(file)` function for shared use across Node.js and browser environments.
- ✅ Introduced CLI execution mode via `node ./src/index.js <path-to-zip>`.
- ✅ Integrated `fflate` for ZIP decompression with a unified buffer-based interface.
- ✅ Polyfilled `File` object in Node.js for cross-compatibility.
- ✅ Created global `IS_CLI` flag to distinguish runtime environment.

---

## Planned

### v0.2.0 (Upcoming)

- [ ] Parse and reconstruct original Pocket folder structure using `collections/*.json`.
- [ ] Reassociate metadata from `part_*.csv` with collections JSON entries.
- [ ] Support HTML bookmark export format compatible with major browsers.
- [ ] Add web UI drag-and-drop file upload.
- [ ] CLI flag for specifying output HTML path (e.g., `--out bookmarks.html`).

---

## Feedback

Your feedback, contributions, and support help improve this tool.  
Suggestions and pull requests are always welcome.

If you'd like to support development, you can make a donation here:  
[Donate via PayPal](https://www.paypal.com/donate/?hosted_button_id=QMRGKTEZZYQCN)