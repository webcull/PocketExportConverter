import { unzipSync, strFromU8 } from 'fflate';
import { CsvParser } from './services/CsvParser.js';

export async function convert(file) {
	let buffer;

	if (typeof window !== 'undefined' && typeof alert === 'function') {
		buffer = await file.arrayBuffer();
	} else if (file.buffer) {
		buffer = file.buffer;
	} else {
		throw new Error('Unsupported file type');
	}

	const zip = unzipFileBuffer(new Uint8Array(buffer));
	const parts = getAllParts(zip);
	const { rows: bookmarks, errors } = parseAllCSVs(parts);
	const collections = extractJSONFiles(zip);
	const merged = mergeCollectionsWithBookmarks(bookmarks, collections);
	const simplifed = simplifyBookmarks(merged);
	const html = generateHtml(simplifed);

	return {
		bookmarks: simplifed,
		html,
		errors
	};
}

// --- Helper & Pipeline Functions ---

function simplifyBookmarks(bookmarks) {
	return bookmarks.map(bm => {
		const resolvedTitle = resolveTitle(bm.title, bm.title2);
		const resolvedUrl = resolveUrl(bm.url, bm.url2);

		return {
			title: resolvedTitle,
			url: resolvedUrl,
			time_added: bm.time_added,
			tags: bm.tags,
			folder: bm.folder
		};
	});
}

function resolveTitle(title1, title2) {
	if (!title1 && title2) return title2;
	if (!title2 && title1) return title1;

	const isUrlLike = str => /^https?:\/\//.test(str);

	if (title1 && !isUrlLike(title1)) return title1;
	if (title2 && !isUrlLike(title2)) return title2;

	return title1 || title2 || '';
}

function resolveUrl(url1, url2) {
	if (!url1 && url2) return url2;
	if (!url2 && url1) return url1;

	if (url1 && url2) {
		return url1.length >= url2.length ? url1 : url2;
	}

	return url1 || url2 || '';
}

function generateHtml(bookmarks) {
	const lines = [];
	lines.push('<!DOCTYPE NETSCAPE-Bookmark-file-1>');
	lines.push('<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">');
	lines.push('<TITLE>Bookmarks</TITLE>');
	lines.push('<H1>Bookmarks</H1>');
	lines.push('<DL><p>');

	const folders = {};
	for (const bm of bookmarks) {
		const folder = bm.folder || '__ROOT__';
		if (!folders[folder]) folders[folder] = [];
		folders[folder].push(bm);
	}

	for (const [folder, items] of Object.entries(folders)) {
		if (folder !== '__ROOT__') {
			lines.push(`<DT><H3>${escapeHtml(folder)}</H3>`);
			lines.push('<DL><p>');
		}
		for (const bm of items) {
			const href = escapeHtml(bm.url);
			const addDate = parseInt(bm.time_added, 10) || '';
			const tags = bm.tags && bm.tags.length ? ` TAGS="${bm.tags.join(',')}"` : '';
			const title = escapeHtml(bm.title);
			lines.push(`<DT><A HREF="${href}" ADD_DATE="${addDate}"${tags}>${title}</A>`);
		}
		if (folder !== '__ROOT__') {
			lines.push('</DL><p>');
		}
	}

	lines.push('</DL><p>');
	return lines.join('\n');
}

function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function unzipFileBuffer(uint8Array) {
	const result = {};
	try {
		const zipEntries = unzipSync(uint8Array);
		for (const [filename, data] of Object.entries(zipEntries)) {
			result[filename] = strFromU8(data);
		}
		return result;
	} catch (err) {
		throw new Error(`Unzipping failed: ${err.message}`);
	}
}

function getAllParts(zip) {
	return Object.entries(zip)
		.filter(([name]) => /^part_\d+\.csv$/.test(name))
		.map(([name, content]) => ({
			name,
			content,
			order: parseInt(name.match(/\d+/)[0], 10),
		}))
		.sort((a, b) => a.order - b.order);
}

function parseAllCSVs(partFiles) {
	const rows = [];
	const errors = [];

	for (const part of partFiles) {
		const result = CsvParser.parse(part.content);
		rows.push(...result.rows);
		if (result.errors.length) {
			errors.push(...result.errors.map(err => ({
				...err,
				file: part.name
			})));
		}
	}

	return { rows, errors };
}

function extractJSONFiles(zip) {
	return Object.entries(zip)
		.filter(([name]) => name.startsWith('collections/') && name.endsWith('.json'))
		.map(([name, content]) => {
			try {
				return { name, data: JSON.parse(content) };
			} catch (err) {
				return { name, error: 'Invalid JSON' };
			}
		});
}

function mergeCollectionsWithBookmarks(bookmarkRows, collections) {
	const urlMap = {};

	collections.forEach(({ data }) => {
		const folder = data.title;
		const items = Array.isArray(data.items) ? data.items : [];
		for (const item of items) {
			if (item.url) {
				urlMap[item.url] = {
					folder,
					title2: item.title || null,
					excerpt: item.excerpt || null,
					note: item.note || null,
					url2: item.url
				};
			}
		}
	});

	const result = bookmarkRows.map(row => {
		const [title, url, time_added, tags, status] = row;
		const enriched = urlMap[url] || {};
		return {
			title,
			url,
			time_added,
			tags: tags.length ? tags.split('|') : [],
			status,
			...enriched
		};
	});

	return result;
}