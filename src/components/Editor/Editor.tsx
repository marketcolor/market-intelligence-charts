'use client'

import { useCallback, useLayoutEffect, useState } from 'react'
import Papa from 'papaparse'
import { utcParse } from 'd3'
import { useList, useObjectState } from '@uidotdev/usehooks'

import UploadPanel from './UploadPanel'
import ConfigurationPanel from './ConfigurationPanel'
import LiveEditor from './LiveEditor'

import { getXAxisConfig, getYAxisConfig } from '@/lib/chartUtils'

import type { SeriesConfigProps } from './ConfigurationPanel'
import type { ChartConfig, ChartDataEntry } from '@/types'
import { ModuleType } from '@/enums'

import './editor.scss'

const dateParser = utcParse('%d/%m/%Y')

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

const Editor = ({ preset }: { preset?: Partial<ChartConfig> }) => {
	const [data, setData] = useState<ChartDataEntry[]>()
	const [chartSize, setChartSize] = useObjectState<{ chartWidth: number; chartHeight: number }>({
		chartWidth: preset?.width || 800,
		chartHeight: preset?.height || 500,
	})
	const [info, setInfo] = useObjectState<{ title: string; description: string }>({
		title: preset?.title || '',
		description: preset?.description || '',
	})
	const [showLiveEditor, setShowLiveEditor] = useState<boolean>(false)
	const [seriesConfig, { set, updateAt, clear }] = useList<SeriesConfigProps>()
	const [templateConfig, setTemplateConfig] = useState<ChartConfig>()

	const handleFileDrop = useCallback(
		(file: File) => {
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
							const data: ChartDataEntry[] = dataset.map(([dateStr, ...values]) => [
								dateParser(dateStr)!,
								...values,
							])
							setData(data)
							set(
								series.map((s: string, id: number) => {
									const seriesName = preset?.modules?.[id] ? series[preset.modules[id].series] : s
									return {
										name: seriesName,
										series: id,
										type: ModuleType.LineChart,
										legend: {
											text: seriesName,
										},
										...(preset?.modules?.[id]?.type !== 'periodAreas' && {
											side: preset?.modules?.[id].side,
										}),
										...(preset?.modules?.[id]?.type !== 'periodAreas' && {
											color: preset?.modules?.[id].color,
										}),
										...(preset?.modules?.[id] && { ...preset.modules[id] }),
									}
								})
							)
						}
					},
				})
			}
		},
		[preset]
	)

	const generateChartConfig = useCallback(() => {
		if (data) {
			const chartConfig: ChartConfig = {
				...info,
				width: chartSize.chartWidth,
				height: chartSize.chartHeight,
				xAxisConfig: getXAxisConfig(data, preset?.xAxisConfig?.ticksConfig),
				yAxisConfig: getYAxisConfig(
					data,
					seriesConfig.filter(({ type }) => type !== ModuleType.PeriodAreas),
					chartSize.chartHeight
				),
				//@ts-ignore
				modules: seriesConfig,
			}

			setTemplateConfig(chartConfig)
			setShowLiveEditor(true)
		}
	}, [seriesConfig, chartSize, info, data, preset])

	useLayoutEffect(() => {
		if (preset && data && seriesConfig.length) {
			generateChartConfig()
		}
	}, [preset, data, seriesConfig])

	return (
		<div className='editor' data-live-editor={showLiveEditor}>
			{!seriesConfig.length && <UploadPanel handleUpload={handleFileDrop}></UploadPanel>}
			{!!seriesConfig.length && !showLiveEditor && !preset && (
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
