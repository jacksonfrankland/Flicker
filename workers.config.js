import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import dotenv from 'dotenv';
import localIp from 'local-ip';

dotenv.config();
const mode = process.env.NODE_ENV;
const dev = mode === 'development' || mode === 'dev';
const production = !dev;


export default [
	{
	input: 'src/worker.js',
	output: {
		sourcemap: true,
		format: 'esm',
		name: 'app',
		file: 'static/worker.js'
	},
	plugins: [

		replace({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(mode),
			'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
			'process.env.SUPABASE_PUBLIC_KEY': JSON.stringify(process.env.SUPABASE_PUBLIC_KEY),
			'process.env.PUSHER_KEY': JSON.stringify(process.env.PUSHER_KEY),
			'process.env.PUSHER_CLUSTER': JSON.stringify(process.env.PUSHER_CLUSTER),
			'process.env.URL': JSON.stringify(process.env.URL || `${localIp()}:3000`),
		}),
		json(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
	},
];
