'use client'
import { useRef } from 'react'

import { usePlotMeasure } from '@lib/usePlotMeasure'
import { getTimeScale, getLinearScale } from '@/lib/chartUtils'

import YAxis from './modules/YAxis'
import XAxis from './modules/XAxis'
import LineChart from './modules/LineChart'
import AreaChart from './modules/AreaChart'
import PeriodAreas from './modules/PeriodAreas'

import './chart.scss'

import type { TimelineChartConfig, TimelineChartDataEntry, TimelineChartScales } from '@/types'
import { YAxisSide } from '@/enums'
import Legend from './modules/Legend'

type Props = {
	config: TimelineChartConfig
	data: TimelineChartDataEntry[]
	series: string[]
}

const moduleComponents = {
	lineChart: (key: number, props: any) => <LineChart key={key} {...props}></LineChart>,
	areaChart: (key: number, props: any) => <AreaChart key={key} {...props}></AreaChart>,
	periodAreas: (key: number, props: any) => <PeriodAreas key={key} {...props}></PeriodAreas>,
}

const TimelineChart = ({ data, series, config }: Props) => {
	const { width, height, marginAdjust, xAxisConfig, yAxisConfig, legend, modules } = config
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

	const style = {
		width,
		height,
		'--margin-left': `${marginAdjust?.left || 0}px`,
		'--margin-right': `${marginAdjust?.right || 0}px`,
		'--margin-top': `${marginAdjust?.top || 0}px`,
		'--margin-bottom': `${marginAdjust?.bottom || 0}px`,
	}

	return (
		<div className='chart' style={style}>
			<div className='overlay' ref={htmlOverlay}>
				<div className='left-margin-container'></div>
				<div className='right-margin-container'></div>
				<div className='top-margin-container'></div>
				<div className='bottom-margin-container'></div>
				{/* @ts-ignore */}
				<div className='plot-container' ref={plotRef}></div>
			</div>
			<svg className='chart' xmlns='http://www.w3.org/2000/svg' width={width} height={height}>
				{legend && <Legend config={legend} htmlRef={htmlOverlay.current}></Legend>}
				{yAxisConfig.left && (
					<YAxis
						side={YAxisSide.Left}
						config={yAxisConfig.left}
						scales={chartScales}
						measures={measures}
						htmlRef={htmlOverlay.current}
					></YAxis>
				)}
				{yAxisConfig.right && (
					<YAxis
						side={YAxisSide.Right}
						config={yAxisConfig.right}
						scales={chartScales}
						measures={measures}
						htmlRef={htmlOverlay.current}
					></YAxis>
				)}
				{xAxisConfig && (
					<XAxis
						config={xAxisConfig}
						scales={chartScales}
						measures={measures}
						htmlRef={htmlOverlay.current}
					></XAxis>
				)}
				{modules &&
					modules.map((module, id) =>
						moduleComponents[module.type](id, {
							config: module,
							scales: chartScales,
							measures,
							data,
							htmlRef: htmlOverlay.current,
						})
					)}
			</svg>
		</div>
	)
}

export default TimelineChart
