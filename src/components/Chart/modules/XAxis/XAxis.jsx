'use client'
import { memo } from 'react'
import { createPortal } from 'react-dom'
import { timeFormat, timeDay, timeMonth, timeYear } from 'd3'

import './x-axis.scss'

const tickAxisOffset = 10

function dateTicks(config) {
	const { startDate, dateInterval, intervalStep, numTicks, dateFormat = '%b ʼ%y' } = config
	const intervals = {
		day: timeDay,
		month: timeMonth,
		year: timeYear,
	}

	const interval = intervals[dateInterval]
	if (!interval) {
		throw new Error('Invalid date interval')
	}
	const formatter = timeFormat(dateFormat)
	const intervalStartDate = typeof startDate === 'string' ? new Date(startDate) : startDate

	if (isNaN(intervalStartDate.getTime())) {
		throw new Error(`dateTicks - Invalid date: ${intervalStartDate}`)
	}

	return Array.from({ length: numTicks }, (_, i) => {
		const value = interval.offset(intervalStartDate, i * intervalStep)
		const label = formatter(value)

		return { value, label }
	})
}

const XAxis = ({ config, scales, measures, htmlRef }) => {
	const ticks = dateTicks(config)

	const axisScale = scales.x

	return (
		<>
			<Svg ticks={ticks} scale={axisScale} measures={measures}></Svg>
			{htmlRef && createPortal(<Html ticks={ticks} scale={axisScale}></Html>, htmlRef)}
		</>
	)
}

const Html = memo(({ side, ticks, scale, label }) => {
	return (
		<div
			className='x-axis-html'
			data-side={side}
			data-has-label={!!label}
			style={{ '--x-axis-tick-offset': `${tickAxisOffset}px` }}
		>
			<div className='ticks-container'>
				{ticks &&
					ticks.map(({ value, label }, id) => (
						<div className='tick' key={id} style={{ transform: `translate(${scale(value)}px, 0)` }}>
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
			{/* {ticks.map(({ value, label }, id) => (
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
			))} */}
		</g>
	)
})

export default XAxis
