import { ChartColor, ModuleType, YAxisSide } from '@/enums'

export const presets = {
	'fed-funds': {
		title:
			'The fed funds target rate tends to fall further than the 10-year U.S. Treasury yield once the Fed shifts policy',
		description:
			'This chart plots the fed funds target rate and the 10-year U.S. Treasury yield, with recessions shaded.',
		width: 1200,
		height: 450,
		xAxisConfig: {
			ticksConfig: {
				startDate: '1995-03-01',
				numTicks: 7,
				dateInterval: 'year',
				intervalStep: 3,
				dateFormat: '%m/%y',
			},
		},
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
			{
				type: ModuleType.PeriodAreas,
				series: 2,
			},
		],
	},
}
