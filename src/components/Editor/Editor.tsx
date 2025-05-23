'use client'

import { useCallback, useState } from 'react'
import Papa from 'papaparse'
import { timeParse } from 'd3'
import { useList, useObjectState } from '@uidotdev/usehooks'

import UploadPanel from './UploadPanel'
import ConfigurationPanel from './ConfigurationPanel'
import LiveEditor from './LiveEditor'

import { getXAxisConfig, getYAxisConfig } from '@/lib/chartUtils'

import type { SeriesConfigProps } from './ConfigurationPanel'
import type { TimelineChartConfig, TimelineChartDataEntry } from '@/types'
import { ChartColor } from '@/enums'

import './editor.scss'

const dateParser = timeParse('%d/%m/%Y')

// const tempSeriesConfig = [
// 	{
// 		name: 'Relative P/E',
// 		legend: 'Relative P/E',
// 		showLegend: true,
// 		type: 'lineChart',
// 		color: '#00A758',
// 		side: 'left',
// 	},
// ]

const Editor = () => {
	const [data, setData] = useState<TimelineChartDataEntry[]>()
	const [chartSize, setChartSize] = useObjectState<{ chartWidth: number; chartHeight: number }>({
		chartWidth: 800,
		chartHeight: 500,
	})
	const [info, setInfo] = useObjectState<{ title: string; description: string }>({
		title: '',
		description: '',
	})
	const [showLiveEditor, setShowLiveEditor] = useState<boolean>(false)
	const [seriesConfig, { set, updateAt, clear }] = useList<SeriesConfigProps>()
	const [templateConfig, setTemplateConfig] = useState<TimelineChartConfig>()

	const handleFileDrop = useCallback((file: File) => {
		if (!!file) {
			Papa.parse(file, {
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

	const generateChartConfig = useCallback(() => {
		if (data) {
			const chartConfig: TimelineChartConfig = {
				...info,
				width: chartSize.chartWidth,
				height: chartSize.chartHeight,
				xAxisConfig: getXAxisConfig(data),
				yAxisConfig: getYAxisConfig(data, seriesConfig),
				legend: seriesConfig
					// .filter((s) => s.showLegend)
					.map((c) => ({ text: c.legend, hide: !c.showLegend, color: c.color as ChartColor })),
				//@ts-ignore
				modules: seriesConfig.map((c, id) => ({
					type: c.type,
					series: id,
					side: c.side,
					color: c.color as ChartColor,
				})),
			}

			setTemplateConfig(chartConfig)
			setShowLiveEditor(true)
		}
	}, [seriesConfig, chartSize, info, data])

	return (
		<div className='editor' data-live-editor={showLiveEditor}>
			{!seriesConfig.length && <UploadPanel handleUpload={handleFileDrop}></UploadPanel>}
			{!!seriesConfig.length && !showLiveEditor && (
				<ConfigurationPanel
					seriesConfig={seriesConfig}
					chartSize={chartSize}
					updateChartSize={setChartSize}
					info={info}
					updateInfo={setInfo}
					updateSeriesConfig={updateAt}
					clearSeriesConfig={clear}
					generateChartConfig={generateChartConfig}
				></ConfigurationPanel>
			)}

			{showLiveEditor && data && templateConfig && (
				<LiveEditor
					data={data}
					initialConfig={templateConfig}
					series={seriesConfig.map((s) => s.name)}
				></LiveEditor>
			)}
		</div>
	)
}

export default Editor
