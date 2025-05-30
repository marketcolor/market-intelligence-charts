'use client'

import type { CartesianChartScales, ChartDataEntry, ChartMeasures, ScaterPlotConfig } from '@/types'
import { ChartColor } from '@/enums'
import './scatter-plot.scss'
import TrendLine from './TrendLine'

type Props = {
	config: ScaterPlotConfig
	data: ChartDataEntry[]
	scales: CartesianChartScales
	measures: ChartMeasures
}

const ScatterPlot = ({ config, data, scales, measures }: Props) => {
	const { series, side, color, size, trendLine, trendLineColor } = config
	const { leftMargin, topMargin, plotHeight, plotWidth } = measures
	const yScale = scales.y[side]!
	const xScale = scales.x

	console.log(trendLine)

	return (
		<g transform={`translate(${leftMargin}, ${topMargin})`}>
			{data.map((d, id) => (
				<circle
					key={id}
					r={size / 2}
					cx={xScale(d[0] as any)}
					cy={yScale(d[series] as any)}
					fill={ChartColor[color]}
					stroke='#fff'
				></circle>
			))}
			{trendLine && (
				<TrendLine
					data={data}
					series={series}
					color={trendLineColor}
					xScale={xScale}
					yScale={yScale}
				></TrendLine>
			)}
		</g>
	)
}

export default ScatterPlot
