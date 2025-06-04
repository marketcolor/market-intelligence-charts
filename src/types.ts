import type { ScaleBand, ScaleLinear, ScaleTime } from 'd3'
import type z from 'zod'

import type {
	areaChartConfigSchema,
	bandAxisConfigSchema,
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
	quantAxisConfigSchema,
	timeIntervalSchema,
	timeTicksConfigSchema,
	timeAxisConfigSchema,
	xAxisConfigSchema,
	scatterPlotConfigSchema,
	chartColorSchema,
	numberFormattingSchema,
} from './chart-config-schema'

export type NumberFormatConfig = z.infer<typeof numberFormattingSchema>

export type PlotDimensions = z.infer<typeof plotDimensionsSchema>
export type ChartSize = z.infer<typeof chartSizeSchema>
export type ChartMeasures = z.infer<typeof chartMeasuresSchema>

export type ChartMargins = z.infer<typeof chartMarginsSchema>

export type ChartColorSchema = z.infer<typeof chartColorSchema>

export type DateInterval = z.infer<typeof timeIntervalSchema>

export type TimeTicksConfig = z.infer<typeof timeTicksConfigSchema>
export type QuantTicksConfig = z.infer<typeof quantTicksConfigSchema>

export type TimeAxisConfig = z.infer<typeof timeAxisConfigSchema>
export type QuantAxisConfig = z.infer<typeof quantAxisConfigSchema>
export type BandAxisConfig = z.infer<typeof bandAxisConfigSchema>

export type XAxisConfig = z.infer<typeof xAxisConfigSchema>

// export type YAxisConfig = z.infer<typeof yAxisConfigSchema>

export type LineChartConfig = z.infer<typeof lineChartConfigSchema>
export type BarChartConfig = z.infer<typeof barChartConfigSchema>
export type AreaChartConfig = z.infer<typeof areaChartConfigSchema>
export type ScatterPlotConfig = z.infer<typeof scatterPlotConfigSchema>
export type PeriodAreasConfig = z.infer<typeof periodAreasConfigSchema>

export type Modules = z.infer<typeof modulesSchema>

export type ChartConfig = z.infer<typeof chartConfigSchema>
export type LegendConfig = z.infer<typeof legendConfigSchema>

/////////////////
export type CartesianXScales =
	| ScaleLinear<number, number, never>
	| ScaleTime<number, number, never>
	| ScaleBand<string>

export type CartesianYScales = ScaleLinear<number, number, never>

export type CartesianChartScales = {
	y: {
		left?: CartesianYScales
		right?: CartesianYScales
	}
	x: CartesianXScales
}

export type ChartModuleBasicProps = {
	measures: ChartMeasures
	scales: CartesianChartScales
	htmlRef?: HTMLElement | null
}

export type TimelineChartRawDataEntry = [string, ...number[]]

export type TimeChartDataEntry = [Date, ...number[]]
export type QuantChartDataEntry = [number, ...number[]]
export type BandChartDataEntry = [string, ...number[]]
export type ChartDataEntry = TimeChartDataEntry | QuantChartDataEntry | BandChartDataEntry

export type TimeChartDomain = [Date, Date]
export type QuantChartDomain = [number, number]
export type BandChartDomain = string[]
export type CartesianChartDomain = TimeChartDomain | QuantChartDomain | BandChartDomain

export type TickObject<T extends number | string | Date> = {
	value: T
	label: string
}
