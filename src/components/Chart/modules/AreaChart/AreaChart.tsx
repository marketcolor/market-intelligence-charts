'use client'

import { getAreaString } from '@/lib/chartUtils'
import { colors as themeColors } from '@/styles/theme'

import type {
	AreaChartConfig,
	ChartMeasures,
	TimelineChartDataEntry,
	TimelineChartScales,
} from '@/types'
import { ChartColor } from '@/enums'

type Props = {
	config: AreaChartConfig
	data: TimelineChartDataEntry[]
	scales: TimelineChartScales
	measures: ChartMeasures
}

const AreaChart = ({ config, data, scales, measures }: Props) => {
	const { series, side, color, baseline, curve } = config
	const { leftMargin, topMargin, plotHeight, plotWidth } = measures

	const yScale = scales.y[side]!
	const xScale = scales.x

	const baselineValue = !!baseline ? yScale(baseline.value) : plotHeight

	return (
		<g>
			<defs>
				<clipPath id={`area-chart-clip-${series}`}>
					<rect width={plotWidth} height={plotHeight}></rect>
				</clipPath>
				{baseline?.bottomColor && (
					<linearGradient
						gradientUnits='userSpaceOnUse'
						id={`area-baseline-gradient-${series}`}
						x1={0}
						x2={0}
						y1={0}
						y2={plotHeight}
					>
						<stop
							offset={yScale(baseline.value) / plotHeight}
							// @ts-ignore
							stopColor={ChartColor[color]}
						></stop>
						<stop
							offset={yScale(baseline.value) / plotHeight}
							// @ts-ignore
							stopColor={ChartColor[baseline.bottomColor]}
						></stop>
					</linearGradient>
				)}
			</defs>
			<g
				transform={`translate(${leftMargin}, ${topMargin})`}
				clipPath={`url(#area-chart-clip-${series})`}
			>
				<path
					key={series + 1}
					d={getAreaString(data, 0, xScale, series + 1, yScale, baselineValue, curve)!}
					// @ts-ignore
					fill={baseline?.bottomColor ? `url(#area-baseline-gradient-${series})` : ChartColor[color]}
				></path>
				{baseline && (
					<line
						x2={plotWidth}
						y1={baselineValue}
						y2={baselineValue}
						fill='none'
						stroke={themeColors.dark}
					></line>
				)}
			</g>
		</g>
	)
}

export default AreaChart
