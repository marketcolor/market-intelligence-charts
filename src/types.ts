import type { ScaleLinear, ScaleTime } from 'd3'
import type { ChartColor, YAxisSide } from './enums'

export type PlotDimensions = {
	plotWidth: number
	plotHeight: number
	leftMargin: number
	rightMargin: number
	topMargin: number
	bottomMargin: number
}

export type ChartMeasures = PlotDimensions & {
	width: number
	height: number
}

export type ChartMargins = {
	top?: number
	bottom?: number
	left?: number
	right?: number
}
export type BaseChartConfig = {
	width: number
	height: number
	marginAdjust?: ChartMargins
}

export type TimelineChartConfig = BaseChartConfig & {
	xAxisConfig: TimelineXAxisConfig
	yAxisConfig: {
		[key in YAxisSide]?: YAxisConfig
	}
	legend?: LegendConfig[]
	modules?: Modules[]
}

export type DateInterval = 'day' | 'month' | 'year'

export type TimelineTicksConfig = {
	startDate: string | Date
	numTicks: number
	dateInterval: DateInterval
	intervalStep: number
	dateFormat?: string
}

export type NumericTicksConfig = {
	startVal: number
	numTicks: number
	tickInterval: number
	numberFormat?: string
}

export type TickObject<T extends number | string | Date> = {
	value: T
	label: string
}

export type TimelineXAxisConfig = {
	domain: [string, string] | [Date, Date]
	ticksConfig: TimelineTicksConfig
	label?: string
	guideLines?: boolean
}

export type YAxisConfig = {
	domain: [number, number]
	ticksConfig?: NumericTicksConfig
	label?: string
	guideLines?: boolean
}

export type LegendConfig = {
	text: string
	color: ChartColor
}
// data entry
export type GeneralDataEntry = {
	[key: string]: number
}

export type TimelineChartRawDataEntry = [string, ...number[]]
export type TimelineChartDataEntry = [Date, ...number[]]
//
// modules config
export type LineChartConfig = {
	type: 'lineChart'
	series: number
	side: YAxisSide
	color: ChartColor
	threshold?: {
		value: number
		bottomColor: ChartColor
	}
	lineType?: 'solid' | 'dashed'
	curve?: 'linear' | 'step' | 'natural'
}

export type PeriodAreasConfig = {
	type: 'periodAreas'
	series: number
}

export type AreaChartConfig = {
	type: 'areaChart'
	series: number
	side: YAxisSide
	color: ChartColor
}

export type Modules = LineChartConfig | AreaChartConfig | PeriodAreasConfig
/////////////////
export type TimelineChartScales = {
	y: {
		left?: ScaleLinear<number, number, never>
		right?: ScaleLinear<number, number, never>
	}
	x: ScaleTime<number, number, never>
}

export type ChartModuleBasicProps = {
	measures: ChartMeasures
	scales: TimelineChartScales
	htmlRef?: HTMLElement | null
}
