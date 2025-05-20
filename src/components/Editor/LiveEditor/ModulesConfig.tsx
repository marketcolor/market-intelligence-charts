import { useEffect, useState } from 'react'

import { ColorSelect, Select } from './Inputs'

import { ChartColor, YAxisSide } from '@/enums'

import type { AreaChartConfig, LineChartConfig, Modules, PeriodAreasConfig } from '@/types'

import { ChartColorOptions } from '@lib/configUtils'

const LineChartEditor = ({
	config,
	availableAxis,
	handleChange,
}: {
	config: LineChartConfig
	availableAxis: YAxisSide[]
	handleChange: Function
}) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColor>(config.color)

	useEffect(() => {
		handleChange({ ...config, side, color })
	}, [side, color])
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
		</>
	)
}

const AreaChartEditor = ({
	config,
	availableAxis,
	handleChange,
}: {
	config: AreaChartConfig
	availableAxis: YAxisSide[]
	handleChange: Function
}) => {
	const [side, setSide] = useState<YAxisSide>(config.side)
	const [color, setColor] = useState<ChartColor>(config.color)

	useEffect(() => {
		handleChange({ ...config, side, color })
	}, [side, color])

	return (
		<>
			<Select
				label='Axis side'
				value={config.side}
				options={availableAxis.map((s) => ({ value: s }))}
				// options={Object.values(YAxisSide).map((s) => ({ value: s }))}
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
		</>
	)
}

const PeriodAreasEditor = ({ config }: { config: PeriodAreasConfig }) => {
	return <span>no additional settings</span>
}

const moduleEditors = {
	lineChart: (config: LineChartConfig, availableAxis: YAxisSide[], handleChange: Function) => (
		<LineChartEditor config={config} availableAxis={availableAxis} handleChange={handleChange} />
	),
	areaChart: (config: AreaChartConfig, availableAxis: YAxisSide[], handleChange: Function) => (
		<AreaChartEditor config={config} availableAxis={availableAxis} handleChange={handleChange} />
	),
	periodAreas: (config: PeriodAreasConfig, availableAxis: YAxisSide, handleChange: Function) => (
		<PeriodAreasEditor config={config} />
	),
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
	//@ts-ignore
	return moduleEditors[config.type](config, availableAxis, handleChange)
}

export default ModulesConfig
