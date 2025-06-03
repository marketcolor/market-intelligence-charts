'use client'

import { numberFormatter } from '@/lib/chartUtils'

import { fonts, colors as themeColors } from '@styles/theme'

import type {
	ChartMeasures,
	BarChartConfig,
	ChartDataEntry,
	CartesianChartScales,
	CartesianYScales,
} from '@/types'

import { ChartColor } from '@/enums'

import './bar-chart.scss'

type Props = {
	config: BarChartConfig
	data: ChartDataEntry[]
	scales: CartesianChartScales
	measures: ChartMeasures
}

const Bar = ({
	value,
	xPos,
	yScale,
	barWidth,
	plotHeight,
	color,
	labels,
	formatter,
}: {
	value: number
	xPos: number
	yScale: CartesianYScales
	barWidth: number
	plotHeight: number
	color: string
	labels: BarChartConfig['labels']
	formatter: Function
}) => {
	const barHeight = yScale(value as any)

	return (
		<g transform={`translate(${xPos})`}>
			<rect
				x={-barWidth / 2}
				width={barWidth}
				y={barHeight}
				height={plotHeight - barHeight}
				fill={color}
			></rect>
			{!labels?.hide && (
				<text
					fontFamily={fonts.manulife}
					fontSize='20'
					fontWeight='bold'
					textAnchor='middle'
					dominantBaseline={labels?.inside ? 'text-before-edge' : 'text-after-edge'}
					fill={labels?.inside ? themeColors.white : themeColors.dark}
					data-outlined='outlined'
					y={barHeight}
				>
					{formatter(value)}
				</text>
			)}
		</g>
	)
}

const BarChart = ({ config, data, scales, measures }: Props) => {
	const { series, side, color, barWidth, labels, baseline } = config

	const { leftMargin, topMargin, plotHeight, plotWidth } = measures

	const yScale = scales.y[side]!
	const xScale = scales.x

	const baselineValue = !!baseline ? yScale(baseline.value) : plotHeight
	const baselineExtend = baseline?.extend || 0
	const labelsFormatter = numberFormatter(labels?.decimals || 0, '', labels?.suffix)

	return (
		<g>
			<defs>
				<clipPath id={`bar-chart-clip-${series}`}>
					<rect width={plotWidth} height={plotHeight}></rect>
				</clipPath>
			</defs>
			<g
				transform={`translate(${leftMargin}, ${topMargin})`}
				clipPath={`url(#bar-chart-clip-${series})`}
			>
				{data.map((entry, id) => (
					<Bar
						key={id}
						value={entry[series + 1] as number}
						xPos={xScale(entry[0] as any)!}
						yScale={yScale}
						barWidth={barWidth}
						plotHeight={plotHeight}
						color={ChartColor[color]}
						labels={labels}
						formatter={labelsFormatter}
					></Bar>
				))}
			</g>
			{baseline && (
				<g transform={`translate(${leftMargin}, ${topMargin})`}>
					<line
						x1={-baselineExtend}
						x2={plotWidth + baselineExtend}
						y1={baselineValue}
						y2={baselineValue}
						fill='none'
						stroke={themeColors.dark}
					></line>
				</g>
			)}
		</g>
	)
}

export default BarChart
