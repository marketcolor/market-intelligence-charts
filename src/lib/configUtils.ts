import { ChartColor } from '@/enums'

export const ChartColorOptions = Object.entries(ChartColor)
	.map(([label, value]) => ({ label, value: label }))
	.filter(({ label }) => label !== 'RecessionGrey')
