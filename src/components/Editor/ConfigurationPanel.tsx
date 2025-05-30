import { useEffect } from 'react'
import { useObjectState } from '@uidotdev/usehooks'

import { Tabs, Button, Panel } from 'rsuite'

import {
	CheckboxInput,
	ColorSelect,
	ControlTab,
	InputBlock,
	NumberInput,
	Select,
	TextAreaInput,
	TextInput,
} from './LiveEditor/Inputs'

import { ChartColorOptions } from '@lib/configUtils'

import { ChartColor, ModuleType, YAxisSide } from '@/enums'

import './configuration-panel.scss'
import type { LegendConfig } from '@/types'

export type SeriesConfigProps = {
	name: string
	series: number
	type: string
	legend?: LegendConfig
	color: string
	side: YAxisSide
}

const configColors = Object.keys(ChartColor)

const SeriesConfig = ({
	name,
	seriesId,
	updateHandler,
}: {
	name: string
	seriesId: number
	updateHandler: (config: SeriesConfigProps) => void
}) => {
	const initialColor = configColors[seriesId % configColors.length]
	const [config, setConfig] = useObjectState<SeriesConfigProps>({
		name,
		series: seriesId,
		type: 'lineChart',
		color: initialColor,
		side: YAxisSide.Left,
	})

	const [legendConfig, setLegendConfig] = useObjectState({
		text: config.name,
		hide: false,
	})

	const updateConfig = (key: keyof SeriesConfigProps, value: any) => {
		//@ts-ignore
		setConfig((c: SeriesConfigProps) => ({ [key]: value }))
	}

	const updateLegendConfig = (key: keyof LegendConfig, value: any) => {
		//@ts-ignore
		setLegendConfig((c: LegendConfig) => ({ [key]: value }))
	}

	useEffect(() => {
		updateHandler({ ...config, legend: legendConfig as LegendConfig })
	}, [config, legendConfig])

	return (
		<div className='series-config'>
			<InputBlock numColumns='3'>
				<Select
					label='Chart Type'
					value={config.type}
					options={Object.values(ModuleType).map((value) => ({ value }))}
					handleChange={(value: string) => updateConfig('type', value)}
				></Select>
				<ColorSelect
					label='Color'
					value={config.color}
					options={ChartColorOptions}
					disabled={config.type === ModuleType.PeriodAreas}
					//@ts-ignore
					handleChange={(value) => updateConfig('color', value)}
				></ColorSelect>
				<Select
					label='Y Axis Side'
					value={config.side}
					options={Object.values(YAxisSide).map((value) => ({ value }))}
					handleChange={(value: string) => updateConfig('side', value)}
					disabled={config.type === ModuleType.PeriodAreas}
				></Select>
			</InputBlock>
			<InputBlock numColumns='2'>
				<CheckboxInput
					label='Show legend'
					value={!legendConfig.hide}
					//@ts-ignore
					handleChange={(value) => updateLegendConfig('hide', !value)}
				></CheckboxInput>
				<TextInput
					label='Legend text'
					value={legendConfig.text}
					disabled={legendConfig.hide}
					//@ts-ignore
					handleChange={(value) => updateLegendConfig('text', value)}
				></TextInput>
			</InputBlock>
		</div>
	)
}

type Props = {
	chartSize: { chartWidth: number; chartHeight: number }
	updateChartSize: Function
	info: { title: string; description: string }
	updateInfo: Function
	seriesConfig: SeriesConfigProps[]
	updateSeriesConfig: Function
	clearSeriesConfig: Function
	generateChartConfig: Function
}

const ConfigurationPanel = ({
	chartSize,
	info,
	seriesConfig,
	updateChartSize,
	updateInfo,
	updateSeriesConfig,
	clearSeriesConfig,
	generateChartConfig,
}: Props) => {
	return (
		<Panel header='Configure Chart' className='configuration-panel'>
			<ControlTab title='Info' open>
				<InputBlock numColumns='1'>
					<TextInput
						label='Title'
						value={info?.title || ''}
						//@ts-ignore
						handleChange={(v) => updateInfo(() => ({ title: v }))}
					></TextInput>
					<TextAreaInput
						label='Description'
						value={info?.description || ''}
						//@ts-ignore
						handleChange={(v) => updateInfo(() => ({ description: v }))}
					></TextAreaInput>
				</InputBlock>
			</ControlTab>
			<ControlTab title='Size' open>
				<InputBlock numColumns='2'>
					<NumberInput
						label='Width'
						value={chartSize.chartWidth}
						min={400}
						max={1200}
						//@ts-ignore
						handleChange={(v) => updateChartSize(() => ({ chartWidth: Number(v) }))}
					></NumberInput>
					<NumberInput
						label='Heigh'
						value={chartSize.chartHeight}
						min={300}
						max={600}
						//@ts-ignore
						handleChange={(v) => updateChartSize(() => ({ chartHeight: Number(v) }))}
					></NumberInput>
				</InputBlock>
			</ControlTab>
			<ControlTab title='Series' open>
				<Tabs defaultActiveKey={'0'}>
					{seriesConfig.map((s, id) => (
						<Tabs.Tab key={s.name} title={s.name} eventKey={id.toString()}>
							<SeriesConfig
								seriesId={s.series}
								name={s.name}
								updateHandler={(config) => updateSeriesConfig(id, config)}
							></SeriesConfig>
						</Tabs.Tab>
					))}
				</Tabs>
			</ControlTab>
			<div className='configuration-footer'>
				<Button onClick={() => generateChartConfig()}>Start</Button>
				<Button onClick={() => clearSeriesConfig()}>Select Different File</Button>
			</div>
		</Panel>
	)
}

export default ConfigurationPanel
