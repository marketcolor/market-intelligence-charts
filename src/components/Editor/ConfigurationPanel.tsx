import { useEffect } from 'react'
import { useObjectState } from '@uidotdev/usehooks'

// import { TabView, TabPanel } from 'primereact/tabview'
// import { Button } from 'primereact/button'
// import { Panel } from 'primereact/panel'

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
import type { TimelineChartConfig } from '@/types'

export type SeriesConfigProps = {
	name: string
	legend: string
	showLegend: boolean
	type: string
	color: ChartColor
	side: YAxisSide
}

const configColors = Object.values(ChartColor)

const SeriesConfig = ({
	name,
	seriesId,
	preset,
	updateHandler,
}: {
	name: string
	seriesId: number
	preset?: Partial<SeriesConfigProps>
	updateHandler: (config: SeriesConfigProps) => void
}) => {
	const initialColor = configColors[seriesId % configColors.length]
	const [config, setConfig] = useObjectState<SeriesConfigProps>({
		name,
		legend: name,
		showLegend: preset?.showLegend !== undefined ? preset?.showLegend : true,
		type: preset?.type || 'lineChart',
		color: preset?.color || initialColor,
		side: preset?.side || YAxisSide.Left,
	})

	const updateConfig = (key: keyof SeriesConfigProps, value: any) => {
		//@ts-ignore
		setConfig((c: SeriesConfigProps) => ({ [key]: value }))
	}

	useEffect(() => {
		updateHandler(config)
	}, [config])

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
					value={config.showLegend}
					//@ts-ignore
					handleChange={(value) => updateConfig('showLegend', value)}
				></CheckboxInput>
				<TextInput
					label='Legend text'
					value={config.legend}
					disabled={!config.showLegend}
					//@ts-ignore
					handleChange={(value) => updateConfig('legend', value)}
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
	preset?: Partial<TimelineChartConfig>
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
	preset,
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
								seriesId={id}
								name={s.name}
								preset={preset?.modules?.[id]}
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
