import fs from 'node:fs/promises'
import path from 'node:path'

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

import { chartConfigSchema } from './chart-config-schema'

// Define the collection
export const collections = {
	'chart-config': defineCollection({
		loader: glob({ pattern: '**/**.json', base: './src/chart-config' }),
		schema: chartConfigSchema,
	}),
	'chart-data': defineCollection({
		loader: async () => {
			const dataDir = path.join(process.cwd(), 'src', 'chart-data')
			const files = await fs.readdir(dataDir)
			const csvFiles = files.filter((file) => file.endsWith('.csv'))

			const chartData = await Promise.all(
				csvFiles.map(async (file) => {
					const filePath = path.join(dataDir, file)

					const content = await fs.readFile(filePath, 'utf-8')
					return {
						id: path.basename(file, '.csv'),
						data: content,
					}
				})
			)

			return chartData
		},
	}),
}
