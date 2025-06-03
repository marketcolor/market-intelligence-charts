import { useState, useEffect } from 'react'

import { useObjectState } from '@uidotdev/usehooks'
import { ChartColorOptions } from '@/lib/configUtils'

import { Select, ColorSelect, CheckboxInput, TextInput } from '../Inputs'

import type { ScatterPlotConfig, ChartColorSchema } from '@/types'
import { YAxisSide, ChartColor } from '@/enums'

type ScatterPlotProps = {
	config: ScatterPlotConfig
	availableAxis: YAxisSide[]
	handleChange: Function
}

const ScatterPlotEditor = ({ config, availableAxis, handleChange }: ScatterPlotProps) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColorSchema>(config.color)
	const [legendText, setLegendText] = useState<string>(config.legend?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!config.legend?.hide)

	const [trendLine, setTrendLine] = useObjectState({
		active: !!config.trendLine,
		trendLineColor: config?.trendLineColor || ChartColor.Green,
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
			trendLine: trendLine.active,
			trendLineColor: trendLine.trendLineColor,
		})
	}, [side, color, legendText, showLegend, trendLine])

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
				label='Trend line?'
				value={trendLine.active}
				//@ts-ignore
				handleChange={(value) => setTrendLine(() => ({ active: value }))}
			></CheckboxInput>
			<ColorSelect
				label='Trend line color'
				value={trendLine.trendLineColor}
				options={ChartColorOptions}
				disabled={!trendLine.active}
				//@ts-ignore
				handleChange={(value) => setTrendLine(() => ({ trendLineColor: value }))}
			></ColorSelect>
		</>
	)
}

export default ScatterPlotEditor
