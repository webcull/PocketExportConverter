// webpack.config.js
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'PocketConverter',
		libraryTarget: 'umd',
		globalObject: 'this',
		clean: true,
		iife: true,
	},
	mode: 'production',
	devtool: 'source-map',
	optimization: {
		splitChunks: false,
		runtimeChunk: false,
	},
	experiments: {
		outputModule: true
	},
	resolve: {
		fallback: {
			fs: false,
			'fs/promises': false,
			path: false,
			buffer: false
		}
	}
};