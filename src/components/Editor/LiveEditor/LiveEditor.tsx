'use client'

import { useState } from 'react'
import { useList, useObjectState } from '@uidotdev/usehooks'

import { Tabs, Button } from 'rsuite'

import TimelineChart from '@/components/Chart'
import {
	ControlTab,
	InputBlock,
	NumberInput,
	DateInput,
	Select,
	TextInput,
	TextAreaInput,
} from './Inputs'

import Toolbar from './Toolbar'
import ModulesConfig from './ModulesConfig'
import YAxisSideInput from './YAxisSideInput'

import './live-editor.scss'

import type {
	LegendConfig,
	Modules,
	TimelineChartConfig,
	TimelineChartDataEntry,
	YAxisConfig,
} from '@/types'
import { ChartColor, ModuleType, YAxisSide } from '@/enums'

type Props = {
	data: TimelineChartDataEntry[]
	initialConfig: TimelineChartConfig
	series: string[]
}

const defaultYAxisConfig: YAxisConfig = {
	domain: [0, 100],
	ticksConfig: {
		startVal: 0,
		numTicks: 11,
		tickInterval: 10,
		decimals: 0,
	},
	guideLines: false,
	label: '',
}

const LiveEditor = ({ data, initialConfig, series }: Props) => {
	const [config, setConfig] = useState<TimelineChartConfig>(structuredClone(initialConfig))

	const [info, setInfo] = useObjectState({
		title: initialConfig.title,
		description: initialConfig.description,
	})

	const [size, setSize] = useObjectState({
		width: initialConfig.width,
		height: initialConfig.height,
	})

	const [marginAdjust, setMarginAdjust] = useObjectState({
		left: initialConfig.marginAdjust?.left || (!!initialConfig.yAxisConfig.left ? 0 : 24),
		right: initialConfig.marginAdjust?.right || (!!initialConfig.yAxisConfig.right ? 0 : 24),
		top: initialConfig.marginAdjust?.top || 12,
		bottom: initialConfig.marginAdjust?.bottom || 0,
	})

	const [xAxisTicks, setXAxisTicks] = useObjectState({
		startDate: initialConfig.xAxisConfig.ticksConfig.startDate,
		numTicks: initialConfig.xAxisConfig.ticksConfig.numTicks,
		dateInterval: initialConfig.xAxisConfig.ticksConfig.dateInterval,
		intervalStep: initialConfig.xAxisConfig.ticksConfig.intervalStep,
		dateFormat: initialConfig.xAxisConfig.ticksConfig.dateFormat || '%m/%y',
	})

	const [yAxis, setYAxis] = useObjectState({
		left: initialConfig.yAxisConfig.left,
		right: initialConfig.yAxisConfig.right,
	})

	const [legend, { updateAt: updateLegend }] = useList(
		initialConfig.legend ? [...initialConfig.legend] : []
	)

	const [modules, { updateAt: updateModule }] = useList(
		initialConfig.modules ? [...initialConfig.modules] : []
	)

	const updatedConfig: TimelineChartConfig = {
		...initialConfig,
		...info,
		...size,
		marginAdjust,
		legend,
		xAxisConfig: {
			...initialConfig.xAxisConfig,
			ticksConfig: xAxisTicks,
		},
		yAxisConfig: yAxis,
		modules,
	}

	const availableYAxis = Object.keys(yAxis).filter((key) => yAxis?.[key as YAxisSide]) as YAxisSide[]

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
				<ControlTab title='X Axis Ticks'>
					<InputBlock numColumns='2'>
						<DateInput
							label='Start date'
							value={xAxisTicks.startDate}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ startDate: v }))}
						></DateInput>
						<Select
							label='Date interval'
							value={xAxisTicks.dateInterval}
							options={[{ value: 'day' }, { value: 'month' }, { value: 'year' }]}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ dateInterval: v }))}
						></Select>
						<NumberInput
							label='Ticks number'
							value={xAxisTicks.numTicks}
							min={2}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ numTicks: v }))}
						></NumberInput>
						<NumberInput
							label='Step'
							value={xAxisTicks.intervalStep}
							min={1}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ intervalStep: v }))}
						></NumberInput>
						<Select
							label='Date format'
							value={xAxisTicks.dateFormat}
							options={[
								{ value: '%m/%y', label: 'mm/yy' },
								{ value: '%m/%Y', label: 'mm/yyyy' },
								{ value: '%Y', label: 'yyyy' },
							]}
							//@ts-ignore
							handleChange={(v) => setXAxisTicks(() => ({ dateFormat: v }))}
						></Select>
					</InputBlock>
				</ControlTab>
				<ControlTab title='Y Axis'>
					<Tabs defaultActiveKey='1'>
						<Tabs.Tab title='Left Y Axis' eventKey='1'>
							{yAxis.left ? (
								<YAxisSideInput
									side={YAxisSide.Left}
									initialConfig={yAxis.left}
									//@ts-ignore
									handleChange={(v) => setYAxis(() => ({ left: v }))}
								></YAxisSideInput>
							) : (
								<InputBlock numColumns='2'>
									<div>Left axis is not defined</div>
									<Button
										//@ts-ignore
										onClick={() => setYAxis(() => ({ left: defaultYAxisConfig }))}
									>
										Click to create one
									</Button>
								</InputBlock>
							)}
						</Tabs.Tab>
						<Tabs.Tab title='Right Y Axis' eventKey='2'>
							{yAxis.right ? (
								<YAxisSideInput
									side={YAxisSide.Right}
									initialConfig={yAxis.right}
									//@ts-ignore
									handleChange={(v) => setYAxis(() => ({ right: v }))}
								></YAxisSideInput>
							) : (
								<InputBlock numColumns='1'>
									<div className='input-wrapper'>
										<label>Right axis is not defined</label>
										<Button
											//@ts-ignore
											onClick={() => setYAxis(() => ({ right: defaultYAxisConfig }))}
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
												updateModule(id, getDefaultModuleConfig(type as ModuleType, module)!)
											}
										></Select>
									</InputBlock>
									<InputBlock numColumns='2'>
										<ModulesConfig
											config={module}
											availableAxis={availableYAxis}
											handleChange={(value: Modules) => updateModule(id, value)}
											legendConfig={legend[module.series]}
											handleLegendChange={(config: LegendConfig) => updateLegend(id, config)}
										></ModulesConfig>
									</InputBlock>
								</Tabs.Tab>
							))}
					</Tabs>
				</ControlTab>
			</div>
			<div className='preview-container'>
				<div className='sticky-container'>
					<TimelineChart data={data} config={updatedConfig}></TimelineChart>
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
