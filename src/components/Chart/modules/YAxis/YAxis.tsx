'use client'
import { memo, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMeasure } from '@uidotdev/usehooks'

import { getQuantTicks } from '@lib/chartUtils'
import { colors, fonts } from '@styles/theme'

import type { CSSProperties } from 'react'
import type { ScaleLinear } from 'd3'

import type { YAxisSide } from '@/enums'
import type { ChartMeasures, ChartModuleBasicProps, TickObject, YAxisConfig } from '@/types'

import './y-axis.scss'

type Props = ChartModuleBasicProps & {
	side: YAxisSide
	config: YAxisConfig
}

type SubProps = {
	side: YAxisSide
	ticks: TickObject<number>[]
	scale: ScaleLinear<number, number, never>
	label?: string
	guides: boolean
	hideTicks: boolean
	measures: ChartMeasures
	updateTicksWidth?: Function
	ticksWidth?: number
}
const tickAxisOffset = 10

const YAxis = ({ side, config, scales, measures, htmlRef }: Props) => {
	const [ticksWidth, setTicksWidth] = useState(0)

	const { ticksConfig, label, guideLines, hideTicks = false } = config
	const axisScale = scales.y[side]!
	const [min, max] = axisScale.domain()

	const ticks = ticksConfig
		? getQuantTicks(ticksConfig).filter(({ value }) => value >= min && value <= max)
		: []

	return (
		<>
			<Svg
				ticks={ticks}
				scale={axisScale!}
				side={side}
				measures={measures}
				label={label}
				guides={!!guideLines}
				hideTicks={!!hideTicks}
				ticksWidth={ticksWidth}
			></Svg>
			{htmlRef &&
				createPortal(
					<Html
						ticks={ticks}
						scale={axisScale!}
						side={side}
						measures={measures}
						label={label}
						guides={!!guideLines}
						hideTicks={!!hideTicks}
						updateTicksWidth={setTicksWidth}
					></Html>,
					htmlRef
				)}
		</>
	)
}

const Svg = memo(
	({ side, ticks, scale, label, guides, hideTicks, measures, ticksWidth }: SubProps) => {
		const { leftMargin, rightMargin, topMargin, plotWidth, plotHeight, width } = measures

		const tx = side === 'left' ? leftMargin : width
		return (
			<g transform={`translate(${tx}, ${topMargin})`}>
				{ticks.map(({ value, label }, id) => (
					<g key={id} transform={`translate(0, ${scale(value)})`}>
						{!hideTicks && (
							<text
								x={side === 'left' ? -tickAxisOffset : -rightMargin + (ticksWidth || 0)}
								fontFamily={fonts.manulife}
								fontSize='18'
								textAnchor='end'
								dominantBaseline='central'
								fill={colors.darkNavy}
								data-outlined='outlined'
							>
								{label}
							</text>
						)}
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
				{label && (
					<g transform={`translate(${side === 'left' ? -leftMargin : 0}, ${plotHeight / 2})`}>
						<text
							y={0}
							fontFamily={fonts.manulife}
							fontSize='18'
							textAnchor='middle'
							dominantBaseline={side === 'left' ? 'text-before-edge' : 'text-after-edge'}
							fill={colors.darkNavy}
							transform='rotate(-90)'
							data-outlined='outlined'
						>
							{label}
						</text>
					</g>
				)}
			</g>
		)
	}
)

const Html = memo(({ side, ticks, scale, label, hideTicks, updateTicksWidth }: SubProps) => {
	const [ticksRef, { width: ticksWidth }] = useMeasure()

	const style = { '--y-axis-tick-offset': `${tickAxisOffset}px` } as CSSProperties

	useEffect(() => {
		if (ticksWidth && updateTicksWidth) {
			updateTicksWidth(ticksWidth)
		}
	}, [ticksWidth])
	return (
		<div className='y-axis-html' data-side={side} data-has-label={!!label} style={style}>
			{label && (
				<div className='label-container'>
					<div className='label'>{label}</div>
				</div>
			)}
			{ticks.length > 0 && !hideTicks && (
				<div className='ticks-container' ref={ticksRef}>
					{ticks.map(({ value, label }, id) => (
						<div className='tick' key={id} style={{ transform: `translate(0, ${scale(value)}px)` }}>
							<div className='tick-inner'>{label}</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
})

export default YAxis
