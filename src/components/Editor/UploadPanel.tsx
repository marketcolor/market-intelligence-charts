import { useCallback, useState } from 'react'
import { utcParse } from 'd3'
import { Button, Card, Uploader } from 'rsuite'
import Papa from 'papaparse'

import { presets } from '@data/presets'

import { Select } from './LiveEditor/Inputs'

import type { FileType } from 'rsuite/esm/Uploader'
import type { BandChartDataEntry, ChartDataEntry, QuantChartDataEntry } from '@/types'

import { ChartType } from '@/enums'

type BasePreset = {
	type: ChartType
}

type BasePresets = {
	[key: string]: BasePreset
}
const basePresets: BasePresets = {
	'Base time': {
		type: ChartType.Time,
	},
	'Base quant': {
		type: ChartType.Quant,
	},
	'Base band': {
		type: ChartType.Band,
	},
}

const allPresets = { ...basePresets, ...presets }
const presetOptions = Object.keys(allPresets).map((preset) => ({ label: preset, value: preset }))

const dateParser = utcParse('%d/%m/%Y')

export default function UploadPanel({ handleUpload }: { handleUpload: Function }) {
	const [selectedPreset, setSelectedPreset] = useState()
	const [uploadedFile, setUploadedFile] = useState<FileType>()

	const processData = useCallback(() => {
		const file = uploadedFile?.blobFile
		if (!!file && !!selectedPreset) {
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

						const presetType = allPresets[selectedPreset].type
						const data: ChartDataEntry[] | undefined =
							presetType === ChartType.Time
								? dataset.map(([dateStr, ...values]) => [dateParser(dateStr)!, ...values] as ChartDataEntry)
								: presetType === ChartType.Quant
								? (dataset as unknown as QuantChartDataEntry[])
								: presetType === ChartType.Band
								? (dataset as unknown as BandChartDataEntry[])
								: undefined
						if (data === undefined) {
							throw new Error(`Chart type ${presetType} is not valid type`)
						}

						handleUpload(data, allPresets[selectedPreset], series)
					}
				},
			})
		}
	}, [selectedPreset, uploadedFile])

	return (
		<Card>
			<Card.Header>Upload files</Card.Header>
			<Card.Body>
				<Uploader
					name='data-upload'
					accept='text/csv'
					draggable
					autoUpload
					multiple={false}
					onSuccess={(res, file) => setUploadedFile(file)}
					onRemove={() => setUploadedFile(undefined)}
					action={''}
				>
					<div>
						<div className='upload-inner'>Click or Drag data file</div>
					</div>
				</Uploader>
			</Card.Body>
			<Card.Footer>
				<div className='upload-footer-inner'>
					<Select
						label={'Select preset'}
						value={selectedPreset}
						options={presetOptions}
						handleChange={(v: string) => setSelectedPreset(v)}
					></Select>
					<Button disabled={!uploadedFile || !selectedPreset} onClick={processData}>
						Generate chart
					</Button>
				</div>
			</Card.Footer>
		</Card>
	)
}
