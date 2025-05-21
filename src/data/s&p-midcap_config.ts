import { ChartColor, ModuleType, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

export const config: TimelineChartConfig = {
	width: 900,
	height: 450,
	marginAdjust: {
		right: 14,
		top: 12,
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
				decimals: 1,
			},
			guideLines: true,
		},
	},
	modules: [
		{
			type: ModuleType.LineChart,
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Blue,
			threshold: {
				value: 1.0,
				bottomColor: ChartColor.Green,
			},
		},
	],
}
