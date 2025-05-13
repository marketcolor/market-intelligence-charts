'use client'

import type {
	ChartMeasures,
	PeriodAreasConfig,
	TimelineChartDataEntry,
	TimelineChartScales,
} from '@/types'
import './period-areas.scss'
import { getPeriodAreaString } from '@/lib/chartUtils'

type Props = {
	config: PeriodAreasConfig
	data: TimelineChartDataEntry[]
	scales: TimelineChartScales
	measures: ChartMeasures
}

const PeriodAreas = ({ config, data, scales, measures }: Props) => {
	const { series, color } = config
	const { topMargin, leftMargin, plotWidth, plotHeight } = measures
	const xScale = scales.x

	return (
		<g transform={`translate(${leftMargin}, ${topMargin})`}>
			<path d={getPeriodAreaString(data, 0, xScale, series + 1, plotHeight)!} fill={color}></path>
		</g>
	)
}

export default PeriodAreas
