import fs from 'node:fs/promises'
import path from 'node:path'

import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

import { ModuleType, ChartColor, YAxisSide } from '@/enums'

const marginAdjustConfig = z.object({
	left: z.number().optional(),
	right: z.number().optional(),
	top: z.number().optional(),
	bottom: z.number().optional(),
})

const timelineTicksConfig = z.object({
	startDate: z.string(),
	numTicks: z.number(),
	dateInterval: z.string(),
	intervalStep: z.number(),
	dateFormat: z.string(),
})

const numericTicksConfig = z.object({
	startVal: z.number(),
	numTicks: z.number(),
	tickInterval: z.number(),
	decimals: z.number(),
})

const xAxisConfig = z.object({
	ticksConfig: timelineTicksConfig,
	label: z.string().optional(),
})

const yAxisConfig = z.object({
	domain: z.array(z.number()),
	ticksConfig: numericTicksConfig,
	guideLines: z.boolean().optional(),
	label: z.string().optional(),
})

const moduleType = z.enum(Object.keys(ModuleType) as [keyof typeof ModuleType])
const yAxisSide = z.nativeEnum(YAxisSide)
const chartColor = z.enum(Object.keys(ChartColor) as [keyof typeof ChartColor])

const legendConfig = z.object({
	text: z.string(),
	color: chartColor.optional(),
	hide: z.boolean().optional(),
})

const seriesModuleConfig = z.object({
	legend: legendConfig,
})

// LineChartConfig
const lineChartConfig = seriesModuleConfig.extend({
	type: z.literal(ModuleType.LineChart),
	series: z.number(),
	side: yAxisSide,
	color: chartColor,
	threshold: z
		.object({
			value: z.number(),
			bottomColor: chartColor,
		})
		.optional(),
	lineType: z.enum(['solid', 'dashed']).optional(),
	curve: z.enum(['linear', 'step', 'natural']).optional(),
})

// PeriodAreasConfig
const periodAreasConfig = seriesModuleConfig.extend({
	type: z.literal(ModuleType.PeriodAreas),
	series: z.number(),
	color: z.literal(ChartColor.RecessionGrey).optional(),
})

// AreaChartConfig
const areaChartConfig = seriesModuleConfig.extend({
	type: z.literal(ModuleType.AreaChart),
	series: z.number(),
	side: yAxisSide,
	color: chartColor,
})

// Modules union
export type Modules = z.infer<typeof modulesSchema>
export const modulesSchema = z.discriminatedUnion('type', [
	lineChartConfig,
	areaChartConfig,
	periodAreasConfig,
])

// Define the main chart configuration schema
const chartConfigSchema = z.object({
	title: z.string(),
	description: z.string(),
	width: z.number(),
	height: z.number(),
	marginAdjust: marginAdjustConfig.optional(),
	xAxisConfig: xAxisConfig,
	yAxisConfig: z.object({
		left: yAxisConfig.optional(),
		right: yAxisConfig.optional(),
	}),
	modules: z.array(modulesSchema),
})

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
