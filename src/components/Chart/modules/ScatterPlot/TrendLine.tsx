import { regressionLinear } from 'd3-regression'

import { ChartColor } from '@/enums'
import type { CartesianXScales, ChartColorSchema, ChartDataEntry } from '@/types'
import type { ScaleLinear } from 'd3'

const TrendLine = ({
	data,
	series,
	color,
	xScale,
	yScale,
}: {
	data: ChartDataEntry[]
	series: number
	color: ChartColorSchema
	xScale: CartesianXScales
	yScale: ScaleLinear<number, number, number>
}) => {
	const regression = regressionLinear()
		.x((d: number[]) => d[0])
		.y((d: number[]) => d[series])

	const regressionLine = regression(data)

	return (
		<line
			stroke={ChartColor[color]}
			strokeWidth={2.5}
			x1={xScale(regressionLine[0][0])}
			x2={xScale(regressionLine[1][0])}
			y1={yScale(regressionLine[0][1])}
			y2={yScale(regressionLine[1][1])}
		></line>
	)
}

export default TrendLine
