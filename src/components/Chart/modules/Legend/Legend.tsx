'use client'
import { memo, useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useMeasure } from '@uidotdev/usehooks'

import { colors, fonts } from '@/styles/theme'

import type { LegendConfig } from '@/types'

import './legend.scss'

type Props = {
	config: LegendConfig[]
	htmlRef: HTMLElement | null
}

type HtmlProps = {
	config: LegendConfig[]
	handleOffsets: Function
}

type ItemOffset = [number, number]
type SvgProps = {
	config: LegendConfig[]
	offsets: ItemOffset[]
}

const bottomOffset = 25

const Legend = ({ config, htmlRef }: Props) => {
	const [legendOffsets, setLegendOffsets] = useState<ItemOffset[]>([])
	const filteredConfig = config.filter((l) => !!l.show)

	return (
		<>
			<Svg config={filteredConfig} offsets={legendOffsets}></Svg>
			{htmlRef &&
				createPortal(<Html config={filteredConfig} handleOffsets={setLegendOffsets}></Html>, htmlRef)}
		</>
	)
}

const Html = memo(({ config, handleOffsets }: HtmlProps) => {
	const [ref, size] = useMeasure()

	useEffect(() => {
		if (size.width && size.height) {
			const legendItems = document.querySelectorAll<HTMLElement>('.legend-item')

			const offsets: ItemOffset[] = []
			legendItems.forEach((legend) => {
				offsets.push([legend.offsetLeft, legend.offsetTop + legend.offsetHeight / 2])
			})
			handleOffsets(offsets)
		}
	}, [size, handleOffsets])

	return (
		<div className='legend' style={{ '--bottom-offset': `${bottomOffset}px` } as CSSProperties}>
			<div className='legend-inner' ref={ref}>
				{config.map(({ text, color }, id) => (
					<div key={id} className='legend-item' style={{ '--legend-color': color } as CSSProperties}>
						<div className='bullet'></div>
						<div className='legend-text'>{text}</div>
					</div>
				))}
			</div>
		</div>
	)
})

const Svg = memo(({ config, offsets }: SvgProps) => {
	return (
		<g transform={`translate(0, 0)`}>
			{offsets.length &&
				config.map(({ text, color }, id) => (
					<g key={id} transform={`translate(${offsets[id][0]}, ${offsets[id][1]})`}>
						<rect fill={color} width={10} height={10} y={-5}></rect>
						<text
							x='19'
							fontFamily={fonts.manulife}
							fontSize='18'
							fill={colors.darkNavy}
							dominantBaseline='central'
						>
							{text}
						</text>
					</g>
				))}
		</g>
	)
})
export default Legend
