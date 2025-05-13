import { ChartColor, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

const series = ['Fed funds target rate (%)', '10-year U.S. Treasury yeld (%)', 'Recessions']

export const config: TimelineChartConfig = {
	width: 1200,
	height: 450,
	marginAdjust: {
		right: 30,
	},
	xAxisConfig: {
		domain: ['1994-01-31', '2025-03-31'],
		ticksConfig: {
			startDate: '1995-03-01',
			numTicks: 11,
			dateInterval: 'year',
			intervalStep: 3,
			dateFormat: '%m/%y',
		},
	},
	yAxisConfig: {
		left: {
			domain: [0, 8],
			ticksConfig: {
				startVal: 0,
				numTicks: 5,
				tickInterval: 2,
				numberFormat: ',.0f',
			},
			guideLines: true,
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
		{
			text: series[2],
			color: ChartColor.Grey,
		},
	],
	modules: [
		{
			type: 'periodAreas',
			series: 2,
			color: ChartColor.Grey,
		},
		{
			type: 'lineChart',
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Green,
		},
		{
			type: 'lineChart',
			series: 1,
			side: YAxisSide.Left,
			color: ChartColor.Blue,
		},
	],
}
