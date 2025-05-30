import { useObjectState } from '@uidotdev/usehooks'

import { ControlTab, InputBlock, NumberInput, DateInput, Select } from './Inputs'
import type { TimeTicksConfig } from '@/types'
import { useEffect } from 'react'

const TimeAxisTicksTab = ({
	initialConfig,
	handleUpdate,
}: {
	initialConfig: TimeTicksConfig
	handleUpdate: Function
}) => {
	const [xAxisTicks, setXAxisTicks] = useObjectState({
		startDate: initialConfig.startDate,
		numTicks: initialConfig.numTicks,
		dateInterval: initialConfig.dateInterval,
		intervalStep: initialConfig.intervalStep,
		dateFormat: initialConfig.dateFormat || '%m/%y',
	})

	useEffect(() => {
		handleUpdate(xAxisTicks)
	}, [xAxisTicks])

	return (
		<ControlTab title='X Axis Ticks'>
			<InputBlock numColumns='2'>
				<DateInput
					label='Start date'
					value={xAxisTicks.startDate}
					//@ts-ignore
					handleChange={(v: Date) => setXAxisTicks(() => ({ startDate: v }))}
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
	)
}

export default TimeAxisTicksTab
