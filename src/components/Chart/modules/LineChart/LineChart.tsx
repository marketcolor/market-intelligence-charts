'use client'

import { getPathString } from '@/lib/chartUtils'

import { colors as themeColors } from '@styles/theme'
import type {
	ChartMeasures,
	LineChartConfig,
	TimelineChartDataEntry,
	TimelineChartScales,
} from '@/types'
import { ChartColor } from '@/enums'

type Props = {
	config: LineChartConfig
	data: TimelineChartDataEntry[]
	scales: TimelineChartScales
	measures: ChartMeasures
}

const LineChart = ({ config, data, scales, measures }: Props) => {
	const { series, side, color, threshold } = config
	const { leftMargin, topMargin, plotHeight, plotWidth } = measures

	const yScale = scales.y[side]!
	const xScale = scales.x

	return (
		<g>
			<defs>
				<clipPath id={`line-chart-clip-${series}`}>
					<rect width={plotWidth} height={plotHeight}></rect>
				</clipPath>
				{threshold && (
					<linearGradient
						gradientUnits='userSpaceOnUse'
						id={`threshold-gradient-${series}`}
						x1={0}
						x2={0}
						y1={0}
						y2={plotHeight}
					>
						<stop
							offset={yScale(threshold.value) / plotHeight}
							//@ts-ignore
							stopColor={ChartColor[color]}
						></stop>
						<stop
							offset={yScale(threshold.value) / plotHeight}
							//@ts-ignore
							stopColor={ChartColor[threshold.bottomColor]}
						></stop>
					</linearGradient>
				)}
			</defs>
			<g
				transform={`translate(${leftMargin}, ${topMargin})`}
				clipPath={`url(#line-chart-clip-${series})`}
			>
				{threshold && (
					<line
						x2={plotWidth}
						y1={yScale(threshold.value)}
						y2={yScale(threshold.value)}
						fill='none'
						stroke={themeColors.dark}
					></line>
				)}
				<path
					key={series + 1}
					d={getPathString(data, 0, xScale, series + 1, yScale)!}
					fill='none'
					//@ts-ignore
					stroke={threshold ? `url(#threshold-gradient-${series})` : ChartColor[color]}
					strokeWidth='2.5'
				></path>
			</g>
		</g>
	)
}

export default LineChart
