'use client'
import { scaleLinear } from 'd3'
import { usePlotMeasure } from '@lib/usePlotMeasure'

import YAxis from './modules/YAxis'

import './chart.scss'
import { useRef } from 'react'

const moduleComponents = {
	yAxis: (key, props) => <YAxis key={key} {...props}></YAxis>,
}
const getLinearScale = (domain, range) => {
	return scaleLinear(domain, range)
}

const Chart = ({ data, config }) => {
	const [plotRef, dimensions] = usePlotMeasure()

	const htmlOverlay = useRef()

	const { width, height, scales, modules } = config

	const chartScales = {
		y: {
			left: scales.y.left ? getLinearScale(scales.y.left.domain, [height, 0]) : null,
			right: scales.y.right ? getLinearScale(scales.y.right.domain, [height, 0]) : null,
		},
	}
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
