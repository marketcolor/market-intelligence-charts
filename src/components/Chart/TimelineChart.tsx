'use client'
import { useRef } from 'react'

import { usePlotMeasure } from '@lib/usePlotMeasure'
import { getTimeScale, getLinearScale } from '@/lib/chartUtils'

import YAxis from './modules/YAxis'
import XAxis from './modules/XAxis'

import './chart.scss'

import type { TimelineChartConfig, TimelineChartDataEntry, TimelineChartScales } from '@/types'
import { YAxisSide } from '@/enums'

type Props = {
	config: TimelineChartConfig
	data: TimelineChartDataEntry[]
}

// const moduleComponents = {
// 	yAxis: (key, props) => <YAxis key={key} {...props}></YAxis>,
// 	xAxis: (key, props) => <XAxis key={key} {...props}></XAxis>,
// }

const TimelineChart = ({ data, config }: Props) => {
	const { width, height, xAxisConfig, yAxisConfig } = config
	const [plotRef, dimensions] = usePlotMeasure(width, height)

	const htmlOverlay = useRef<HTMLDivElement>(null)

	const chartScales: TimelineChartScales = {
		y: {
			left: yAxisConfig.left
				? getLinearScale(yAxisConfig.left.domain, [dimensions.plotHeight, 0])
				: undefined,
			right: yAxisConfig.right
				? getLinearScale(yAxisConfig.right.domain, [dimensions.plotHeight, 0])
				: undefined,
		},
		x: getTimeScale(xAxisConfig.domain, [0, dimensions.plotWidth]),
	}

	const measures = {
		...dimensions,
		width,
		height,
	}

	// console.log(width)

	return (
		<div className='chart' style={{ width, height }}>
			<div className='overlay' ref={htmlOverlay}>
				<div className='left-margin-container'></div>
				<div className='right-margin-container'></div>
				<div className='top-margin-container'></div>
				<div className='bottom-margin-container'></div>
				{/* @ts-ignore */}
				<div className='plot-container' ref={plotRef}></div>
			</div>
			<svg className='chart' xmlns='http://www.w3.org/2000/svg' width={width} height={height}>
				{yAxisConfig.left && (
					<YAxis
						side={YAxisSide.Left}
						config={yAxisConfig.left}
						scales={chartScales}
						measures={measures}
						htmlRef={htmlOverlay}
					></YAxis>
				)}
				{yAxisConfig.right && (
					<YAxis
						side={YAxisSide.Right}
						config={yAxisConfig.right}
						scales={chartScales}
						measures={measures}
						htmlRef={htmlOverlay}
					></YAxis>
				)}
				{xAxisConfig && (
					<XAxis
						config={xAxisConfig}
						scales={chartScales}
						measures={measures}
						htmlRef={htmlOverlay}
					></XAxis>
				)}
				{/* {modules.map((module, id) =>
					moduleComponents[module.type](id, {
						config: module,
						scales: chartScales,
						measures,
						htmlRef: htmlOverlay.current,
					})
				)} */}
			</svg>
		</div>
	)
}

export default TimelineChart
