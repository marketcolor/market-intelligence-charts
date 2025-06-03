import { useState, useEffect } from 'react'

import { ChartColorOptions } from '@/lib/configUtils'
import { useObjectState } from '@uidotdev/usehooks'

import { CheckboxInput, ColorSelect, NumberInput, Select, TextInput } from '../Inputs'

import type { AreaChartConfig, ChartColorSchema } from '@/types'
import { YAxisSide, ChartColor } from '@/enums'

type AreaChartProps = {
	config: AreaChartConfig
	availableAxis: YAxisSide[]
	handleChange: Function
}

const AreaChartEditor = ({ config, availableAxis, handleChange }: AreaChartProps) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColorSchema>(config.color)
	const [legendText, setLegendText] = useState<string>(config.legend?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!config.legend?.hide)

	const [baseline, setBaseline] = useObjectState({
		active: !!config.baseline,
		value: config.baseline?.value || 0,
		bottomColor: config.baseline?.bottomColor || ChartColor.Green,
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
			baseline: baseline.active
				? {
						value: baseline.value,
						bottomColor: baseline.bottomColor,
				  }
				: null,
		})
	}, [side, color, legendText, showLegend, baseline])

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
				value={showLegend}
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
				value={baseline.active}
				//@ts-ignore
				handleChange={(value) => setBaseline(() => ({ active: value }))}
			></CheckboxInput>
			<NumberInput
				label='Threshold value'
				value={baseline.value}
				step={0.1}
				disabled={!baseline.active}
				//@ts-ignore
				handleChange={(value) => setBaseline(() => ({ value }))}
			></NumberInput>
			<ColorSelect
				label='Bottom color'
				value={baseline.bottomColor}
				options={ChartColorOptions}
				disabled={!baseline.active}
				//@ts-ignore
				handleChange={(value) => setBaseline(() => ({ bottomColor: value }))}
			></ColorSelect>
		</>
	)
}

export default AreaChartEditor
