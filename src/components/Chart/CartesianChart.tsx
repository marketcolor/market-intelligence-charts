'use client'
import { useRef } from 'react'

import { usePlotMeasure } from '@lib/usePlotMeasure'
import { getLinearScale, getCartesianXScale, getXAxisBandwidth } from '@/lib/chartUtils'

import Legend from './modules/Legend'

import YAxis from './modules/YAxis'
import XAxis from './modules/XAxis'

import LineChart from './modules/LineChart'
import AreaChart from './modules/AreaChart'
import BarChart from './modules/BarChart'
import PeriodAreas from './modules/PeriodAreas'
import ScatterPlot from './modules/ScatterPlot'

import './chart.scss'

import type {
	Modules,
	ChartDataEntry,
	CartesianChartScales,
	ChartConfig,
	LegendConfig,
} from '@/types'

import { ChartType, ModuleType, YAxisSide } from '@/enums'
import { useSvgMeasure } from '@/lib/useSvgMeasure'

type Props = {
	config: ChartConfig
	data: ChartDataEntry[]
}

const moduleComponents = {
	lineChart: (key: number, props: any) => <LineChart key={key} {...props}></LineChart>,
	areaChart: (key: number, props: any) => <AreaChart key={key} {...props}></AreaChart>,
	barChart: (key: number, props: any) => <BarChart key={key} {...props}></BarChart>,
	scatterPlot: (key: number, props: any) => <ScatterPlot key={key} {...props}></ScatterPlot>,
	periodAreas: (key: number, props: any) => <PeriodAreas key={key} {...props}></PeriodAreas>,
}

const modulesOrder = ['periodAreas', 'areaChart', 'scatterPlot', 'lineChart']
const modulesSorter = (ma: Modules, mb: Modules) => {
	return modulesOrder.indexOf(ma.type) - modulesOrder.indexOf(mb.type)
}

const CartesianChart = ({ data, config }: Props) => {
	const {
		type,
		title,
		description,
		width,
		height,
		marginAdjust,
		xAxisConfig,
		yAxisConfig,
		modules,
	} = config

	const [plotRef, dimensions] = usePlotMeasure(width, height)
	const [svgRef, { svgRight, svgLeft, svgBottom, svgTop }] = useSvgMeasure(width, height)

	const htmlOverlay = useRef<HTMLDivElement>(null)

	const xScaleBandwidth: number =
		type === ChartType.Band && !!modules ? getXAxisBandwidth(modules) : 0

	const chartScales: CartesianChartScales = {
		y: {
			left: yAxisConfig.left
				? getLinearScale(yAxisConfig.left.domain!, [dimensions.plotHeight, 0])
				: undefined,
			right: yAxisConfig.right
				? getLinearScale(yAxisConfig.right.domain!, [dimensions.plotHeight, 0])
				: undefined,
		},
		x: getCartesianXScale(type, data, [0, dimensions.plotWidth], xAxisConfig, xScaleBandwidth),
	}

	const measures = {
		...dimensions,
		width,
		height,
	}

	const style = {
		width,
		height,
		'--margin-left': `${Math.max(marginAdjust?.left || 0, svgLeft, 0)}px`,
		'--margin-right': `${Math.max(marginAdjust?.right || 0, svgRight, 0)}px`,
		'--margin-top': `${Math.max(marginAdjust?.top || 0, svgTop, 0)}px`,
		'--margin-bottom': `${Math.max(marginAdjust?.bottom || 0, svgBottom, 0)}px`,
	}

	const underModules = modules?.filter((m) => m.type === 'periodAreas')
	const overModules = modules?.filter((m) => m.type !== 'periodAreas').sort(modulesSorter)

	const legend =
		modules &&
		modules.map(
			(m) =>
				({
					text: m.legend.text,
					color: m.type === ModuleType.PeriodAreas ? 'RecessionGrey' : m.color,
					hide: m.legend.hide,
				} as LegendConfig)
		)

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
			<svg id='chart' xmlns='http://www.w3.org/2000/svg' width={width} height={height}>
				{title && <title id='mi-chart-title'>{title}</title>}
				{description && <desc id='mi-chart-description'>{description}</desc>}
				<g ref={svgRef}>
					{legend?.length && <Legend config={legend} htmlRef={htmlOverlay.current}></Legend>}
					{underModules &&
						underModules.map((module, id) =>
							moduleComponents[module.type](id, {
								config: module,
								scales: chartScales,
								measures,
								data,
								htmlRef: htmlOverlay.current,
							})
						)}
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
							type={type}
							config={xAxisConfig}
							scales={chartScales}
							measures={measures}
							htmlRef={htmlOverlay.current}
						></XAxis>
					)}
				</g>
				{overModules?.length &&
					overModules.map((module, id) =>
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

export default CartesianChart
