import { useEffect, useState } from 'react'
import { useObjectState } from '@uidotdev/usehooks'

import { InputBlock, NumberInput, DateInput, Select, CheckboxInput, TextInput } from './Inputs'

import type { TimeAxisConfig } from '@/types'

const TimeAxisConfigPanel = ({
	initialConfig,
	handleChange,
}: {
	initialConfig: TimeAxisConfig
	handleChange: Function
}) => {
	const [guideLines, setGuideLines] = useState<boolean>(!!initialConfig.guideLines)
	const [label, setLabel] = useState<string | undefined>(initialConfig.label)

	const [ticksConfig, setTicksConfig] = useObjectState({
		startDate: initialConfig.ticksConfig.startDate,
		numTicks: initialConfig.ticksConfig.numTicks,
		dateInterval: initialConfig.ticksConfig.dateInterval,
		intervalStep: initialConfig.ticksConfig.intervalStep,
		dateFormat: initialConfig.ticksConfig.dateFormat || '%m/%y',
	})

	useEffect(() => {
		handleChange({
			...initialConfig,
			ticksConfig,
			guideLines,
			label,
		})
	}, [ticksConfig, guideLines, label])

	return (
		<InputBlock numColumns='2'>
			<DateInput
				label='Start date'
				value={ticksConfig.startDate}
				//@ts-ignore
				handleChange={(v: Date) => setTicksConfig(() => ({ startDate: v }))}
			></DateInput>
			<Select
				label='Date interval'
				value={ticksConfig.dateInterval}
				options={[{ value: 'day' }, { value: 'month' }, { value: 'year' }]}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ dateInterval: v }))}
			></Select>
			<NumberInput
				label='Ticks number'
				value={ticksConfig.numTicks}
				min={2}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ numTicks: v }))}
			></NumberInput>
			<NumberInput
				label='Step'
				value={ticksConfig.intervalStep}
				min={1}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ intervalStep: v }))}
			></NumberInput>
			<Select
				label='Date format'
				value={ticksConfig.dateFormat}
				options={[
					{ value: '%m/%y', label: 'mm/yy' },
					{ value: '%m/%Y', label: 'mm/yyyy' },
					{ value: '%Y', label: 'yyyy' },
				]}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ dateFormat: v }))}
			></Select>
			<CheckboxInput
				label='Guide lines'
				value={guideLines}
				//@ts-ignore
				handleChange={(v) => setGuideLines(v)}
			></CheckboxInput>
			<TextInput
				label='Label'
				value={label || ''}
				//@ts-ignore
				handleChange={(v) => setLabel(v)}
			></TextInput>
		</InputBlock>
	)
}

export default TimeAxisConfigPanel
