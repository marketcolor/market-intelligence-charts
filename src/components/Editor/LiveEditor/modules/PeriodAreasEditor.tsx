import { useState, useEffect } from 'react'

import { CheckboxInput, TextInput } from '../Inputs'

import type { PeriodAreasConfig } from '@/types'
import { ChartColor } from '@/enums'

type PeriodAreaProps = {
	config: PeriodAreasConfig
	handleChange: Function
}

const PeriodAreasEditor = ({ config, handleChange }: PeriodAreaProps) => {
	const [legendText, setLegendText] = useState<string>(config.legend?.text || '')
	const [showLegend, setShowLegend] = useState<boolean>(!config.legend?.hide)

	useEffect(() => {
		handleChange({
			...config,
			color: ChartColor.RecessionGrey,
			legend: {
				text: legendText,
				hide: !showLegend,
			},
		})
	}, [legendText, showLegend])

	return (
		<>
			<CheckboxInput
				label='Show legend'
				value={showLegend}
				//@ts-ignore
				handleChange={(value) => setShowLegend(value)}
			></CheckboxInput>
			<TextInput
				label='Legend text'
				value={legendText}
				disabled={!showLegend}
				//@ts-ignore
				handleChange={(value) => setLegendText(value)}
			></TextInput>
		</>
	)
}

export default PeriodAreasEditor
