import { z } from 'zod'
import {
	TickType,
	XAxisSide,
	YAxisSide,
	ChartColor,
	ModuleType,
	ChartType,
	LineType,
	CurveType,
} from '@/enums'

export const tickTypeSchema = z.nativeEnum(TickType)

export const xAxisSideSchema = z.nativeEnum(XAxisSide)

export const yAxisSideSchema = z.nativeEnum(YAxisSide)

export const moduleTypeSchema = z.nativeEnum(ModuleType)

export const chartTypeSchema = z.nativeEnum(ChartType)

export const lineTypeSchema = z.nativeEnum(LineType)

export const curveTypeSchema = z.nativeEnum(CurveType)

export const chartColorSchema = z.enum(Object.keys(ChartColor) as [keyof typeof ChartColor])

// const moduleType = z.enum(Object.keys(ModuleType) as [keyof typeof ModuleType])
// const chartType = z.nativeEnum(ChartType)
// const yAxisSide = z.nativeEnum(YAxisSide)
//////////////////////////////////////////////////////
// Dimensions
export const plotDimensionsSchema = z.object({
	plotWidth: z.number(),
	plotHeight: z.number(),
	leftMargin: z.number(),
	rightMargin: z.number(),
	topMargin: z.number(),
	bottomMargin: z.number(),
})

export const chartSizeSchema = z.object({
	width: z.number(),
	height: z.number(),
})

export const chartMeasuresSchema = plotDimensionsSchema.and(chartSizeSchema)

export const chartMarginsSchema = z.object({
	top: z.number().optional(),
	bottom: z.number().optional(),
	left: z.number().optional(),
	right: z.number().optional(),
})
////////////////////////////////////////////////////////
// Ticks

export const baseTicksConfigSchema = z.object({
	fontSize: z.union([z.literal('small'), z.literal('default'), z.literal('large')]).optional(),
})

export const timeIntervalSchema = z.union([z.literal('day'), z.literal('month'), z.literal('year')])

export const timeTicksConfigSchema = baseTicksConfigSchema.extend({
	startDate: z.union([z.date(), z.string()]),
	numTicks: z.number(),
	dateInterval: timeIntervalSchema,
	intervalStep: z.number(),
	dateFormat: z.string().optional(),
})

export const quantTicksConfigSchema = baseTicksConfigSchema.extend({
	startVal: z.number(),
	numTicks: z.number(),
	tickInterval: z.number(),
	decimals: z.number().optional(),
})
/////////////////////////////////////////////////////////
// X axis config
export const baseAxisConfigSchema = z.object({
	label: z.string().optional(),
	guideLines: z.boolean().optional(),
	hideTicks: z.boolean().optional(),
})

export const timeAxisConfigSchema = baseAxisConfigSchema.extend({
	ticksConfig: timeTicksConfigSchema,
})

export const quantAxisConfigSchema = baseAxisConfigSchema.extend({
	domain: z.tuple([z.number(), z.number()]).optional(),
	ticksConfig: quantTicksConfigSchema.optional(),
})

export const bandAxisConfigSchema = baseAxisConfigSchema.extend({
	ticksConfig: baseTicksConfigSchema.optional(),
})

export const xAxisConfigSchema = z.union([
	timeAxisConfigSchema,
	quantAxisConfigSchema,
	bandAxisConfigSchema,
])
////////////////////////////////////////////////////
// Legend
export const legendConfigSchema = z.object({
	text: z.string(),
	color: chartColorSchema.optional(),
	hide: z.boolean().optional(),
})
////////////////////////////////////////////////////
// Modules
const baseModuleConfigSchema = z.object({
	legend: legendConfigSchema,
})

export const lineChartConfigSchema = baseModuleConfigSchema.extend({
	type: z.literal(ModuleType.LineChart),
	series: z.number(),
	side: yAxisSideSchema,
	color: chartColorSchema,
	threshold: z
		.object({
			value: z.number(),
			bottomColor: chartColorSchema,
		})
		.optional(),
	lineType: lineTypeSchema.optional(),
	curve: curveTypeSchema.optional(),
})

export const barChartConfigSchema = baseModuleConfigSchema.extend({
	type: z.literal(ModuleType.BarChart),
	series: z.number(),
	side: yAxisSideSchema,
	color: chartColorSchema,
	barWidth: z.number(),
	labels: z
		.object({
			hide: z.boolean().optional(),
			decimals: z.number().optional(),
			suffix: z.string().optional(),
			inside: z.boolean().optional(),
		})
		.optional(),
	baseline: z
		.object({
			value: z.number(),
			extend: z.number().optional(),
			bottomColor: chartColorSchema.optional(),
		})
		.optional(),
})

export const periodAreasConfigSchema = baseModuleConfigSchema.extend({
	type: z.literal(ModuleType.PeriodAreas),
	series: z.number(),
	color: z.literal(ChartColor.RecessionGrey).optional(),
})

export const areaChartConfigSchema = baseModuleConfigSchema.extend({
	type: z.literal(ModuleType.AreaChart),
	series: z.number(),
	side: yAxisSideSchema,
	color: chartColorSchema,
	baseline: z
		.object({
			value: z.number(),
			bottomColor: chartColorSchema.optional(),
		})
		.optional(),
	curve: curveTypeSchema.optional(),
})

export const scatterPlotConfigSchema = baseModuleConfigSchema.extend({
	type: z.literal(ModuleType.ScatterPlot),
	series: z.number(),
	side: yAxisSideSchema,
	color: chartColorSchema,
	size: z.number(),
	trendLine: z.boolean().optional(),
	trendLineColor: chartColorSchema.optional(),
})

export const modulesSchema = z.discriminatedUnion('type', [
	lineChartConfigSchema,
	areaChartConfigSchema,
	barChartConfigSchema,
	periodAreasConfigSchema,
	scatterPlotConfigSchema,
])
//////////////////////////////////////////////////////////////
// Charts config
export const baseChartConfigSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	width: z.number(),
	height: z.number(),
	marginAdjust: chartMarginsSchema.optional(),
	yAxisConfig: z.record(yAxisSideSchema, quantAxisConfigSchema),
	modules: z.array(modulesSchema).optional(),
})

export const timelineChartConfigSchema = baseChartConfigSchema.extend({
	type: z.literal(ChartType.Time),
	xAxisConfig: timeAxisConfigSchema,
})

export const quantChartConfigSchema = baseChartConfigSchema.extend({
	type: z.literal(ChartType.Quant),
	xAxisConfig: quantAxisConfigSchema,
})

export const bandChartConfigSchema = baseChartConfigSchema.extend({
	type: z.literal(ChartType.Band),
	xAxisConfig: bandAxisConfigSchema,
})

export const chartConfigSchema = z.discriminatedUnion('type', [
	timelineChartConfigSchema,
	quantChartConfigSchema,
	bandChartConfigSchema,
])
