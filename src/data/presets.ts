//@ts-nocheck
import { ChartType, ModuleType, YAxisSide } from '@/enums'
import type { ChartConfig } from '@/types'

type Preset = Partial<ChartConfig>
type Presets = {
	[key: string]: Preset
}

export const presets: Presets = {
	'fdic-national-averages': {
		type: ChartType.Band,
		title: 'The yield on bonds is significantly higher than the other categories.',
		description:
			"This chart shows the current rates on savings accounts, money markets, 12-month CD's, and bonds. The yield on bonds is significantly higher than the other categories.",
		width: 402,
		height: 452,
		marginAdjust: {
			left: 15,
			right: 15,
			top: 15,
		},
		xAxisConfig: {
			ticksConfig: {
				fontSize: 'small',
			},
		},
		yAxisConfig: {
			left: {
				hideTicks: true,
				domain: [0, 4.6],
				guideLines: false,
			},
		},
		modules: [
			{
				type: ModuleType.BarChart,
				series: 0,
				side: YAxisSide.Left,
				color: 'Blue',
				barWidth: 80,
				labels: {
					suffix: '%',
					inside: true,
					format: {
						decimals: 2,
					},
				},
				baseline: {
					value: 0,
					extend: 10,
				},
				legend: {
					text: 'Interest rates',
					hide: true,
				},
			},
		],
	},
	'fed-funds': {
		type: ChartType.Time,
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
				color: 'Green',
			},
			{
				type: ModuleType.LineChart,
				series: 1,
				side: YAxisSide.Left,
				color: 'Blue',
			},
			{
				type: ModuleType.PeriodAreas,
				series: 2,
			},
		],
	},
	'labor-market': {
		type: ChartType.Time,
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
				color: 'Green',
			},
			{
				type: ModuleType.LineChart,
				series: 1,
				side: YAxisSide.Right,
				color: 'Blue',
			},
		],
	},
	lei: {
		type: ChartType.Time,
		title: 'YoY change in the LEI (%)',
		description:
			'The graph shows the year-over-year change in LEI since 1970. Currently, the year-over-year change in LEI has been negative since July 2022, indicating economic growth may slow.',
		width: 975,
		height: 495,
		modules: [
			{
				type: ModuleType.AreaChart,
				series: 0,
				side: YAxisSide.Left,
				color: 'Green',
				baseline: {
					value: 0,
					bottomColor: 'Blue',
				},
				legend: {
					text: 'USA - Leading Economic Index (YoY%)',
					hide: true,
				},
				curve: 'step',
			},
			{
				type: ModuleType.PeriodAreas,
				series: 1,
				legend: {
					text: 'Recessions',
				},
			},
		],
	},

	'mega-cap': {
		type: ChartType.Time,
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
				color: 'Blue',
			},
		],
	},
	'money-market': {
		type: ChartType.Time,
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
				color: 'Green',
			},
			{
				type: ModuleType.PeriodAreas,
				series: 1,
				legend: {
					text: 'Recession',
				},
			},
		],
	},
	'non-us-earnings': {
		type: ChartType.Time,
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
				color: 'Green',
			},
			{
				type: ModuleType.LineChart,
				series: 1,
				side: YAxisSide.Right,
				color: 'Blue',
			},
		],
	},
	's&p-midcap': {
		type: ChartType.Time,
		title: 's&p-midcap',
		description:
			'This chart shows the S&P MidCap 400 Index P/E ratio relative to the S&P 500 Index P/E ratio. The chart shows that mid caps are trading at a substantial discount to large cap equities.',
		width: 975,
		height: 495,
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
		yAxisConfig: {
			left: {
				ticksConfig: {
					format: {
						decimals: 1,
					},
				},
			},
		},
		modules: [
			{
				type: ModuleType.LineChart,
				series: 0,
				side: YAxisSide.Left,
				color: 'Blue',
				showLegend: false,
				threshold: {
					value: 1.0,
					bottomColor: 'Green',
				},
			},
		],
	},
	's&p-midcap-fr': {
		type: ChartType.Time,
		title: 's&p-midcap',
		description:
			'This chart shows the S&P MidCap 400 Index P/E ratio relative to the S&P 500 Index P/E ratio. The chart shows that mid caps are trading at a substantial discount to large cap equities.',
		width: 975,
		height: 495,
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
		yAxisConfig: {
			left: {
				ticksConfig: {
					format: {
						decimals: 1,
						locale: 'eu',
					},
				},
			},
		},
		modules: [
			{
				type: ModuleType.LineChart,
				series: 0,
				side: YAxisSide.Left,
				color: 'Blue',
				showLegend: false,
				threshold: {
					value: 1.0,
					bottomColor: 'Green',
				},
			},
		],
	},
	'starting-yield': {
		type: ChartType.Quant,
		title: 'Correlation between five-year total return and starting yield',
		description:
			"This chart shows the correlation between five-year total return and starting yield to maturity for the Bloomberg U.S. Aggregate bond index. The two measures are linked, with starting yield explaining 89% of a bond's performance.",
		width: 1089,
		height: 495,
		xAxisConfig: {
			domain: [0, 18],
			ticksConfig: {
				startVal: 0,
				numTicks: 10,
				tickInterval: 2,
				decimals: 0,
			},
			guideLines: true,
			label: 'Bloomberg U.S. Aggregate Bond Index yield to maturity',
		},
		yAxisConfig: {
			left: {
				domain: [-2, 22],
				guideLines: true,
				ticksConfig: {
					startVal: -2,
					numTicks: 15,
					tickInterval: 2,
					format: {
						decimals: 0,
					},
				},
				label: '5-year total return',
			},
		},
		modules: [
			{
				type: ModuleType.ScatterPlot,
				series: 0,
				side: YAxisSide.Left,
				color: 'Green',
				size: 12,
				trendLine: true,
				trendLineColor: 'Blue',
				legend: {
					text: 'Fed funds target rate (%)',
					hide: true,
				},
			},
		],
	},

	'stock-prices': {
		type: ChartType.Time,
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
				color: 'Green',
			},
			{
				type: ModuleType.LineChart,
				series: 1,
				side: YAxisSide.Right,
				color: 'Blue',
			},
		],
	},
}
