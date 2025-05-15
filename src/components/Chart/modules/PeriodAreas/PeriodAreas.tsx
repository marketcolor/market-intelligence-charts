'use client'

import { getPeriodAreaString } from '@/lib/chartUtils'
import { colors } from '@/styles/theme'

import type {
	ChartMeasures,
	PeriodAreasConfig,
	TimelineChartDataEntry,
	TimelineChartScales,
} from '@/types'

import './period-areas.scss'

type Props = {
	config: PeriodAreasConfig
	data: TimelineChartDataEntry[]
	scales: TimelineChartScales
	measures: ChartMeasures
}

const PeriodAreas = ({ config, data, scales, measures }: Props) => {
	const { series } = config
	const { topMargin, leftMargin, plotHeight } = measures
	const xScale = scales.x

	return (
		<g transform={`translate(${leftMargin}, ${topMargin})`}>
			<path
				d={getPeriodAreaString(data, 0, xScale, series + 1, plotHeight)!}
				fill={colors.recessionGrey}
			></path>
		</g>
	)
}

export default PeriodAreas
