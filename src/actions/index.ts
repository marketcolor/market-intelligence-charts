import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { optimize } from 'svgo'
import type { Config } from 'svgo'

const svgoConfig: Config = {
	plugins: [
		{
			name: 'removeUnknownsAndDefaults',
			params: {
				keepDataAttrs: false,
			},
		},
	],
}

export const server = {
	saveSvg: defineAction({
		input: z.object({
			svgString: z.string(),
			fileName: z.string(),
		}),
		handler: async (input) => {
			const svgString = optimize(input.svgString, svgoConfig)

			fs.writeFileSync(`out/${input.fileName}.svg`, svgString.data, { encoding: 'utf-8' })
			return { ok: 'ok' }
		},
	}),
	savePng: defineAction({
		input: z.object({
			png: z.string(),
			fileName: z.string(),
		}),
		handler: async (input) => {
			const png = input.png.replace(/^data:image\/png;base64,/, '')
			const buffer = new Buffer(png, 'base64')

			fs.writeFileSync(`out/${input.fileName}.png`, buffer, { encoding: 'base64' })
			return { ok: 'ok' }
		},
	}),
}
