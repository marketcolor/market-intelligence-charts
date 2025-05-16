'use client'

import { useRef, useState } from 'react'
import { useObjectState } from '@uidotdev/usehooks'
import Session from 'svg-text-to-path'

import TimelineChart from '@/components/Chart'
import { ControlTab, InputBlock, NumberInput, DateInput, Select } from './Inputs'
import YAxisSideInput from './YAxisSideInput'

import { fonts } from '@styles/theme'
import './live-editor.scss'

import type { TimelineChartConfig, TimelineChartDataEntry, YAxisConfig } from '@/types'
import { YAxisSide } from '@/enums'

type Props = {
	data: TimelineChartDataEntry[]
	initialConfig: TimelineChartConfig
}

const defaultYAxisConfig: YAxisConfig = {
	domain: [0, 100],
	ticksConfig: {
		startVal: 0,
		numTicks: 11,
		tickInterval: 10,
		decimals: 0,
	},
	guideLines: false,
	label: '',
}

const LiveEditor = ({ data, initialConfig }: Props) => {
	const [config, setConfig] = useState<TimelineChartConfig>(structuredClone(initialConfig))

	const tempContainer = useRef<HTMLDivElement>(null)

	const [size, setSize] = useObjectState({
		width: initialConfig.width,
		height: initialConfig.height,
	})

	const [xAxisTicks, setXAxisTicks] = useObjectState({
		startDate: initialConfig.xAxisConfig.ticksConfig.startDate,
		numTicks: initialConfig.xAxisConfig.ticksConfig.numTicks,
		dateInterval: initialConfig.xAxisConfig.ticksConfig.dateInterval,
		intervalStep: initialConfig.xAxisConfig.ticksConfig.intervalStep,
		dateFormat: initialConfig.xAxisConfig.ticksConfig.dateFormat || '%m/%y',
	})

	const [yAxis, setYAxis] = useObjectState({
		left: initialConfig.yAxisConfig.left,
		right: initialConfig.yAxisConfig.right,
	})

	const updatedConfig: TimelineChartConfig = {
		...initialConfig,
		...size,
		xAxisConfig: {
			...initialConfig.xAxisConfig,
			ticksConfig: xAxisTicks,
		},
		yAxisConfig: yAxis,
	}

	const generateTempSvg = () => {
		if (tempContainer.current) {
			const tempEl = tempContainer.current
			const chartSvg = document.querySelector<SVGElement>('#chart')!
			const cloneSvg = chartSvg?.cloneNode(true) as SVGElement
			cloneSvg.removeAttribute('id')
			tempEl.append(cloneSvg)

			const baselineElements = tempEl.querySelectorAll<SVGAElement>('[dominant-baseline]')
			baselineElements.forEach((el) => {
				const rect = el.getBoundingClientRect()
				const { x, y } = rect
				el.removeAttribute('dominant-baseline')

				const newRect = el.getBoundingClientRect()

				if (newRect.y !== y) {
					const originalY = Number(el.getAttribute('y'))
					el.setAttribute('y', `${y - newRect.y + (originalY || 0)}`)
				}
				if (newRect.x !== x) {
					const originalY = Number(el.getAttribute('y'))
					el.setAttribute('y', `${x - newRect.x + (originalY || 0)}`)
				}
			})
			return cloneSvg
		}
	}

	const saveSvg = () => {
		const cloneSvg = generateTempSvg()
		if (cloneSvg) {
			initSvgDownload(cloneSvg.outerHTML)
			cleanup(cloneSvg)
		}
	}

	const saveOutlinedSvg = async () => {
		const cloneSvg = generateTempSvg()
		if (cloneSvg) {
			// @ts-ignore
			let session = new Session(cloneSvg, {
				fonts: {
					[fonts.manulife]: [
						{
							source: '../fonts/ManulifeJHSansOptimized.ttf',
						},
					],
				},
			})
			await session.replaceAll(['text[data-outlined]'])
			initSvgDownload(cloneSvg.outerHTML)
			cleanup(cloneSvg)
		}
	}

	const initSvgDownload = (svgString: string) => {
		const a = document.createElement('a')
		const blob = new Blob([svgString], { type: 'text/svg' })
		const url = URL.createObjectURL(blob)
		a.setAttribute('href', url)
		a.setAttribute('download', 'chart.svg')
		a.click()
	}

	const cleanup = (cloneSvg: SVGElement) => {
		cloneSvg.parentNode?.removeChild(cloneSvg)
	}
	// console.log(updatedConfig)

	return (
		<div className='live-editor'>
			<div className='actions'>
				<button onClick={saveSvg}>Save svg</button>
				<button onClick={saveOutlinedSvg}>Save outlined svg</button>
				<div className='temp-svg-container' ref={tempContainer}></div>
			</div>
			<div className='controls-container'>
				<ControlTab title='Size'>
					<InputBlock numColumns='3'>
						<NumberInput
							label='Width'
							value={size.width}
							min={400}
							max={1200}
							//@ts-ignore
							handleChange={(v) => setSize(() => ({ width: Number(v) }))}
						></NumberInput>
						<NumberInput
							label='Heigh'
							value={size.height}
							min={300}
							max={600}
							//@ts-ignore
							handleChange={(v) => setSize(() => ({ height: Number(v) }))}
						></NumberInput>
					</InputBlock>
				</ControlTab>
				<ControlTab title='X Axis Ticks'>
					<InputBlock>
						<DateInput
							label='Start'
							value={xAxisTicks.startDate}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ startDate: v }))}
						></DateInput>
						<NumberInput
							label='Ticks number'
							value={xAxisTicks.numTicks}
							min={2}
							hasRange={false}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ numTicks: v }))}
						></NumberInput>
						<NumberInput
							label='Step'
							value={xAxisTicks.intervalStep}
							min={1}
							hasRange={false}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ intervalStep: v }))}
						></NumberInput>
						<Select
							label='Date interval'
							value={xAxisTicks.dateInterval}
							options={[{ value: 'day' }, { value: 'month' }, { value: 'year' }]}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ dateInterval: v }))}
						></Select>
						<Select
							label='Date format'
							value={xAxisTicks.dateFormat}
							options={[
								{ value: '%m/%y', label: 'mm/yy' },
								{ value: '%m/%Y', label: 'mm/yyyy' },
								{ value: '%Y', label: 'yyyy' },
							]}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ dateFormat: v }))}
						></Select>
					</InputBlock>
				</ControlTab>
				<ControlTab title='Y Axis'>
					{yAxis.left ? (
						<YAxisSideInput
							side={YAxisSide.Left}
							initialConfig={yAxis.left}
							//@ts-ignore
							handleChange={(v) => setYAxis(() => ({ left: v }))}
						></YAxisSideInput>
					) : (
						<InputBlock numColumns='4'>
							<div>Left axis is not defined</div>
							<button
								//@ts-ignore
								onClick={() => setYAxis(() => ({ left: defaultYAxisConfig }))}
							>
								Click to create one
							</button>
						</InputBlock>
					)}
					{yAxis.right ? (
						<YAxisSideInput
							side={YAxisSide.Right}
							initialConfig={yAxis.right}
							//@ts-ignore
							handleChange={(v) => setYAxis(() => ({ right: v }))}
						></YAxisSideInput>
					) : (
						<InputBlock numColumns='4'>
							<div>Right axis is not defined</div>
							<button
								//@ts-ignore
								onClick={() => setYAxis(() => ({ right: defaultYAxisConfig }))}
							>
								Click to create one
							</button>
						</InputBlock>
					)}
				</ControlTab>
			</div>
			<div className='preview-container'>
				<TimelineChart data={data} config={updatedConfig}></TimelineChart>
			</div>
		</div>
	)
}

export default LiveEditor
