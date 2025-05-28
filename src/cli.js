import { convert } from './index.js';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';

const SUPPORTED_FORMATS = ['csv', 'html', 'json'];

global.File = class File {
	constructor(parts, name, options = {}) {
		this.buffer = Buffer.concat(parts);
		this.name = name;
		this.type = options.type || '';
		this.lastModified = options.lastModified || Date.now();
	}
};

const [format, inputPath, outputPathArg] = process.argv.slice(2);

if (!format || !inputPath || !SUPPORTED_FORMATS.includes(format.toLowerCase())) {
	console.error('Usage: node ./src/cli.js <csv|html|json> <input-zip> [output-file]');
	process.exit(1);
}

const outputFormat = format.toLowerCase();

(async () => {
	try {
		const buffer = await readFile(inputPath);
		const file = new File([buffer], path.basename(inputPath));

		const { bookmarks, html } = await convert(file);

		let outputData;
		if (outputFormat === 'html') {
			outputData = html;
		} else if (outputFormat === 'csv') {
			const header = ['title', 'url', 'time_added', 'tags', 'folder'];
			const rows = bookmarks.map(bm =>
				[ bm.title, bm.url, bm.time_added, bm.tags.join('|'), bm.folder ].map(field =>
					typeof field === 'string' ? `"${field.replace(/"/g, '""')}"` : ''
				).join(',')
			);
			outputData = [header.join(','), ...rows].join('\n');
		} else if (outputFormat === 'json') {
			outputData = JSON.stringify(bookmarks, null, 2);
		}

		const finalOutputPath = outputPathArg
			|| inputPath.replace(/\.zip$/i, `.${outputFormat}`);

		await writeFile(finalOutputPath, outputData, 'utf-8');
		console.log(`✅ Saved output to: ${finalOutputPath}`);
	} catch (err) {
		console.error('❌ Error:', err.message);
		process.exit(1);
	}
})();