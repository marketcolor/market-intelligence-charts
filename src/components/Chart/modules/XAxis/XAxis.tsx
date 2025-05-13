'use client'
import { createPortal } from 'react-dom'
import { memo } from 'react'

import { getDateTicks } from '@/lib/chartUtils'

import type { CSSProperties } from 'react'
import type { ScaleTime } from 'd3'
import type { ChartMeasures, ChartModuleBasicProps, TickObject, TimelineXAxisConfig } from '@/types'

import { colors } from '@styles/theme'
import './x-axis.scss'

const tickAxisOffset = 20

type Props = ChartModuleBasicProps & {
	config: TimelineXAxisConfig
}

type SubProps = {
	ticks: TickObject<Date>[]
	scale: ScaleTime<number, number, never>
	label?: string
	guides: boolean
	measures: ChartMeasures
}

const XAxis = ({ config, scales, measures, htmlRef }: Props) => {
	const { ticksConfig, guideLines } = config
	const ticks = getDateTicks(ticksConfig)

	const axisScale = scales.x

	return (
		<>
			<Svg ticks={ticks} scale={axisScale} measures={measures} guides={!!guideLines}></Svg>
			{htmlRef &&
				createPortal(
					<Html ticks={ticks} scale={axisScale} guides={!!guideLines} measures={measures}></Html>,
					htmlRef
				)}
		</>
	)
}

const Html = memo(({ ticks, scale, label }: SubProps) => {
	const style = { '--x-axis-tick-offset': `${tickAxisOffset}px` } as CSSProperties
	return (
		<div className='x-axis-html' data-has-label={!!label} style={style}>
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

const Svg = memo(({ ticks, scale, guides, measures }: SubProps) => {
	const { leftMargin, topMargin, plotHeight } = measures

	return (
		<g transform={`translate(${leftMargin}, ${topMargin + plotHeight})`}>
			{ticks.map(({ value, label }, id) => (
				<g key={id} transform={`translate(${scale(value)}, 0)`}>
					<text
						y={tickAxisOffset}
						fontFamily='Manulife'
						fontSize='18'
						textAnchor='middle'
						dominantBaseline='text-before-edge'
						fill={colors.darkNavy}
					>
						{label}
					</text>
				</g>
			))}
		</g>
	)
})

export default XAxis
