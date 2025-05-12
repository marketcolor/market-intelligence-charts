'use client'
import { scaleLinear } from 'd3'
import { usePlotMeasure } from '@lib/usePlotMeasure'

import YAxis from './modules/YAxis'
import XAxis from './modules/XAxis'

import './chart.scss'
import { useRef } from 'react'

const moduleComponents = {
	yAxis: (key, props) => <YAxis key={key} {...props}></YAxis>,
	xAxis: (key, props) => <XAxis key={key} {...props}></XAxis>,
}

const getLinearScale = (domain, range) => {
	return scaleLinear(domain, range)
}

const getTimeScale = (domain, range) => {
	const timeDomain = domain.map((d) => new Date(d))
	return scaleLinear(timeDomain, range)
}

const Chart = ({ data, config }) => {
	const { width, height, scales, modules } = config
	const [plotRef, dimensions] = usePlotMeasure(width, height)

	const htmlOverlay = useRef()

	const chartScales = {
		y: {
			left: scales.y.left ? getLinearScale(scales.y.left.domain, [dimensions.plotHeight, 0]) : null,
			right: scales.y.right ? getLinearScale(scales.y.right.domain, [dimensions.plotHeight, 0]) : null,
		},
		x: getTimeScale(scales.x.domain, [0, dimensions.plotWidth]),
	}
	console.log(dimensions)

	const measures = {
		...dimensions,
		width,
		height,
	}

	return (
		<div className='chart' style={{ width, height }}>
			<div className='overlay' ref={htmlOverlay}>
				<div className='left-margin-container'></div>
				<div className='right-margin-container'></div>
				<div className='top-margin-container'></div>
				<div className='bottom-margin-container'></div>
				<div className='plot-container' ref={plotRef}></div>
			</div>
			<svg className='chart' xmlns='http://www.w3.org/2000/svg' width={width} height={height}>
				{modules.map((module, id) =>
					moduleComponents[module.type](id, {
						config: module,
						scales: chartScales,
						measures,
						htmlRef: htmlOverlay.current,
					})
				)}
			</svg>
		</div>
	)
}

export default Chart
