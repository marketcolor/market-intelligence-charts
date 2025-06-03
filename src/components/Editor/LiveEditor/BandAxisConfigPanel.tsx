import { useEffect, useState } from 'react'

import { InputBlock, Select, CheckboxInput, TextInput } from './Inputs'

import type { BandAxisConfig } from '@/types'
import { fontSizes } from '@/styles/theme'
import { TickFontSizesOptions } from '@/lib/configUtils'

const BandAxisConfigPanel = ({
	initialConfig,
	handleChange,
}: {
	initialConfig: BandAxisConfig
	handleChange: Function
}) => {
	const [guideLines, setGuideLines] = useState<boolean>(!!initialConfig.guideLines)
	const [label, setLabel] = useState<string | undefined>(initialConfig.label)
	const [fontSize, setFontSize] = useState<string>(initialConfig.ticksConfig?.fontSize || 'default')

	useEffect(() => {
		handleChange({
			...initialConfig,
			guideLines,
			label,
			ticksConfig: { fontSize },
		})
	}, [guideLines, label, fontSize])

	return (
		<InputBlock numColumns='2'>
			<Select
				label='Font size'
				value={fontSize}
				options={TickFontSizesOptions}
				//@ts-ignore
				handleChange={(v) => setFontSize(v)}
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

export default BandAxisConfigPanel
