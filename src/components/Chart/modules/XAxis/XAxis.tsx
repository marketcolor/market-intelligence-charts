'use client'
import { createPortal } from 'react-dom'
import { memo, useEffect, useState } from 'react'
import { useMeasure } from '@uidotdev/usehooks'

import { getXAxisTicks } from '@/lib/chartUtils'

import { colors, fonts } from '@styles/theme'

import type { CSSProperties } from 'react'

import type {
	CartesianXScales,
	ChartMeasures,
	ChartModuleBasicProps,
	TickObject,
	XAxisConfig,
} from '@/types'

import { ChartType } from '@/enums'

import './x-axis.scss'

const tickAxisOffset = 20
const labelOffset = 10

type Props = ChartModuleBasicProps & {
	type: ChartType
	config: XAxisConfig
}

type SubProps = {
	ticks: (TickObject<Date> | TickObject<number> | TickObject<string>)[]
	scale: CartesianXScales
	label?: string
	guides: boolean
	measures: ChartMeasures
	updateTicksHeight?: Function
	ticksHeight?: number
}

const XAxis = ({ type = ChartType.Time, config, scales, measures, htmlRef }: Props) => {
	const [tickHeight, setTicksHeight] = useState(0)

	const { guideLines, label } = config
	const axisScale = scales.x
	const [min, max] = axisScale.domain()

	const allTicks = getXAxisTicks(type, config, axisScale)

	const ticks =
		type === ChartType.Band ? allTicks : allTicks.filter(({ value }) => value >= min && value <= max)

	return (
		<>
			<Svg
				ticks={ticks}
				scale={axisScale}
				measures={measures}
				guides={!!guideLines}
				label={label}
				ticksHeight={tickHeight}
			></Svg>
			{htmlRef &&
				createPortal(
					<Html
						ticks={ticks}
						scale={axisScale}
						guides={!!guideLines}
						measures={measures}
						label={label}
						updateTicksHeight={setTicksHeight}
					></Html>,
					htmlRef
				)}
		</>
	)
}

const Html = memo(({ ticks, scale, label, updateTicksHeight }: SubProps) => {
	const [ticksRef, { height: ticksHeight }] = useMeasure()

	const style = {
		'--x-axis-tick-offset': `${tickAxisOffset}px`,
		'--x-axis-label-offset': `${labelOffset}px`,
	} as CSSProperties

	useEffect(() => {
		if (ticksHeight && updateTicksHeight) {
			updateTicksHeight(ticksHeight)
		}
	}, [ticksHeight])

	return (
		<div className='x-axis-html' data-has-label={!!label} style={style}>
			{label && (
				<div className='label-container'>
					<div className='label'>{label}</div>
				</div>
			)}
			{ticks && (
				<div className='ticks-container' ref={ticksRef}>
					{ticks.map(({ value, label }, id) => (
						<div
							className='tick'
							key={id}
							style={{ transform: `translate(${scale(value as any)}px, 0)` }}
						>
							<div className='tick-inner'>{label}</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
})

const Svg = memo(({ ticks, scale, guides, label, measures, ticksHeight }: SubProps) => {
	const { leftMargin, topMargin, plotHeight, plotWidth } = measures

	return (
		<g transform={`translate(${leftMargin}, ${topMargin + plotHeight})`}>
			{ticks.map(({ value, label }, id) => (
				<g key={id} transform={`translate(${scale(value as any)}, 0)`}>
					<text
						y={tickAxisOffset}
						fontFamily={fonts.manulife}
						fontSize='18'
						textAnchor='middle'
						dominantBaseline='text-before-edge'
						fill={colors.darkNavy}
						data-outlined='outlined'
					>
						{label}
					</text>
					{guides && (
						<line
							y1={0}
							y2={-plotHeight}
							fill='none'
							stroke={id === 0 ? colors.darkNavy : colors.darkNavy4}
							strokeWidth='.5'
						/>
					)}
				</g>
			))}
			{label && (
				<g transform={`translate(${plotWidth / 2}, ${(ticksHeight ?? 0) + labelOffset})`}>
					<text
						y={0}
						fontFamily={fonts.manulife}
						fontSize='18'
						textAnchor='middle'
						dominantBaseline='text-before-edge'
						fill={colors.darkNavy}
						data-outlined='outlined'
					>
						{label}
					</text>
				</g>
			)}
		</g>
	)
})

export default XAxis
