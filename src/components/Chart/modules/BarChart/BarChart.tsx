'use client'

import { colors as themeColors } from '@styles/theme'

import type { ChartMeasures, BarChartConfig, ChartDataEntry, CartesianChartScales } from '@/types'

type Props = {
	config: BarChartConfig
	data: ChartDataEntry[]
	scales: CartesianChartScales
	measures: ChartMeasures
}

import './bar-chart.scss'

const BarChart = ({ config, data, scales, measures }: Props) => {
	const { series, side, color, baseline } = config

	const yScale = scales.y[side]!
	const xScale = scales.x

	return <div className='bar-chart'>BarChart</div>
}

export default BarChart
