import { ChartColor } from '@/enums'

export const ChartColorOptions = Object.entries(ChartColor)
	.map(([label, value]) => ({ label, value }))
	.filter(({ label }) => label !== 'RecessionGrey')
