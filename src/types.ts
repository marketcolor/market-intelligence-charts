import type { ScaleLinear, ScaleTime } from 'd3'
import type { YAxisSide } from './enums'
import type { RefObject } from 'react'

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

export type BaseChartConfig = {
	width: number
	height: number
}

export type TimelineChartConfig = BaseChartConfig & {
	xAxisConfig: TimelineXAxisConfig
	yAxisConfig: {
		[key in YAxisSide]?: YAxisConfig
	}
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
	domain: [string, string]
	ticksConfig: TimelineTicksConfig
	label?: string
	guideLines?: boolean
}

export type YAxisConfig = {
	domain: [number, number]
	ticksConfig: NumericTicksConfig
	label?: string
	guideLines?: boolean
}
// data entry
export type GeneralDataEntry = {
	[key: string]: number
}

export type TimelineChartDataEntry = GeneralDataEntry & {
	Date: Date
}

//
// modules config
export type LineChartConfig = {
	type: 'lineChart'
	series: string[]
	lineType?: 'solid' | 'dashed'
	curve?: 'linear' | 'step' | 'natural'
}

export type Modules = LineChartConfig
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
	htmlRef?: RefObject<HTMLElement | null>
}
