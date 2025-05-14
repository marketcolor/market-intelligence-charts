import { ChartColor, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

export const config: TimelineChartConfig = {
	width: 1000,
	height: 550,
	// marginAdjust: {
	// 	right: 26,
	// 	top: 12,
	// },
	// legend: [
	// 	{
	// 		text: 'Recessions',
	// 		color: ChartColor.Grey,
	// 	},
	// ],
	xAxisConfig: {
		domain: ['2000-04-01', '2025-02-01'],
		ticksConfig: {
			startDate: '2001-02-01',
			numTicks: 9,
			dateInterval: 'year',
			intervalStep: 3,
			dateFormat: '%m/%y',
		},
	},
	yAxisConfig: {
		left: {
			domain: [1, 7],
			ticksConfig: {
				startVal: 1,
				numTicks: 7,
				tickInterval: 1,
				numberFormat: ',.0f',
			},
			label: 'Trillions($)',
			guideLines: true,
		},
	},
	modules: [
		{
			type: 'periodAreas',
			series: 1,
			color: ChartColor.Grey,
		},
		{
			type: 'areaChart',
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Green,
		},
	],
}
