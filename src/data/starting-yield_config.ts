import { ChartColor, ModuleType, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

const series = ['Fed funds target rate (%)', '10-year U.S. Treasury yeld (%)', 'Recessions']

export const config: TimelineChartConfig = {
	width: 1000,
	height: 550,
	xAxisConfig: {
		domain: ['1976-02-27', '2020-03-31'],
		ticksConfig: {
			startDate: '1980-01-01',
			numTicks: 9,
			dateInterval: 'year',
			intervalStep: 5,
			dateFormat: '%Y',
		},
	},
	yAxisConfig: {
		left: {
			domain: [-2, 22],
			ticksConfig: {
				startVal: -2,
				numTicks: 13,
				tickInterval: 2,
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
			type: ModuleType.LineChart,
			series: 1,
			side: YAxisSide.Left,
			color: ChartColor.Blue,
		},
	],
}
