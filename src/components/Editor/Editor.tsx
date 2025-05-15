'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { timeParse } from 'd3'
import { useList, useObjectState } from '@uidotdev/usehooks'

import LiveEditor from './LiveEditor'
import { getXAxisConfig, getYAxisConfig } from '@/lib/chartUtils'

import type { TimelineChartConfig, TimelineChartDataEntry } from '@/types'
import { ChartColor, YAxisSide } from '@/enums'

import './editor.scss'

type SeriesConfigProps = {
	name: string
	legend: string
	showLegend: boolean
	type: string
	color: ChartColor
	side: YAxisSide
}

const dateParser = timeParse('%d/%m/%Y')

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
			<div className='name'>{config.name}</div>
			<div className='color config-box'>
				<label htmlFor=''>Chart type</label>
				<select
					value={config.type}
					onChange={(e) => {
						updateConfig('type', e.target.value)
						if (e.target.value === 'periodAreas') {
							updateConfig('color', ChartColor.RecessionGrey)
						}
					}}
				>
					<option value='lineChart'>Line Chart</option>
					<option value='areaChart'>Area Chart</option>
					<option value='periodAreas'>Period Areas</option>
				</select>
				<label htmlFor=''>Color:</label>
				<select
					className='color-select'
					value={config.color}
					disabled={config.type === 'periodAreas'}
					onChange={(e) => updateConfig('color', e.target.value)}
				>
					<option value={ChartColor.Blue}>
						<div className='icon' aria-hidden='true'>
							🟦
						</div>
						<div className='option-label'>Blue</div>
					</option>
					<option value={ChartColor.Green}>
						<div className='icon' aria-hidden='true'>
							🟩
						</div>
						<div className='option-label'>Green</div>
					</option>
				</select>
				<label htmlFor=''>Axis side</label>
				<select
					disabled={config.type === 'periodAreas'}
					value={config.side}
					onChange={(e) => updateConfig('side', e.target.value)}
				>
					<option value='left'>Left</option>
					<option value='right'>Right</option>
				</select>
			</div>
			<div className='legend config-box'>
				<input
					type='checkbox'
					checked={config.showLegend}
					onChange={(e) => updateConfig('showLegend', e.target.checked)}
				/>
				<label htmlFor=''>Legend text:</label>
				<input
					type='text'
					value={config.legend}
					disabled={!config.showLegend}
					onChange={(e) => updateConfig('legend', e.target.value)}
				/>
			</div>
		</div>
	)
}

const Editor = () => {
	const [data, setData] = useState<TimelineChartDataEntry[]>()
	const [chartSize, setChartSize] = useObjectState<{ chartWidth: number; chartHeight: number }>({
		chartWidth: 800,
		chartHeight: 500,
	})
	const [showModal, setShowModal] = useState<boolean>(true)
	const [seriesConfig, { set, updateAt, clear }] = useList<SeriesConfigProps>()
	const [templateConfig, setTemplateConfig] = useState<TimelineChartConfig>()

	const handleFileDrop = useCallback((files: File[]) => {
		if (!!files[0]) {
			Papa.parse(files[0], {
				dynamicTyping: true,
				skipEmptyLines: true,
				complete: ({ errors, data: parsedData }: { errors: any[]; data: any[] }) => {
					if (errors.length) {
						throw new Error(`Error parsing data: ${JSON.stringify(errors)}`)
					}
					if (parsedData.length > 0) {
						const columns = parsedData[0]
						const dataset = parsedData.slice(1)
						const [dateKey, ...series] = columns
						const data: TimelineChartDataEntry[] = dataset.map(([dateStr, ...values]) => [
							dateParser(dateStr)!,
							...values,
						])
						setData(data)
						set(series.map((s: string) => ({ name: s })))
					}
				},
			})
		}
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: { 'text/csv': ['.csv'] },
		maxFiles: 1,
		onDrop: handleFileDrop,
	})

	const generateChartConfig = useCallback(() => {
		if (data) {
			const chartConfig: TimelineChartConfig = {
				width: chartSize.chartWidth,
				height: chartSize.chartHeight,
				xAxisConfig: getXAxisConfig(data),
				yAxisConfig: getYAxisConfig(data, seriesConfig),
				legend: seriesConfig
					.filter((s) => s.showLegend)
					.map((c) => ({ text: c.legend, color: c.color as ChartColor })),
				//@ts-ignore
				modules: seriesConfig.map((c, id) => ({
					type: c.type,
					series: id,
					side: c.side,
					color: c.color as ChartColor,
				})),
			}

			setTemplateConfig(chartConfig)
			setShowModal(false)
		}
	}, [seriesConfig, chartSize, data])

	return (
		<div className='editor'>
			<div className='dropzone-modal' data-open={showModal ? 'open' : ''}>
				<div className='modal-body'>
					{!seriesConfig.length && (
						<div className='dropzone-root' {...getRootProps()}>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p>Drop the files here ...</p>
							) : (
								<p>Drag 'n' drop .csv data file here, or click to select file</p>
							)}
						</div>
					)}
					{!!seriesConfig.length && (
						<div className='series'>
							<div className='heading'>Configure Chart</div>
							<div className='size-selector'>
								<div className='config-box'>
									<label htmlFor=''>Width</label>
									<input
										type='number'
										value={chartSize.chartWidth}
										//@ts-ignore
										onChange={(e) => setChartSize(() => ({ chartWidth: Number(e.target.value) }))}
									/>
									<label htmlFor=''>Height</label>
									<input
										type='number'
										value={chartSize.chartHeight}
										//@ts-ignore
										onChange={(e) => setChartSize(() => ({ chartHeight: Number(e.target.value) }))}
									/>
								</div>
							</div>
							<div className='series-body'>
								{seriesConfig.map((s, id) => (
									<SeriesConfig
										key={s.name}
										seriesId={id}
										name={s.name}
										updateHandler={(config) => updateAt(id, config)}
									></SeriesConfig>
								))}
							</div>
							<div className='series-footer'>
								<button onClick={generateChartConfig}>Start</button>
								<span> or </span>
								<button onClick={clear}>Select different file</button>
							</div>
						</div>
					)}
				</div>
			</div>
			{!showModal && data && templateConfig && (
				<LiveEditor data={data} initialConfig={templateConfig}></LiveEditor>
			)}
		</div>
	)
}

export default Editor
