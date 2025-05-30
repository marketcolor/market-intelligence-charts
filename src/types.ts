import type { ScaleBand, ScaleLinear, ScaleTime } from 'd3'
import type z from 'zod'

import type {
	areaChartConfigSchema,
	bandXAxisConfigSchema,
	barChartConfigSchema,
	chartConfigSchema,
	chartMarginsSchema,
	chartMeasuresSchema,
	chartSizeSchema,
	legendConfigSchema,
	lineChartConfigSchema,
	modulesSchema,
	periodAreasConfigSchema,
	plotDimensionsSchema,
	quantTicksConfigSchema,
	quantXAxisConfigSchema,
	timeIntervalSchema,
	timeTicksConfigSchema,
	timeXAxisConfigSchema,
	xAxisConfigSchema,
	yAxisConfigSchema,
} from './chart-config-schema'

export type PlotDimensions = z.infer<typeof plotDimensionsSchema>
export type ChartSize = z.infer<typeof chartSizeSchema>
export type ChartMeasures = z.infer<typeof chartMeasuresSchema>

export type ChartMargins = z.infer<typeof chartMarginsSchema>

export type DateInterval = z.infer<typeof timeIntervalSchema>

export type TimeTicksConfig = z.infer<typeof timeTicksConfigSchema>
export type QuantTicksConfig = z.infer<typeof quantTicksConfigSchema>

export type TimeXAxisConfig = z.infer<typeof timeXAxisConfigSchema>
export type QuantXAxisConfig = z.infer<typeof quantXAxisConfigSchema>
export type BandXAxisConfig = z.infer<typeof bandXAxisConfigSchema>

export type XAxisConfig = z.infer<typeof xAxisConfigSchema>

export type YAxisConfig = z.infer<typeof yAxisConfigSchema>

export type LineChartConfig = z.infer<typeof lineChartConfigSchema>
export type BarChartConfig = z.infer<typeof barChartConfigSchema>
export type AreaChartConfig = z.infer<typeof areaChartConfigSchema>
export type PeriodAreasConfig = z.infer<typeof periodAreasConfigSchema>

export type Modules = z.infer<typeof modulesSchema>

export type ChartConfig = z.infer<typeof chartConfigSchema>
export type LegendConfig = z.infer<typeof legendConfigSchema>

/////////////////
export type CartesianXScales =
	| ScaleLinear<number, number, never>
	| ScaleTime<number, number, never>
	| ScaleBand<string>

export type CartesianChartScales = {
	y: {
		left?: ScaleLinear<number, number, never>
		right?: ScaleLinear<number, number, never>
	}
	x: CartesianXScales
}

export type ChartModuleBasicProps = {
	measures: ChartMeasures
	scales: CartesianChartScales
	htmlRef?: HTMLElement | null
}

export type TimelineChartRawDataEntry = [string, ...number[]]

export type TimelineChartDataEntry = [Date, ...number[]]
export type QuantChartDataEntry = [number, ...number[]]
export type BandChartDataEntry = [string, ...number[]]
export type ChartDataEntry = TimelineChartDataEntry | QuantChartDataEntry | BandChartDataEntry

export type TimeChartDomain = [Date, Date]
export type QuantChartDomain = [number, number]
export type BandChartDomain = string[]
export type CartesianChartDomain = TimeChartDomain | QuantChartDomain | BandChartDomain

export type TickObject<T extends number | string | Date> = {
	value: T
	label: string
}
