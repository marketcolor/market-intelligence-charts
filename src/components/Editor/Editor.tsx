'use client'

import { useCallback, useLayoutEffect, useState } from 'react'
import { useList, useObjectState } from '@uidotdev/usehooks'

import UploadPanel from './UploadPanel'
import LiveEditor from './LiveEditor'

import { getXAxisConfig, getYAxisConfig } from '@/lib/chartUtils'

import type { SeriesConfigProps } from './ConfigurationPanel'
import type {
	CartesianChartScales,
	ChartConfig,
	ChartDataEntry,
	QuantChartDataEntry,
} from '@/types'
import { ChartType, ModuleType, YAxisSide } from '@/enums'

import './editor.scss'

import { chartColorSchema } from '@/chart-config-schema'

const colorKeys = Object.keys(chartColorSchema.Values)

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

const Editor = ({ propPreset }: { propPreset?: Partial<ChartConfig> }) => {
	const [data, setData] = useState<ChartDataEntry[]>()
	const [preset, setPreset] = useState<Partial<ChartConfig>>()

	const [chartSize, setChartSize] = useObjectState<{ chartWidth: number; chartHeight: number }>({
		chartWidth: propPreset?.width || 800,
		chartHeight: propPreset?.height || 500,
	})
	const [info, setInfo] = useObjectState<{ title: string; description: string }>({
		title: propPreset?.title || '',
		description: propPreset?.description || '',
	})

	const [showLiveEditor, setShowLiveEditor] = useState<boolean>(false)
	const [seriesConfig, { set, updateAt, clear }] = useList<SeriesConfigProps>()
	const [templateConfig, setTemplateConfig] = useState<ChartConfig>()

	const handleFileUpload = useCallback(
		(data: ChartDataEntry[], uploadPreset: Partial<ChartConfig>, series: string[]) => {
			const seriesCfg = series.map((s: string, id: number) => {
				const presetModule = uploadPreset?.modules?.[id]
				return {
					series: id,
					name: s,
					type: ModuleType.LineChart,
					color: colorKeys[id % colorKeys.length],
					side: YAxisSide.Left,
					legend: {
						text: s,
					},
					...presetModule,
				}
			})
			//@ts-ignore
			set(seriesCfg)
			setData(data)
			setPreset(uploadPreset)
		},
		[]
	)

	const generateChartConfig = useCallback(() => {
		if (data) {
			const chartConfig: ChartConfig = {
				type: ChartType.Time,
				width: chartSize.chartWidth,
				height: chartSize.chartHeight,
				...preset,
				marginAdjust: {
					...preset?.marginAdjust,
				},
				//@ts-ignore
				xAxisConfig: getXAxisConfig(data, chartSize.chartWidth, preset?.xAxisConfig, preset?.type),
				yAxisConfig: getYAxisConfig(
					data as QuantChartDataEntry[],
					seriesConfig.filter(({ type }) => type !== ModuleType.PeriodAreas),
					chartSize.chartHeight,
					preset?.yAxisConfig as CartesianChartScales['y'],
					preset?.type
				),
				//@ts-ignore
				modules: seriesConfig,
			}

			setTemplateConfig(chartConfig)
			setShowLiveEditor(true)
		}
	}, [seriesConfig, chartSize, preset])

	useLayoutEffect(() => {
		if (data && seriesConfig.length && preset) {
			generateChartConfig()
		}
	}, [data, seriesConfig, preset])

	return (
		<div className='editor' data-live-editor={showLiveEditor}>
			{!seriesConfig.length && <UploadPanel handleUpload={handleFileUpload}></UploadPanel>}

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
