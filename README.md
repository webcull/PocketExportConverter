# PocketExportConverter

This is a simple tool to convert the Pocket export ZIP file to a standard HTML bookmarks file while preserving the original folder structure.

## Try it Online

Use the web-based version of the tool (no installation needed):
https://webcull.com/free-tools/pocket-export-to-bookmarks-html-import-file

## Installation Instructions

```bash
npm install
npx webpack
```

## Usage Example

Run the CLI directly with Node:

```bash
node ./src/cli.js [format] [inputPath]
node ./src/cli.js csv ./path/to/file.zip
node ./src/cli.js html ./path/to/file.zip
node ./src/cli.js json ./path/to/file.zip
node ./src/cli.js [format] [inputPath] [outputPath]
node ./src/cli.js json ./path/to/input.zip ./path/to/output.json
```

Or server locally using the default port or your custom port:

```bash
npx http-server ./dist -p 3026
```

Or use the bash script:

```bash
node serve-locally.js            # uses port 3026
node serve-locally.js 8080       # uses port 8080
```

and then load it locally from a locally hosted page:

```
...
<script src="http://127.0.0.1:3026/bundle.js"></script>
...

// File must be a File object from a file input element event. Get that from a file input
// element event.

const html = await PocketConverter.convert(file); // assuming your tool exposes a convert method
const blob = new Blob([html], { type: 'text/html' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'bookmarks.html';
a.click();
```

Or incorporate it into your own tool, but don't just directly make money off of it without concent.

## Attribution

This project was created and is maintained by [WebCull](https://webcull.com), a privacy-first bookmark manager. It was developed as a free tool to help users convert their Pocket exports into a standard HTML bookmarks file.

This project is not affiliated with or endorsed by Mozilla or Pocket.

## License

This project is licensed under the [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) license.

Commercial use is prohibited without explicit permission.

---

## Feedback

Your feedback, contributions, and support help improve this tool.  
Suggestions and pull requests are always welcome.

If you'd like to support development, you can make a donation here:  
[Donate via PayPal](https://www.paypal.com/donate/?hosted_button_id=QMRGKTEZZYQCN)