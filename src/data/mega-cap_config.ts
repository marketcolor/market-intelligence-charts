import { ChartColor, ModuleType, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

const series = ['S&P 500 Top 10 Weights']

export const config: TimelineChartConfig = {
	title:
		'Mega-cap tech stocks have recently reversed course, decreasing the market concentration within these names',
	description:
		'This chart shows the concentration of the S&P 500 in the top 10 names, which peaked in late 2024.',
	width: 900,
	height: 550,
	marginAdjust: {
		right: 20,
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
				decimals: 0,
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
			type: ModuleType.LineChart,
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Blue,
		},
	],
}
