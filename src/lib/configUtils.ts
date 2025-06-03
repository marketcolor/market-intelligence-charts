import { ChartColor } from '@/enums'
import { fontSizes } from '@/styles/theme'

export const ChartColorOptions = Object.entries(ChartColor)
	.map(([label, value]) => ({ label, value: label }))
	.filter(({ label }) => label !== 'RecessionGrey')

export const TickFontSizesOptions = Object.keys(fontSizes.ticks).map((value) => ({
	label: value,
	value,
}))
