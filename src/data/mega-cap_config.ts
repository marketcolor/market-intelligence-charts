import { ChartColor, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

const series = ['S&P 500 Top 10 Weights']

export const config: TimelineChartConfig = {
	width: 900,
	height: 550,
	marginAdjust: {
		right: 50,
	},
	xAxisConfig: {
		domain: ['1997-01-03', '2025-03-28'],
		ticksConfig: {
			startDate: '1997-01-31',
			numTicks: 15,
			dateInterval: 'year',
			intervalStep: 2,
			dateFormat: '%Y',
		},
	},
	yAxisConfig: {
		left: {
			domain: [15, 40],
			ticksConfig: {
				startVal: 15,
				numTicks: 6,
				tickInterval: 5,
				numberFormat: ',.2r',
			},
			guideLines: true,
		},
	},
	legend: [
		{
			text: series[0],
			color: ChartColor.Green,
		},
	],
	modules: [
		{
			type: 'lineChart',
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Blue,
		},
	],
}
