'use client'

import TrendLine from './TrendLine'

import type {
	CartesianChartScales,
	ChartDataEntry,
	ChartMeasures,
	ScatterPlotConfig,
} from '@/types'
import { ChartColor } from '@/enums'

import './scatter-plot.scss'

type Props = {
	config: ScatterPlotConfig
	data: ChartDataEntry[]
	scales: CartesianChartScales
	measures: ChartMeasures
}

const ScatterPlot = ({ config, data, scales, measures }: Props) => {
	const { series, side, color, size, trendLine, trendLineColor } = config
	const { leftMargin, topMargin } = measures
	const yScale = scales.y[side]!
	const xScale = scales.x

	return (
		<g transform={`translate(${leftMargin}, ${topMargin})`}>
			{data.map((d, id) => (
				<circle
					key={id}
					r={size / 2}
					cx={xScale(d[0] as any)}
					cy={yScale(d[series + 1] as any)}
					fill={ChartColor[color]}
					stroke='#fff'
				></circle>
			))}
			{trendLine && (
				<TrendLine
					data={data}
					series={series}
					color={trendLineColor || 'Blue'}
					xScale={xScale}
					yScale={yScale}
				></TrendLine>
			)}
		</g>
	)
}

export default ScatterPlot
