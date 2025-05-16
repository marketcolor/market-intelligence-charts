import { ChartColor, ModuleType, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

const series = ['S&P 500 Index', 'S&P 500 EPS forecast, next 12 months']

export const config: TimelineChartConfig = {
	title: 'Stock prices and earnings',
	description: 'Stock prices and earnings estimates tend to move together over time',
	width: 800,
	height: 500,
	xAxisConfig: {
		domain: ['2015-02-01', '2025-03-28'],
		ticksConfig: {
			startDate: '2015-03-01',
			numTicks: 11,
			dateInterval: 'year',
			intervalStep: 1,
			dateFormat: '%m/%y',
		},
	},
	yAxisConfig: {
		left: {
			domain: [1500, 6500],
			ticksConfig: {
				startVal: 1500,
				numTicks: 11,
				tickInterval: 500,
				decimals: 0,
			},
			guideLines: true,
		},
		right: {
			domain: [120, 320],
			ticksConfig: {
				startVal: 120,
				numTicks: 11,
				tickInterval: 20,
				decimals: 0,
			},
		},
	},
	legend: [
		{
			text: series[0],
			color: ChartColor.Green,
		},
		{
			text: series[1],
			color: ChartColor.Blue,
		},
	],
	modules: [
		{
			type: ModuleType.LineChart,
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Green,
		},
		{
			type: ModuleType.AreaChart,
			series: 1,
			side: YAxisSide.Right,
			color: ChartColor.Blue,
		},
	],
}
