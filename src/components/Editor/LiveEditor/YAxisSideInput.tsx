import type { YAxisSide } from '@/enums'
import { CheckboxInput, InputBlock, NumberInput, Select, TextInput } from './Inputs'
import { useObjectState } from '@uidotdev/usehooks'
import type { YAxisConfig } from '@/types'
import { useEffect, useState } from 'react'

type Props = {
	side: YAxisSide
	initialConfig: YAxisConfig
	handleChange: Function
}

const YAxisSideInput = ({ side, initialConfig, handleChange }: Props) => {
	const [guideLines, setGuideLines] = useState<boolean>(!!initialConfig.guideLines)
	const [label, setLabel] = useState<string | undefined>(initialConfig.label)

	const [domain, setDomain] = useObjectState({
		start: initialConfig.domain[0],
		end: initialConfig.domain[1],
	})

	const [yAxisTicks, setYAxisTicks] = useObjectState({
		startVal: initialConfig.ticksConfig?.startVal,
		numTicks: initialConfig.ticksConfig?.numTicks,
		tickInterval: initialConfig.ticksConfig?.tickInterval,
		decimals: initialConfig.ticksConfig?.decimals,
	})

	useEffect(() => {
		handleChange({
			...initialConfig,
			domain: [domain.start, domain.end],
			ticksConfig: yAxisTicks,
			guideLines,
			label,
		})
	}, [domain, yAxisTicks, guideLines, label])

	return (
		<div className='y-axis-side'>
			<div className='subtitle'>{side} y axis</div>
			<InputBlock numColumns='4'>
				<NumberInput
					label='From'
					value={domain.start}
					hasRange={false}
					//@ts-ignore
					handleChange={(v) => setDomain(() => ({ start: Number(v) }))}
				></NumberInput>
				<NumberInput
					label='To'
					value={domain.end}
					hasRange={false}
					//@ts-ignore
					handleChange={(v) => setDomain(() => ({ end: Number(v) }))}
				></NumberInput>
				<NumberInput
					label='Start value'
					value={yAxisTicks.startVal!}
					// min={2}
					hasRange={false}
					//@ts-ignore
					handleChange={(v) => setYAxisTicks(() => ({ startVal: Number(v) }))}
				></NumberInput>
				<NumberInput
					label='Ticks number'
					value={yAxisTicks.numTicks!}
					min={2}
					hasRange={false}
					//@ts-ignore
					handleChange={(v) => setYAxisTicks(() => ({ numTicks: Number(v) }))}
				></NumberInput>
				<NumberInput
					label='Step'
					value={yAxisTicks.tickInterval!}
					min={0}
					hasRange={false}
					//@ts-ignore
					handleChange={(v) => setYAxisTicks(() => ({ tickInterval: Number(v) }))}
				></NumberInput>
				<NumberInput
					label='Decimals'
					value={yAxisTicks.decimals!}
					min={0}
					max={3}
					hasInput={false}
					//@ts-ignore
					handleChange={(v) => setYAxisTicks(() => ({ decimals: Number(v) }))}
				></NumberInput>
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
		</div>
	)
}

export default YAxisSideInput
