import { useEffect, useState } from 'react'

import { CheckboxInput, ColorSelect, NumberInput, Select, TextInput } from './Inputs'

import { ChartColor, YAxisSide } from '@/enums'
import { useObjectState } from '@uidotdev/usehooks'

import { ChartColorOptions } from '@lib/configUtils'

import type { AreaChartConfig, LineChartConfig, Modules, PeriodAreasConfig } from '@/types'

type LineChartProps = {
	config: LineChartConfig
	availableAxis: YAxisSide[]
	handleChange: Function
}

const LineChartEditor = ({ config, availableAxis, handleChange }: LineChartProps) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColor>(config.color)

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

type AreaChartProps = {
	config: AreaChartConfig
	availableAxis: YAxisSide[]
	handleChange: Function
}

const AreaChartEditor = ({ config, availableAxis, handleChange }: AreaChartProps) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColor>(config.color)
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

type PeriodAreaProps = {
	config: PeriodAreasConfig
	handleChange: Function
}

const PeriodAreasEditor = ({ config, handleChange }: PeriodAreaProps) => {
	const [legendText, setLegendText] = useState<string>(config.legend?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!config.legend?.hide)

	useEffect(() => {
		handleChange({
			...config,
			color: ChartColor.RecessionGrey,
			legend: {
				text: legendText,
				hide: !showLegend,
			},
		})
	}, [legendText, showLegend])

	return (
		<>
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
		</>
	)
}

const moduleEditors = {
	lineChart: (props: LineChartProps) => <LineChartEditor {...props} />,
	areaChart: (props: AreaChartProps) => <AreaChartEditor {...props} />,
	periodAreas: (props: PeriodAreaProps) => <PeriodAreasEditor {...props} />,
}

const ModulesConfig = ({
	config,
	availableAxis,
	handleChange,
}: {
	config: Modules
	availableAxis: YAxisSide[]
	handleChange: Function
}) => {
	return moduleEditors[config.type]({
		//@ts-ignore
		config,
		availableAxis,
		handleChange,
	})
}

export default ModulesConfig
