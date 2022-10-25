import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import path from 'path'

const dev = process.env.NODE_ENV === 'development'
const netlify = process.env.NETLIFY_BUILD

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$src: path.resolve('./src'),
					$com: path.resolve('./src/components'),
				},
			},
		},
		paths: {
			base: dev || netlify ? '' : '/games/fedab98384c6bcf66c0c710af392e7ca8b65a56a',
		},
		prerender: {
			default: true,
		},
	},
}

export default config
