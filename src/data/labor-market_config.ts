import { ChartColor, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

const series = [
	'USA - Weekly Job Claims (left)',
	'Bloomberg US High Yield - Corporate Spread to Treasuries (%) (right)',
]

export const config: TimelineChartConfig = {
	width: 900,
	height: 550,
	xAxisConfig: {
		domain: ['2000-08-18', '2025-03-21'],
		ticksConfig: {
			startDate: '2001-03-01',
			numTicks: 13,
			dateInterval: 'year',
			intervalStep: 2,
			dateFormat: '%m/%y',
		},
	},
	yAxisConfig: {
		left: {
			domain: [100, 717.5],
			ticksConfig: {
				startVal: 100,
				numTicks: 7,
				tickInterval: 100,
				numberFormat: ',.2r',
			},
			guideLines: true,
		},
		right: {
			domain: [2, 20.5],
			ticksConfig: {
				startVal: 2,
				numTicks: 7,
				tickInterval: 3,
				numberFormat: ',.0f',
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
			type: 'lineChart',
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Green,
		},
		{
			type: 'lineChart',
			series: 1,
			side: YAxisSide.Right,
			color: ChartColor.Blue,
		},
	],
}
