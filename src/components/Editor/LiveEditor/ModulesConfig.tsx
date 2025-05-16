import { ChartColor, YAxisSide } from '@/enums'
import type { AreaChartConfig, LineChartConfig, Modules, PeriodAreasConfig } from '@/types'
import { Select } from './Inputs'
import { useEffect, useState } from 'react'

const LineChartEditor = ({
	config,
	handleChange,
}: {
	config: LineChartConfig
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
				options={Object.values(YAxisSide).map((s) => ({ value: s }))}
				//@ts-ignore
				handleChange={(v) => setSide(v)}
			></Select>
			<Select
				label='Color'
				value={config.color}
				options={Object.values(ChartColor).map((s) => ({ value: s }))}
				//@ts-ignore
				handleChange={(v) => setColor(v)}
			></Select>
		</>
	)
}

const AreaChartEditor = ({
	config,
	handleChange,
}: {
	config: AreaChartConfig
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
				options={Object.values(YAxisSide).map((s) => ({ value: s }))}
				//@ts-ignore
				handleChange={(v) => setSide(v)}
			></Select>
			<Select
				label='Color'
				value={config.color}
				options={Object.values(ChartColor).map((s) => ({ value: s }))}
				//@ts-ignore
				handleChange={(v) => setColor(v)}
			></Select>
		</>
	)
}

const PeriodAreasEditor = ({ config }: { config: PeriodAreasConfig }) => {
	return <span>no additional setting</span>
}

const moduleEditors = {
	lineChart: (config: LineChartConfig, handleChange: Function) => (
		<LineChartEditor config={config} handleChange={handleChange} />
	),
	areaChart: (config: AreaChartConfig, handleChange: Function) => (
		<AreaChartEditor config={config} handleChange={handleChange} />
	),
	periodAreas: (config: PeriodAreasConfig, handleChange: Function) => (
		<PeriodAreasEditor config={config} />
	),
}

const ModulesConfig = ({ config, handleChange }: { config: Modules; handleChange: Function }) => {
	//@ts-ignore
	return moduleEditors[config.type](config, handleChange)
}

export default ModulesConfig
