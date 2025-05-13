'use client'

import type {
	ChartMeasures,
	LineChartConfig,
	TimelineChartDataEntry,
	TimelineChartScales,
} from '@/types'
import './line-chart.scss'
import { getPathString } from '@/lib/chartUtils'
// import { colors } from '@/styles/theme'

type Props = {
	config: LineChartConfig
	data: TimelineChartDataEntry[]
	scales: TimelineChartScales
	measures: ChartMeasures
}

const LineChart = ({ config, data, scales, measures }: Props) => {
	const { series, side, colors } = config
	const { leftMargin, topMargin } = measures

	const yScale = scales.y[side]
	const xScale = scales.x

	return (
		<g transform={`translate(${leftMargin}, ${topMargin})`}>
			{series.map((key, id) => (
				<path
					key={key + 1}
					d={getPathString(data, 0, xScale, key + 1, yScale)!}
					fill='none'
					stroke={colors[id]}
					strokeWidth='3'
				></path>
			))}
		</g>
	)
}

export default LineChart
