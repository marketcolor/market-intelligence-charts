import { useEffect } from 'react'
import { useObjectState } from '@uidotdev/usehooks'
import { Panel } from 'primereact/panel'
import { TabView, TabPanel } from 'primereact/tabview'
import { Button } from 'primereact/button'

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
	updateHandler,
}: {
	name: string
	seriesId: number
	updateHandler: (config: SeriesConfigProps) => void
}) => {
	const initialColor = configColors[seriesId % configColors.length]
	const [config, setConfig] = useObjectState<SeriesConfigProps>({
		name,
		legend: name,
		showLegend: true,
		type: 'lineChart',
		color: initialColor,
		side: YAxisSide.Left,
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
					//@ts-ignore
					handleChange={(value) => updateConfig('color', value)}
				></ColorSelect>
				<Select
					label='Y Axis Side'
					value={config.side}
					options={Object.values(YAxisSide).map((value) => ({ value }))}
					handleChange={(value: string) => updateConfig('side', value)}
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
	const footerTemplate = () => {
		return (
			<div className='configuration-footer'>
				<Button rounded onClick={() => generateChartConfig()}>
					Start
				</Button>
				<Button rounded onClick={() => clearSeriesConfig()}>
					Select Different File
				</Button>
			</div>
		)
	}
	return (
		<Panel header='Configure Chart' className='configuration-panel' footerTemplate={footerTemplate}>
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
				<TabView scrollable renderActiveOnly={false}>
					{seriesConfig.map((s, id) => (
						<TabPanel key={s.name} header={s.name}>
							<SeriesConfig
								seriesId={id}
								name={s.name}
								updateHandler={(config) => updateSeriesConfig(id, config)}
							></SeriesConfig>
						</TabPanel>
					))}
				</TabView>
			</ControlTab>
		</Panel>
	)
}

export default ConfigurationPanel
