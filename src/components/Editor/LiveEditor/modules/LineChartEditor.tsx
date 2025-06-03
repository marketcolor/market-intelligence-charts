import { useState, useEffect } from 'react'

import { useObjectState } from '@uidotdev/usehooks'
import { ChartColorOptions } from '@/lib/configUtils'

import { Select, ColorSelect, CheckboxInput, TextInput, NumberInput } from '../Inputs'

import type { LineChartConfig, ChartColorSchema } from '@/types'
import { YAxisSide, ChartColor } from '@/enums'

type LineChartProps = {
	config: LineChartConfig
	availableAxis: YAxisSide[]
	handleChange: Function
}

const LineChartEditor = ({ config, availableAxis, handleChange }: LineChartProps) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColorSchema>(config.color)

	const [legendText, setLegendText] = useState<string>(config.legend?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!config.legend?.hide)

	const [threshold, setThreshold] = useObjectState({
		active: !!config.threshold,
		value: config.threshold?.value || 0,
		bottomColor: config.threshold?.bottomColor || ChartColor.Green,
	})

	useEffect(() => {
		handleChange({
			...config,
			side,
			color,
			legend: {
				text: legendText,
				hide: !showLegend,
			},
			threshold: threshold.active
				? { value: threshold.value, bottomColor: threshold.bottomColor }
				: null,
		})
	}, [side, color, threshold, legendText, showLegend])

	return (
		<>
			<Select
				label='Axis side'
				value={config.side}
				options={availableAxis.map((s) => ({ value: s }))}
				//@ts-ignore
				handleChange={(v) => setSide(v)}
			></Select>
			<ColorSelect
				label='Color'
				value={config.color}
				options={ChartColorOptions}
				//@ts-ignore
				handleChange={(v) => setColor(v)}
			></ColorSelect>
			<CheckboxInput
				label='Show legend'
				value={!!showLegend}
				//@ts-ignore
				handleChange={(value) => setShowLegend(value)}
			></CheckboxInput>
			<TextInput
				label='Legend text'
				value={legendText}
				disabled={!showLegend}
				//@ts-ignore
				handleChange={(value) => setLegendText(value)}
			></TextInput>
			<CheckboxInput
				label='Threshold line?'
				value={threshold.active}
				//@ts-ignore
				handleChange={(value) => setThreshold(() => ({ active: value }))}
			></CheckboxInput>
			<NumberInput
				label='Threshold value'
				value={threshold.value}
				step={0.1}
				disabled={!threshold.active}
				//@ts-ignore
				handleChange={(value) => setThreshold(() => ({ value }))}
			></NumberInput>
			<ColorSelect
				label='Bottom color'
				value={threshold.bottomColor}
				options={ChartColorOptions}
				disabled={!threshold.active}
				//@ts-ignore
				handleChange={(value) => setThreshold(() => ({ bottomColor: value }))}
			></ColorSelect>
		</>
	)
}

export default LineChartEditor
