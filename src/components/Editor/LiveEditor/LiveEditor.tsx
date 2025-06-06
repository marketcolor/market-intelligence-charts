'use client'

import { useState } from 'react'
import { useList, useObjectState } from '@uidotdev/usehooks'

import { Tabs, Button } from 'rsuite'

import CartesianChart from '@/components/Chart'
import { ControlTab, InputBlock, NumberInput, Select, TextInput, TextAreaInput } from './Inputs'

import Toolbar from './Toolbar'
import ModulesConfig from './ModulesConfig'
import QuantAxisConfigPanel from './QuantAxisConfigPanel'
import TimeAxisConfigPanel from './TimeAxisConfigPanel'

import type { Modules, ChartConfig, ChartDataEntry, QuantAxisConfig } from '@/types'
import { ChartColor, ChartType, ModuleType, YAxisSide } from '@/enums'

import './live-editor.scss'
import BandAxisConfigPanel from './BandAxisConfigPanel'

type Props = {
	data: ChartDataEntry[]
	initialConfig: ChartConfig
	series: string[]
}

const defaultYAxisConfig: QuantAxisConfig = {
	domain: [0, 100],
	ticksConfig: {
		startVal: 0,
		numTicks: 11,
		tickInterval: 10,
		format: {
			decimals: 0,
		},
	},
	guideLines: false,
	label: '',
}

const LiveEditor = ({ data, initialConfig, series }: Props) => {
	const { type } = initialConfig

	const [config, setConfig] = useState<ChartConfig>(structuredClone(initialConfig))
	const [xAxisConfig, setXAxisConfig] = useState(initialConfig.xAxisConfig)

	const [info, setInfo] = useObjectState({
		title: initialConfig.title,
		description: initialConfig.description,
	})

	const [size, setSize] = useObjectState({
		width: initialConfig.width,
		height: initialConfig.height,
	})

	const [marginAdjust, setMarginAdjust] = useObjectState({
		left: initialConfig.marginAdjust?.left || 0,
		right: initialConfig.marginAdjust?.right || 0,
		top: initialConfig.marginAdjust?.top || 0,
		bottom: initialConfig.marginAdjust?.bottom || 0,
	})

	const [yAxisConfig, setYAxisConfig] = useObjectState({
		left: initialConfig.yAxisConfig.left,
		right: initialConfig.yAxisConfig.right,
	})

	const [modules, { updateAt: updateModule }] = useList(
		initialConfig.modules ? [...initialConfig.modules] : []
	)

	//@ts-ignore
	const updatedConfig: ChartConfig = {
		...initialConfig,
		...info,
		...size,
		marginAdjust,
		...(type === ChartType.Time && { xAxisConfig }),
		...(type === ChartType.Quant && { xAxisConfig }),
		...(type === ChartType.Band && { xAxisConfig }),
		yAxisConfig: yAxisConfig,
		modules,
	}

	const availableYAxis = Object.keys(yAxisConfig).filter(
		(key) => yAxisConfig?.[key as YAxisSide]
	) as YAxisSide[]

	return (
		<div className='live-editor'>
			<Toolbar chartTitle={info.title}></Toolbar>
			<div className='controls-container'>
				<ControlTab title='Info' open>
					<InputBlock numColumns='1'>
						<TextInput
							label='Title'
							value={info.title || ''}
							//@ts-ignore
							handleChange={(v) => setInfo(() => ({ title: v }))}
						></TextInput>
						<TextAreaInput
							label='Description'
							value={info.description || ''}
							//@ts-ignore
							handleChange={(v) => setInfo(() => ({ description: v }))}
						></TextAreaInput>
					</InputBlock>
				</ControlTab>
				<ControlTab title='Size' open>
					<InputBlock numColumns='2'>
						<NumberInput
							label='Width'
							value={size.width}
							min={400}
							max={1200}
							//@ts-ignore
							handleChange={(v) => setSize(() => ({ width: Number(v) }))}
						></NumberInput>
						<NumberInput
							label='Heigh'
							value={size.height}
							min={300}
							max={600}
							//@ts-ignore
							handleChange={(v) => setSize(() => ({ height: Number(v) }))}
						></NumberInput>
					</InputBlock>
				</ControlTab>
				<ControlTab title='Adjust margins'>
					<InputBlock numColumns='2'>
						<NumberInput
							label='Left'
							value={marginAdjust.left}
							min={0}
							//@ts-ignore
							handleChange={(v) => setMarginAdjust(() => ({ left: Number(v) }))}
						></NumberInput>
						<NumberInput
							label='Right'
							value={marginAdjust.right}
							min={0}
							//@ts-ignore
							handleChange={(v) => setMarginAdjust(() => ({ right: Number(v) }))}
						></NumberInput>
						<NumberInput
							label='Top'
							value={marginAdjust.top}
							min={0}
							//@ts-ignore
							handleChange={(v) => setMarginAdjust(() => ({ top: Number(v) }))}
						></NumberInput>
						<NumberInput
							label='Bottom'
							value={marginAdjust.bottom}
							min={0}
							//@ts-ignore
							handleChange={(v) => setMarginAdjust(() => ({ bottom: Number(v) }))}
						></NumberInput>
					</InputBlock>
				</ControlTab>
				{initialConfig.type === ChartType.Time && (
					<ControlTab title='X Axis'>
						<TimeAxisConfigPanel
							initialConfig={initialConfig.xAxisConfig}
							handleChange={setXAxisConfig}
						></TimeAxisConfigPanel>
					</ControlTab>
				)}
				{initialConfig.type === ChartType.Quant && (
					<ControlTab title='X Axis'>
						<QuantAxisConfigPanel
							initialConfig={initialConfig.xAxisConfig}
							handleChange={setXAxisConfig}
						></QuantAxisConfigPanel>
					</ControlTab>
				)}
				{initialConfig.type === ChartType.Band && (
					<ControlTab title='X Axis'>
						<BandAxisConfigPanel
							initialConfig={initialConfig.xAxisConfig}
							handleChange={setXAxisConfig}
						></BandAxisConfigPanel>
					</ControlTab>
				)}
				<ControlTab title='Y Axis'>
					<Tabs defaultActiveKey='1'>
						<Tabs.Tab title='Left Y Axis' eventKey='1'>
							{yAxisConfig.left ? (
								<QuantAxisConfigPanel
									initialConfig={yAxisConfig.left}
									//@ts-ignore
									handleChange={(v) => setYAxisConfig(() => ({ left: v }))}
								></QuantAxisConfigPanel>
							) : (
								<InputBlock numColumns='2'>
									<div>Left axis is not defined</div>
									<Button
										//@ts-ignore
										onClick={() => setYAxisConfig(() => ({ left: defaultYAxisConfig }))}
									>
										Click to create one
									</Button>
								</InputBlock>
							)}
						</Tabs.Tab>
						<Tabs.Tab title='Right Y Axis' eventKey='2'>
							{yAxisConfig.right ? (
								<QuantAxisConfigPanel
									initialConfig={yAxisConfig.right}
									//@ts-ignore
									handleChange={(v) => setYAxisConfig(() => ({ right: v }))}
								></QuantAxisConfigPanel>
							) : (
								<InputBlock numColumns='1'>
									<div className='input-wrapper'>
										<label>Right axis is not defined</label>
										<Button
											//@ts-ignore
											onClick={() => setYAxisConfig(() => ({ right: defaultYAxisConfig }))}
										>
											Click to create one
										</Button>
									</div>
								</InputBlock>
							)}
						</Tabs.Tab>
					</Tabs>
				</ControlTab>
				<ControlTab title='Series'>
					<Tabs defaultActiveKey='0'>
						{modules.length &&
							modules.map((module, id) => (
								<Tabs.Tab key={id} eventKey={id.toString()} title={series[module.series]}>
									<InputBlock numColumns='2'>
										<Select
											label={'Type'}
											value={module.type}
											options={Object.values(ModuleType).map((value) => ({ value }))}
											handleChange={(type: string) =>
												//@ts-ignore
												updateModule(id, getDefaultModuleConfig(type as ModuleType, module)!)
											}
										></Select>
									</InputBlock>
									<InputBlock numColumns='2'>
										<ModulesConfig
											config={module}
											availableAxis={availableYAxis}
											handleChange={(value: Modules) => updateModule(id, value)}
										></ModulesConfig>
									</InputBlock>
								</Tabs.Tab>
							))}
					</Tabs>
				</ControlTab>
			</div>
			<div className='preview-container'>
				<div className='sticky-container'>
					<CartesianChart data={data} config={updatedConfig}></CartesianChart>
				</div>
			</div>
		</div>
	)
}

const getDefaultModuleConfig = (type: ModuleType, module: Modules) => {
	switch (type) {
		case ModuleType.LineChart:
			return {
				type,
				series: module.series,
				//@ts-ignore
				side: module?.side || YAxisSide.Left,
				//@ts-ignore
				color: module?.color || ChartColor.Green,
			}
		case ModuleType.AreaChart:
			return {
				type,
				series: module.series,
				//@ts-ignore
				side: module?.side || YAxisSide.Left,
				//@ts-ignore
				color: module?.color || ChartColor.Green,
			}
		case ModuleType.PeriodAreas:
			return {
				type,
				series: module.series,
			}

		default:
			break
	}
}
export default LiveEditor
