import type { ScaleBand, ScaleLinear, ScaleTime } from 'd3'
import type { ChartColor, ChartType, CurveType, LineType, ModuleType, YAxisSide } from './enums'
import type z from 'zod'
import type {
	bandXAxisConfigSchema,
	chartConfigSchema,
	chartMarginsSchema,
	chartMeasuresSchema,
	chartSizeSchema,
	legendConfigSchema,
	modulesSchema,
	plotDimensionsSchema,
	quantTicksConfigSchema,
	quantXAxisConfigSchema,
	timeTicksConfigSchema,
	timeXAxisConfigSchema,
	xAxisConfigSchema,
	yAxisConfigSchema,
} from './chart-config-schema'

export type PlotDimensions = z.infer<typeof plotDimensionsSchema>
export type ChartSize = z.infer<typeof chartSizeSchema>
export type ChartMeasures = z.infer<typeof chartMeasuresSchema>

export type ChartMargins = z.infer<typeof chartMarginsSchema>

export type DateInterval = 'day' | 'month' | 'year'

export type TimeTicksConfig = z.infer<typeof timeTicksConfigSchema>
export type QuantTicksConfig = z.infer<typeof quantTicksConfigSchema>

export type TickObject<T extends number | string | Date> = {
	value: T
	label: string
}

export type TimeXAxisConfig = z.infer<typeof timeXAxisConfigSchema>
export type QuantXAxisConfig = z.infer<typeof quantXAxisConfigSchema>
export type BandXAxisConfig = z.infer<typeof bandXAxisConfigSchema>

export type XAxisConfig = z.infer<typeof xAxisConfigSchema>

export type YAxisConfig = z.infer<typeof yAxisConfigSchema>

export type TimelineChartRawDataEntry = [string, ...number[]]

export type TimelineChartDataEntry = [Date, ...number[]]
export type QuantChartDataEntry = [number, ...number[]]
export type BandChartDataEntry = [string, ...number[]]

export type ChartDataEntry = TimelineChartDataEntry | QuantChartDataEntry | BandChartDataEntry

export type TimeChartDomain = [Date, Date]
export type QuantChartDomain = [number, number]
export type BandChartDomain = string[]

export type CartesianChartDomain = TimeChartDomain | QuantChartDomain | BandChartDomain
//
// modules config
type BaseModuleConfig = {
	legend: LegendConfig
}

export type LineChartConfig = BaseModuleConfig & {
	type: ModuleType.LineChart
	series: number
	side: YAxisSide
	color: ChartColor
	threshold?: {
		value: number
		bottomColor: ChartColor
	}
	lineType?: LineType
	curve?: CurveType
}

export type BarChartConfig = BaseModuleConfig & {
	type: ModuleType.BarChart
	series: number
	side: YAxisSide
	color: ChartColor
	baseline?: {
		value: number
		bottomColor: ChartColor
	}
}

export type PeriodAreasConfig = BaseModuleConfig & {
	type: ModuleType.PeriodAreas
	series: number
	color?: ChartColor.RecessionGrey
}

export type AreaChartConfig = BaseModuleConfig & {
	type: ModuleType.AreaChart
	series: number
	side: YAxisSide
	color: ChartColor
	baseline?: {
		value: number
		bottomColor?: ChartColor
	}
	curve?: CurveType
}

// export type Modules = LineChartConfig | AreaChartConfig | PeriodAreasConfig
export type Modules = z.infer<typeof modulesSchema>
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

export type ChartConfig = z.infer<typeof chartConfigSchema>
export type LegendConfig = z.infer<typeof legendConfigSchema>
