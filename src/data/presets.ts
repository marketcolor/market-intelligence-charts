import { ChartColor, ModuleType, YAxisSide } from '@/enums'

export const presets = {
	'labor-market': {
		title: 'A steady labor market and tight high-yield spreads suggest the economy remains resilient',
		description:
			'A steady labor market and tight high-yield spreads suggest the economy remains resilient',
		width: 900,
		height: 550,
		xAxisConfig: {
			domain: ['2000-08-18', '2025-03-21'],
			ticksConfig: {
				startDate: '2001-03-01',
				numTicks: 13,
				dateInterval: 'year',
				intervalStep: 2,
				dateFormat: '%m/%y',
			},
		},
		legend: [
			{
				text: 'USA - Weekly Job Claims (left)',
				color: ChartColor.Green,
			},
			{
				text: 'Bloomberg US High Yield - Corporate Spread to Treasuries (%) (right)',
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
				side: YAxisSide.Right,
				color: ChartColor.Blue,
			},
		],
	},
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
