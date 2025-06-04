import { useEffect, useState } from 'react'
import { useObjectState } from '@uidotdev/usehooks'

import { CheckboxInput, InputBlock, NumberInput, Select, TextInput } from './Inputs'

import type { QuantAxisConfig } from '@/types'
import { TickFontSizesOptions } from '@/lib/configUtils'

type Props = {
	initialConfig: QuantAxisConfig
	handleChange: Function
}

const QuantAxisConfigPanel = ({ initialConfig, handleChange }: Props) => {
	const [guideLines, setGuideLines] = useState<boolean>(!!initialConfig.guideLines)
	const [label, setLabel] = useState<string | undefined>(initialConfig.label)
	const [hideTicks, setHideTicks] = useState<boolean>(!!initialConfig.hideTicks)

	const [domain, setDomain] = useObjectState({
		start: initialConfig.domain![0],
		end: initialConfig.domain![1],
	})

	const [ticksConfig, setTicksConfig] = useObjectState({
		startVal: initialConfig.ticksConfig?.startVal,
		numTicks: initialConfig.ticksConfig?.numTicks,
		tickInterval: initialConfig.ticksConfig?.tickInterval,
		decimals: initialConfig.ticksConfig?.format?.decimals,
		fontSize: initialConfig.ticksConfig?.fontSize || 'default',
	})

	useEffect(() => {
		handleChange({
			...initialConfig,
			domain: [domain.start, domain.end],
			ticksConfig: {
				...ticksConfig,
				format: {
					...initialConfig.ticksConfig?.format,
					decimals: ticksConfig.decimals,
				},
			},
			guideLines,
			hideTicks,
			label,
		})
	}, [domain, ticksConfig, guideLines, hideTicks, label])

	return (
		<InputBlock numColumns='2'>
			<NumberInput
				label='From'
				value={domain.start}
				//@ts-ignore
				handleChange={(v) => setDomain(() => ({ start: Number(v) }))}
			></NumberInput>
			<NumberInput
				label='To'
				value={domain.end}
				//@ts-ignore
				handleChange={(v) => setDomain(() => ({ end: Number(v) }))}
			></NumberInput>
			<NumberInput
				label='Start value'
				value={ticksConfig.startVal!}
				// min={2}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ startVal: Number(v) }))}
			></NumberInput>
			<NumberInput
				label='Ticks number'
				value={ticksConfig.numTicks!}
				min={0}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ numTicks: Number(v) }))}
			></NumberInput>
			<NumberInput
				label='Step'
				value={ticksConfig.tickInterval!}
				min={0}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ tickInterval: Number(v) }))}
			></NumberInput>
			<NumberInput
				label='Decimals'
				value={ticksConfig.decimals!}
				min={0}
				max={3}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ decimals: Number(v) }))}
			></NumberInput>
			<CheckboxInput
				label='Guide lines'
				value={guideLines}
				//@ts-ignore
				handleChange={(v) => setGuideLines(v)}
			></CheckboxInput>
			<CheckboxInput
				label='Hide ticks'
				value={hideTicks}
				//@ts-ignore
				handleChange={(v) => setHideTicks(v)}
			></CheckboxInput>
			<TextInput
				label='Label'
				value={label || ''}
				//@ts-ignore
				handleChange={(v) => setLabel(v)}
			></TextInput>
			<Select
				label='Font size'
				value={ticksConfig.fontSize}
				options={TickFontSizesOptions}
				//@ts-ignore
				handleChange={(v) => setTicksConfig(() => ({ fontSize: v }))}
			></Select>
		</InputBlock>
	)
}

export default QuantAxisConfigPanel
