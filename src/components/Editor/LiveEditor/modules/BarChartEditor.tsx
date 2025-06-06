import { useState, useEffect } from 'react'

import { useObjectState } from '@uidotdev/usehooks'
import { ChartColorOptions } from '@/lib/configUtils'

import { Select, ColorSelect, CheckboxInput, TextInput, NumberInput } from '../Inputs'

import type { BarChartConfig, ChartColorSchema } from '@/types'
import { YAxisSide, ChartColor } from '@/enums'

type Props = {
	config: BarChartConfig
	availableAxis: YAxisSide[]
	handleChange: Function
}

const BarChartEditor = ({ config, availableAxis, handleChange }: Props) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColorSchema>(config.color)
	const [width, setWidth] = useState<number>(config.barWidth)

	const [legendText, setLegendText] = useState<string>(config.legend?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!config.legend?.hide)

	const [labels, setLabels] = useObjectState({
		show: !config.labels?.hide,
		inside: config.labels?.inside || false,
	})

	const [baseline, setBaseline] = useObjectState({
		active: !!config.baseline,
		value: config.baseline?.value || 0,
		extend: config.baseline?.extend || 0,
		bottomColor: config.baseline?.bottomColor || ChartColor.Green,
	})

	useEffect(() => {
		handleChange({
			...config,
			side,
			color,
			barWidth: width,
			legend: {
				text: legendText,
				hide: !showLegend,
			},
			baseline: baseline.active
				? {
						value: baseline.value,
						bottomColor: baseline.bottomColor,
						extend: baseline.extend,
				  }
				: null,
			labels: {
				...config.labels,
				...labels,
				hide: !labels.show,
			},
		})
	}, [side, color, width, baseline, labels, legendText, showLegend])

	return (
		<>
			<Select
				label='Axis side'
				value={side}
				options={availableAxis.map((s) => ({ value: s }))}
				//@ts-ignore
				handleChange={(v) => setSide(v)}
			></Select>
			<ColorSelect
				label='Color'
				value={color}
				options={ChartColorOptions}
				//@ts-ignore
				handleChange={(v) => setColor(v)}
			></ColorSelect>
			<NumberInput
				label='Bar width'
				value={width}
				//@ts-ignore
				handleChange={(value) => setWidth(value)}
			></NumberInput>
			<div></div>
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
				label='Baseline?'
				value={baseline.active}
				//@ts-ignore
				handleChange={(value) => setBaseline(() => ({ active: value }))}
			></CheckboxInput>
			<NumberInput
				label='Baseline value'
				value={baseline.value}
				disabled={!baseline.active}
				//@ts-ignore
				handleChange={(value) => setBaseline(() => ({ value }))}
			></NumberInput>
			<NumberInput
				label='Baseline extend'
				value={baseline.extend}
				disabled={!baseline.active}
				//@ts-ignore
				handleChange={(value) => setBaseline(() => ({ extend: value }))}
			></NumberInput>
			{/* <ColorSelect
				label='Bottom color'
				value={baseline.bottomColor}
				options={ChartColorOptions}
				disabled={!baseline.active}
				//@ts-ignore
				handleChange={(value) => setBaseline(() => ({ bottomColor: value }))}
			></ColorSelect> */}
			<div></div>
			<CheckboxInput
				label='Labels?'
				value={labels.show}
				//@ts-ignore
				handleChange={(value) => setLabels(() => ({ show: value }))}
			></CheckboxInput>
			<NumberInput
				label='Labels decimals'
				value={labels.decimals}
				disabled={!labels.show}
				//@ts-ignore
				handleChange={(value) => setLabels(() => ({ decimals: value }))}
			></NumberInput>
			<TextInput
				label='Labels suffix'
				value={labels.suffix}
				disabled={!labels.show}
				//@ts-ignore
				handleChange={(value) => setLabels(() => ({ suffix: value }))}
			></TextInput>
			<CheckboxInput
				label='Labels inside?'
				value={labels.inside}
				disabled={!labels.show}
				//@ts-ignore
				handleChange={(value) => setLabels(() => ({ inside: value }))}
			></CheckboxInput>
		</>
	)
}

export default BarChartEditor
