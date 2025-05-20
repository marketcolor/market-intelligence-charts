import { ChartColor, ModuleType, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

export const config: TimelineChartConfig = {
	width: 1000,
	height: 550,
	xAxisConfig: {
		domain: ['2000-04-01', '2025-02-01'],
		ticksConfig: {
			startDate: '2001-04-01',
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
				decimals: 1,
			},
			label: 'Trillions($)',
			guideLines: true,
		},
	},
	modules: [
		{
			type: ModuleType.PeriodAreas,
			series: 1,
		},
		{
			type: ModuleType.AreaChart,
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Green,
		},
	],
}
