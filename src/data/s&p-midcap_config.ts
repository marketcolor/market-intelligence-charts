import { ChartColor, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

export const config: TimelineChartConfig = {
	width: 900,
	height: 450,
	marginAdjust: {
		left: 80,
		right: 20,
		top: 20,
	},
	xAxisConfig: {
		domain: ['1997-07-31', '2025-03-31'],
		ticksConfig: {
			startDate: '1999-01-01',
			numTicks: 14,
			dateInterval: 'year',
			intervalStep: 2,
			dateFormat: '%Y',
		},
	},
	yAxisConfig: {
		left: {
			domain: [0.6, 1.4],
			ticksConfig: {
				startVal: 0.6,
				numTicks: 9,
				tickInterval: 0.1,
				decimals: ',.1f',
			},
			guideLines: true,
		},
	},
	modules: [
		{
			type: 'lineChart',
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Blue,
			threshold: {
				value: 1,
				bottomColor: ChartColor.Green,
			},
		},
	],
}
