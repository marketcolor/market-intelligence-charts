'use client'
import { createPortal } from 'react-dom'
import { memo } from 'react'
import { range, format } from 'd3'

import { colors } from '@styles/theme'

import './y-axis.scss'

const tickAxisOffset = 10

const YAxis = ({ config, scales, measures, htmlRef }) => {
	const { side, scale, ticksRange, label, ticksFormat, guides } = config

	const ticksFormatter = format(ticksFormat)
	const ticks = range(...ticksRange).map((value) => ({ value, label: ticksFormatter(value) }))

	const axisScale = scales.y[scale]

	return (
		<>
			<Svg ticks={ticks} scale={axisScale} side={side} measures={measures} guides={guides}></Svg>
			{htmlRef && createPortal(<Html ticks={ticks} scale={axisScale} side={side}></Html>, htmlRef)}
		</>
	)
}

const Html = memo(({ side, ticks, scale, label }) => {
	return (
		<div
			className='y-axis-html'
			data-side={side}
			data-has-label={!!label}
			style={{ '--y-axis-tick-offset': `${tickAxisOffset}px` }}
		>
			{label && (
				<div className='label-container'>
					<div className='label'>{label}</div>
				</div>
			)}
			<div className='ticks-container'>
				{ticks &&
					ticks.map(({ value, label }, id) => (
						<div className='tick' key={id} style={{ transform: `translate(0, ${scale(value)}px)` }}>
							<div className='tick-inner'>{label}</div>
						</div>
					))}
			</div>
		</div>
	)
})

const Svg = memo(({ side, ticks, scale, guides, measures }) => {
	const { leftMargin, rightMargin, plotWidth, width } = measures

	const tx = side === 'left' ? leftMargin : width
	return (
		<g transform={`translate(${tx}, 0)`}>
			{ticks.map(({ value, label }, id) => (
				<g key={id} transform={`translate(0, ${scale(value)})`}>
					<text
						x={side === 'left' ? -tickAxisOffset : 0}
						fontFamily='Manulife'
						fontSize='18'
						textAnchor='end'
						dominantBaseline='central'
						fill={colors.darkNavy}
					>
						{label}
					</text>
					{guides && (
						<line
							x1={side === 'left' ? 0 : -rightMargin}
							x2={side === 'left' ? plotWidth : -plotWidth - rightMargin}
							fill='none'
							stroke={id === 0 ? colors.darkNavy : colors.darkNavy4}
							strokeWidth='.5'
						/>
					)}
				</g>
			))}
		</g>
	)
})

export default YAxis
