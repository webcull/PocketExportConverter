# PocketExportConverter

⚠️ This is a work in progress and is not yet ready for production use.

This tool will eventually offer a complete and accurate Pocket export conversion. For now, you can open the CSV file in a spreadsheet editor and export it manually as an HTML file for importing into a browser or another bookmark manager. Alternatively, you can [import the CSV file directly into WebCull](https://webcull.com), which supports raw CSV import. However, these methods will not preserve metadata, or folder structures from the original Pocket export. This tool is being built to solve this problem.

⚠️ Don't bother continue reading, this tools is under active development and is not yet ready for production use.


This is a simple tool to convert the Pocket export JSON file to a standard HTML bookmarks file.

## Usage

Serve locally using the port of your choice:

```bash
npx http-server ./dist -p 3026
```

## Installation Instructions

```bash
npm install
npx webpack
```

## Attribution

This project was created and is maintained by [WebCull](https://webcull.com), a privacy-first bookmark manager. It was developed as a free tool to help users convert their Pocket exports into a standard HTML bookmarks file.

This project is not affiliated with or endorsed by Mozilla or Pocket.