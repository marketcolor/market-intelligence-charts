'use client'
import { createPortal } from 'react-dom'
import { memo } from 'react'

import { getNumericTicks } from '@lib/chartUtils'
import { colors } from '@styles/theme'

import type { CSSProperties } from 'react'
import type { ScaleLinear } from 'd3'

import './y-axis.scss'
import type { YAxisSide } from '@/enums'
import type { ChartMeasures, ChartModuleBasicProps, TickObject, YAxisConfig } from '@/types'

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
	measures: ChartMeasures
}
const tickAxisOffset = 10

const YAxis = ({ side, config, scales, measures, htmlRef }: Props) => {
	const { ticksConfig, label, guideLines } = config

	const ticks = getNumericTicks(ticksConfig)

	const axisScale = scales.y[side]

	return (
		<>
			<Svg
				ticks={ticks}
				scale={axisScale!}
				side={side}
				measures={measures}
				label={label}
				guides={!!guideLines}
			></Svg>
			{htmlRef?.current &&
				createPortal(
					<Html
						ticks={ticks}
						scale={axisScale!}
						side={side}
						measures={measures}
						label={label}
						guides={!!guideLines}
					></Html>,
					htmlRef.current
				)}
		</>
	)
}

const Svg = memo(({ side, ticks, scale, guides, measures }: SubProps) => {
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

const Html = memo(({ side, ticks, scale, label }: SubProps) => {
	const style = { '--y-axis-tick-offset': `${tickAxisOffset}px` } as CSSProperties
	return (
		<div className='y-axis-html' data-side={side} data-has-label={!!label} style={style}>
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

export default YAxis
