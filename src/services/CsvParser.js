// src/services/CsvParser.js
export const CsvParser = new class {
	parse(csvText) {
		const rows = this._smartSplit(csvText);
		const header = rows[0];
		const dataRows = rows.slice(1);

		const errors = [];
		const validated = [];

		dataRows.forEach((row, index) => {
			if (row.length !== header.length) {
				errors.push({
					line: index + 2, // +2 accounts for 0-based index + header
					expected: header.length,
					actual: row.length,
					raw: row
				});
			} else {
				validated.push(row);
			}
		});

		return {
			header,
			rows: validated,
			errors
		};
	}

	_smartSplit(csvText) {
		const lines = csvText.trim().split(/\r?\n/);
		const result = [];

		for (const line of lines) {
			result.push(this._splitCsvLine(line));
		}

		return result;
	}

	_splitCsvLine(line) {
		const fields = [];
		let current = '';
		let inQuotes = false;
		let i = 0;

		while (i < line.length) {
			const char = line[i];

			if (char === '"') {
				if (inQuotes && line[i + 1] === '"') {
					current += '"';
					i += 2;
				} else {
					inQuotes = !inQuotes;
					i++;
				}
			} else if (char === ',' && !inQuotes) {
				fields.push(this._unescapeCsvField(current));
				current = '';
				i++;
			} else {
				current += char;
				i++;
			}
		}

		fields.push(this._unescapeCsvField(current));
		return fields;
	}

	_unescapeCsvField(str) {
		str = str.trim();
		if (str.startsWith('"') && str.endsWith('"')) {
			str = str.slice(1, -1);
		}
		return str.replace(/""/g, '"');
	}
};