'use client'
import { getAreaString } from '@/lib/chartUtils'

import type {
	AreaChartConfig,
	ChartMeasures,
	TimelineChartDataEntry,
	TimelineChartScales,
} from '@/types'

type Props = {
	config: AreaChartConfig
	data: TimelineChartDataEntry[]
	scales: TimelineChartScales
	measures: ChartMeasures
}

const AreaChart = ({ config, data, scales, measures }: Props) => {
	const { series, side, color } = config
	const { leftMargin, topMargin, plotHeight, plotWidth } = measures

	const yScale = scales.y[side]!
	const xScale = scales.x

	return (
		<g>
			<defs>
				<clipPath id={`area-chart-clip-${series}`}>
					<rect width={plotWidth} height={plotHeight}></rect>
				</clipPath>
			</defs>
			<g
				transform={`translate(${leftMargin}, ${topMargin})`}
				clipPath={`url(#area-chart-clip-${series})`}
			>
				<path
					key={series + 1}
					d={getAreaString(data, 0, xScale, series + 1, yScale, plotHeight)!}
					fill={color}
				></path>
			</g>
		</g>
	)
}

export default AreaChart
