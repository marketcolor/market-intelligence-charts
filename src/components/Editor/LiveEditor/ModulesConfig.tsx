import { useEffect, useState } from 'react'

import { CheckboxInput, ColorSelect, NumberInput, Select, TextInput } from './Inputs'

import { ChartColor, YAxisSide } from '@/enums'

import type {
	AreaChartConfig,
	LegendConfig,
	LineChartConfig,
	Modules,
	PeriodAreasConfig,
} from '@/types'

import { ChartColorOptions } from '@lib/configUtils'
import { useObjectState } from '@uidotdev/usehooks'

type LineChartProps = {
	config: LineChartConfig
	availableAxis: YAxisSide[]
	handleChange: Function
	legendConfig: LegendConfig
	handleLegendChange: Function
}

const LineChartEditor = ({
	config,
	availableAxis,
	legendConfig,
	handleChange,
	handleLegendChange,
}: LineChartProps) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColor>(config.color)
	const [legendText, setLegendText] = useState<string>(legendConfig?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!legendConfig?.hide)
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
			threshold: threshold.active
				? { value: threshold.value, bottomColor: threshold.bottomColor }
				: null,
		})
	}, [side, color, threshold])

	useEffect(() => {
		handleLegendChange({ text: legendText, hide: !showLegend, color })
	}, [legendText, showLegend, color])

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
	legendConfig: LegendConfig
	handleLegendChange: Function
}

const AreaChartEditor = ({
	config,
	availableAxis,
	handleChange,
	legendConfig,
	handleLegendChange,
}: AreaChartProps) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColor>(config.color)
	const [legendText, setLegendText] = useState<string>(legendConfig?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!!legendConfig?.hide)

	useEffect(() => {
		handleChange({ ...config, side, color })
	}, [side, color])

	useEffect(() => {
		handleLegendChange({ text: legendText, show: showLegend, color })
	}, [legendText, showLegend, color])
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
		</>
	)
}

type PeriodAreaProps = {
	config: PeriodAreasConfig
	legendConfig: LegendConfig
	handleLegendChange: Function
}

const PeriodAreasEditor = ({ config, legendConfig, handleLegendChange }: PeriodAreaProps) => {
	const [legendText, setLegendText] = useState<string>(legendConfig?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!!legendConfig?.hide)

	useEffect(() => {
		handleLegendChange({ text: legendText, show: showLegend, color: ChartColor.RecessionGrey })
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
	legendConfig,
	handleLegendChange,
}: {
	config: Modules
	availableAxis: YAxisSide[]
	handleChange: Function
	legendConfig: LegendConfig
	handleLegendChange: Function
}) => {
	return moduleEditors[config.type]({
		//@ts-ignore
		config,
		legendConfig,
		availableAxis,
		handleChange,
		handleLegendChange,
	})
}

export default ModulesConfig
