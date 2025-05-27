import { ChartColor, ModuleType, YAxisSide } from '@/enums'

export const presets = {
	'non-us-earnings': {
		title: 'Non-U.S. earnings estimates and stock prices have typically moved together over time',
		description:
			'This graph shows the MSCI EAFE Index price and the MSCI EAFE Index EPS forecast, which tend to move together over time.',
		width: 975,
		height: 452,
		xAxisConfig: {
			ticksConfig: {
				startDate: '2016-03-01',
				numTicks: 10,
				dateInterval: 'year',
				intervalStep: 1,
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
				side: YAxisSide.Right,
				color: ChartColor.Blue,
			},
		],
	},
	'stock-prices': {
		title: 'Stock prices and earnings',
		description:
			'This graph shows the S&P 500 Index price and the S&P 500 Index EPS forecast, which tend to move together over time.',
		width: 975,
		height: 452,
		xAxisConfig: {
			ticksConfig: {
				startDate: '2015-03-01',
				numTicks: 11,
				dateInterval: 'year',
				intervalStep: 1,
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
				side: YAxisSide.Right,
				color: ChartColor.Blue,
			},
		],
	},
	's&p-midcap': {
		title: 's&p-midcap',
		description:
			'This chart shows the S&P MidCap 400 Index P/E ratio relative to the S&P 500 Index P/E ratio. The chart shows that mid caps are trading at a substantial discount to large cap equities.',
		width: 900,
		height: 450,
		marginAdjust: {
			right: 14,
			top: 12,
		},
		xAxisConfig: {
			ticksConfig: {
				startDate: '1999-01-01',
				numTicks: 14,
				dateInterval: 'year',
				intervalStep: 2,
				dateFormat: '%Y',
			},
		},
		modules: [
			{
				type: ModuleType.LineChart,
				series: 0,
				side: YAxisSide.Left,
				color: ChartColor.Blue,
				showLegend: false,
				threshold: {
					value: 1.0,
					bottomColor: ChartColor.Green,
				},
			},
		],
	},
	'money-market': {
		title: 'Money market assets remain at all-time highs, with balances nearing $7 trillion',
		description:
			'This chart shows how money market assets have tended to peak near recessions and stock market bottoms. Currently, these assets have been rising since the start of the pandemic and remain elevated.',
		width: 975,
		height: 495,
		xAxisConfig: {
			ticksConfig: {
				startDate: '2001-02-01',
				numTicks: 9,
				dateInterval: 'year',
				intervalStep: 3,
				dateFormat: '%m/%y',
			},
		},
		modules: [
			{
				type: ModuleType.AreaChart,
				series: 0,
				side: YAxisSide.Left,
				color: ChartColor.Green,
			},
			{
				type: ModuleType.PeriodAreas,
				series: 1,
			},
		],
	},
	'labor-market': {
		title: 'A steady labor market and tight high-yield spreads suggest the economy remains resilient',
		description:
			'A steady labor market and tight high-yield spreads suggest the economy remains resilient',
		width: 975,
		height: 452,
		xAxisConfig: {
			ticksConfig: {
				startDate: '2001-03-01',
				numTicks: 13,
				dateInterval: 'year',
				intervalStep: 2,
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
		width: 1452,
		height: 452,
		xAxisConfig: {
			ticksConfig: {
				startDate: '1995-03-01',
				numTicks: 11,
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
	'mega-cap': {
		title:
			'Mega-cap tech stocks have recently reversed course, decreasing the market concentration within these names',
		description:
			'This chart shows the concentration of the S&P 500 in the top 10 names, which peaked in late 2024.',
		width: 975,
		height: 452,
		marginAdjust: {
			right: 20,
		},
		xAxisConfig: {
			ticksConfig: {
				startDate: '1997-01-31',
				numTicks: 15,
				dateInterval: 'year',
				intervalStep: 2,
				dateFormat: '%Y',
			},
		},
		modules: [
			{
				type: ModuleType.LineChart,
				series: 0,
				side: YAxisSide.Left,
				color: ChartColor.Blue,
			},
		],
	},
}
