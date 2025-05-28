import { ChartColor, ModuleType, YAxisSide } from '@/enums'
import type { TimelineChartConfig } from '@/types'

const series = ['Fed funds target rate (%)', '10-year U.S. Treasury yeld (%)', 'Recessions']

export const config: TimelineChartConfig = {
	title:
		'The fed funds target rate tends to fall further than the 10-year U.S. Treasury yield once the Fed shifts policy',
	description:
		'This chart plots the fed funds target rate and the 10-year U.S. Treasury yield, with recessions shaded.',
	width: 1200,
	height: 450,
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
				decimals: 0,
			},
			guideLines: true,
		},
	},
	modules: [
		{
			type: ModuleType.LineChart,
			series: 0,
			side: YAxisSide.Left,
			color: ChartColor.Green,
			legend: {
				text: series[0],
			},
		},
		{
			type: ModuleType.LineChart,
			series: 1,
			side: YAxisSide.Left,
			color: ChartColor.Blue,
			legend: {
				text: series[1],
			},
		},
		{
			type: ModuleType.PeriodAreas,
			series: 2,
			legend: {
				text: series[2],
			},
		},
	],
}
