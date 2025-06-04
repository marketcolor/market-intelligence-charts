import {
	area,
	format,
	line,
	scaleLinear,
	scaleTime,
	timeDay,
	timeMonth,
	timeWeek,
	timeYear,
	curveStep,
	extent,
	max,
	min,
	nice,
	ticks,
	tickStep,
	utcYear,
	utcMonth,
	utcFormat,
	utcTicks,
	range,
	curveLinear,
	curveNatural,
	scaleBand,
} from 'd3'

import type { ScaleBand, ScaleLinear, ScaleTime } from 'd3'

import type {
	DateInterval,
	QuantTicksConfig,
	TickObject,
	ChartDataEntry,
	TimeTicksConfig,
	QuantChartDataEntry,
	QuantChartDomain,
	TimeChartDataEntry,
	BandChartDataEntry,
	CartesianXScales,
	XAxisConfig,
	QuantAxisConfig,
	TimeAxisConfig,
	BandAxisConfig,
	Modules,
	CartesianYScales,
	CartesianChartScales,
} from '@types'

import { ChartType, ModuleType, YAxisSide } from '@/enums'

export const numberFormatter = (decimals: number, prefix?: string, suffix?: string) => {
	const d3Format = format(`.${decimals}f`)

	return (number: number) => `${prefix || ''}${d3Format(number)}${suffix || ''}`
}

export const getXAxisBandwidth = (modules: Modules[]): number => {
	const barChartModules = modules.filter((m) => m.type === ModuleType.BarChart)
	return max(barChartModules, (m) => m.barWidth) || 0
}

export const getTimeDomain = (data: TimeChartDataEntry[], timeSeries: number) => {
	return extent(data, (d) => d[timeSeries]) as [Date, Date]
}

export const getBandDomain = (data: BandChartDataEntry[]) => {
	return data.map((d) => d[0])
}

export const getLinearScale = (
	domain: [number, number],
	range: [number, number]
): ScaleLinear<number, number, never> => {
	return scaleLinear(domain, range)
}

export const getTimeScale = (
	data: TimeChartDataEntry[],
	range: [number, number]
): ScaleTime<number, number, never> => {
	const timeDomain = getTimeDomain(data, 0)
	return scaleTime(timeDomain, range)
}

export const getQuantScale = (
	data: QuantChartDataEntry[],
	range: [number, number],
	domain?: QuantChartDomain
): ScaleLinear<number, number, never> => {
	const numericDomain = domain ? domain : (extent(data, (d) => d[0]) as [number, number])
	return scaleLinear(numericDomain, range)
}

export const getBandScale = (
	data: BandChartDataEntry[],
	range: [number, number],
	bandwidth: number
): ScaleBand<string> => {
	const domain = data.map((d) => d[0])
	const totalRange = Math.abs(range[1] - range[0])
	const totalPaddingOuterSpace = totalRange - bandwidth

	const paddingOuter = ((bandwidth / totalPaddingOuterSpace) * (domain.length - 1)) / 2

	return scaleBand(domain, range).paddingInner(1).paddingOuter(paddingOuter).align(0.5)
}

export const getCartesianXScale = (
	type: ChartType,
	data: ChartDataEntry[],
	range: [number, number],
	config: XAxisConfig,
	bandwidth: number
): CartesianXScales => {
	switch (type) {
		case ChartType.Time:
			return getTimeScale(data as TimeChartDataEntry[], range)
		case ChartType.Quant:
			const quantConfig = config as QuantAxisConfig
			return getQuantScale(data as QuantChartDataEntry[], range, quantConfig.domain)
		case ChartType.Band:
			const bandConfig = config as BandAxisConfig
			const bandData = data as BandChartDataEntry[]
			return getBandScale(bandData, range, bandwidth || 0)
	}
}

export const getQuantTicks = (config: QuantTicksConfig): TickObject<number>[] => {
	const { startVal, tickInterval, numTicks = 0, decimals } = config
	const stopVal = startVal + tickInterval * numTicks
	const tickValues = range(startVal, stopVal, tickInterval)

	const formatter = format(decimals !== undefined ? `,.${decimals}f` : '')

	return tickValues.map((value, id) => {
		const label = formatter(value)
		return { value, label }
	})
}

export const getBandTicks = (scale: ScaleBand<string>): TickObject<string>[] => {
	return scale.domain().map((band: string) => ({ value: band, label: band }))
}

export function getTimeTicks(config: TimeTicksConfig): TickObject<Date>[] {
	const { startDate, dateInterval, intervalStep, numTicks, dateFormat = '%b ʼ%y' } = config

	const intervals = {
		day: timeDay,
		week: timeWeek,
		month: timeMonth,
		year: timeYear,
	}
	const interval = intervals[dateInterval]
	if (!interval) {
		throw new Error('Invalid date interval')
	}
	const formatter = utcFormat(dateFormat)
	const intervalStartDate = typeof startDate === 'string' ? new Date(startDate) : startDate

	if (isNaN(intervalStartDate.getTime())) {
		throw new Error(`dateTicks - Invalid date: ${intervalStartDate}`)
	}

	return Array.from({ length: numTicks }, (_, i) => {
		const value = interval.offset(intervalStartDate, i * intervalStep)
		const label = formatter(value)

		return { value, label }
	})
}

export function getXAxisTicks(type: ChartType, config: XAxisConfig, scale: CartesianXScales) {
	switch (type) {
		case ChartType.Time:
			const timeTicksConfig = config as TimeAxisConfig
			return getTimeTicks(timeTicksConfig.ticksConfig)
		case ChartType.Quant:
			const quantTicksConfig = config as QuantAxisConfig
			if (!quantTicksConfig.ticksConfig) {
				throw new Error('Ticks are not configured')
			}
			return getQuantTicks(quantTicksConfig.ticksConfig)
		case ChartType.Band:
			return getBandTicks(scale as ScaleBand<string>)
	}
}

const getCurveFunc = (name: string) => {
	switch (name) {
		case 'linear':
			return curveLinear
		case 'step':
			return curveStep
		case 'natural':
			return curveNatural
		default:
			return curveLinear
	}
}
export const getPathString = (
	data: ChartDataEntry[],
	xSeries: number,
	xScale: CartesianXScales,
	ySeries: number,
	yScale: ScaleLinear<number, number, never>
): string | null => {
	const lineFunc = line<ChartDataEntry>()
		.x((entry) => xScale(entry[xSeries] as any) as number)
		.y((entry) => yScale(entry[ySeries] as any) as number)

	return lineFunc(data)
}

export const getAreaString = (
	data: ChartDataEntry[],
	xSeries: number,
	xScale: CartesianXScales,
	ySeries: number,
	yScale: ScaleLinear<number, number, never>,
	baseline: number,
	curve?: string
): string | null => {
	const lineFunc = area<ChartDataEntry>()
		.x((entry) => xScale(entry[xSeries] as any) as number)
		.y0((entry) => yScale(entry[ySeries] as any) as number)
		.y1((entry) => baseline)
		.curve(getCurveFunc(curve || 'linear'))

	return lineFunc(data)
}

export const getPeriodAreaString = (
	data: ChartDataEntry[],
	xSeries: number,
	xScale: CartesianXScales,
	ySeries: number,
	height: number
): string | null => {
	const lineFunc = area<ChartDataEntry>()
		.x((entry) => xScale(entry[xSeries] as any) as number)
		.y0((entry) => 0)
		.y1((entry) => (entry[ySeries] === 1 ? height : 0))
		.curve(curveStep)

	return lineFunc(data)
}

const getTimeInterval = (start: Date, end: Date) => {
	const yearInterval = utcYear.count(start, end)
	const monthInterval = utcMonth.count(start, end)

	const result = {
		dateInterval: 'day' as DateInterval,
		intervalStep: 1,
	}

	if (yearInterval) {
		result.dateInterval = 'year'
		result.intervalStep = yearInterval
	} else {
		result.dateInterval = 'month'
		result.intervalStep = monthInterval
	}
	return result
}

export const getTimeTicksConfig = (domain: [Date, Date], preset?: Partial<TimeTicksConfig>) => {
	const ticks = utcTicks(domain[0], domain[1], 9)
	const [start, end] = ticks
	const { dateInterval, intervalStep } = getTimeInterval(start, end)

	const config: TimeTicksConfig = {
		startDate: preset?.startDate || start,
		numTicks: preset?.numTicks || ticks.length,
		dateInterval: preset?.dateInterval || dateInterval,
		intervalStep: preset?.intervalStep || intervalStep,
		dateFormat: preset?.dateFormat || '%m/%y',
	}

	return config
}

export const getQuantTicksConfig = (domain: [number, number], range: [number, number]) => {
	const rangeVal = Math.abs(range[1] - range[0])
	const numTicks = Math.round(rangeVal / 100)

	const scale = scaleLinear(domain, range).nice(numTicks)
	const niceDomain = scale.domain() as [number, number]
	const ticks = scale.ticks(numTicks)

	const tickInterval = tickStep(ticks.at(0)!, ticks.at(-1)!, numTicks)
	const intervalParts = tickInterval.toString().split('.')
	const decimals = intervalParts.length === 1 ? 0 : intervalParts[1].length

	return {
		domain: niceDomain,
		ticksConfig: {
			startVal: ticks[0],
			numTicks: ticks.length,
			tickInterval: ticks[1] - ticks[0],
			decimals,
		},
	}
}

export const getXAxisConfig = (
	data: ChartDataEntry[],
	width = 900,
	preset?: Partial<XAxisConfig>,
	type?: ChartType
) => {
	const configType = type
	switch (configType) {
		case ChartType.Time: {
			const timeData = data as TimeChartDataEntry[]
			const timePreset = (preset as TimeAxisConfig) || {}
			const domain = extent(timeData, (d) => d[0]) as [Date, Date]

			const ticksConfig = getTimeTicksConfig(domain, timePreset.ticksConfig)
			return { domain, ticksConfig }
		}
		case ChartType.Quant: {
			const quantData = data as QuantChartDataEntry[]
			const domain = extent(quantData, (d) => d[0]) as [number, number]

			const ticksConfig = getQuantTicksConfig(domain, [0, width])
			return { domain, ticksConfig, ...preset }
		}
		case ChartType.Band: {
			const bandPreset = (preset as BandAxisConfig) || {}
			return {
				...bandPreset,
				...(bandPreset.ticksConfig && { ticksConfig: { ...bandPreset.ticksConfig } }),
			}
		}
	}
	throw new Error(`Chart type ${configType} is not defined`)
}

export const getYAxisConfig = (
	data: QuantChartDataEntry[],
	series: { side: YAxisSide }[],
	height = 500,
	preset?: CartesianChartScales['y'],
	type?: ChartType
) => {
	const sidesIndices = series.reduce((pv: { [key: string]: any }, s, id) => {
		if (!Object.hasOwn(pv, s.side)) {
			pv[s.side] = { dataIndices: [] }
		}
		pv[s.side].dataIndices.push(id + 1)
		return pv
	}, {})

	const numTicks = Math.round(height / 75)
	const config: { [key in YAxisSide]?: QuantAxisConfig } = {}

	for (const [key, { dataIndices }] of Object.entries(sidesIndices)) {
		const domain: [number, number] = [
			min(data, (d) => min(d.filter((e, id) => dataIndices.includes(id)))) as number,
			max(data, (d) => max(d.filter((e, id) => dataIndices.includes(id)))) as number,
		]
		const scale = scaleLinear(domain, [height, 0]).nice(numTicks)
		const niceDomain = scale.domain() as [number, number]
		const ticks = scale.ticks(numTicks)

		const tickInterval = tickStep(ticks.at(0)!, ticks.at(-1)!, numTicks)
		const intervalParts = tickInterval.toString().split('.')
		const decimals = intervalParts.length === 1 ? 0 : intervalParts[1].length

		const sidePreset = preset?.[key as YAxisSide] || {}
		config[key as YAxisSide] = {
			domain: niceDomain,
			guideLines: key === 'left',
			ticksConfig: {
				startVal: ticks[0],
				numTicks: ticks.length,
				tickInterval: ticks[1] - ticks[0],
				decimals,
			},
			...sidePreset,
		}
	}

	if (config.left && config.right) {
		const targetNumTicks = Math.max(
			config.left.ticksConfig!.numTicks!,
			config.right.ticksConfig!.numTicks!
		)

		if (config.left.ticksConfig!.numTicks < targetNumTicks) {
			getExtendedTicksConfig(config.left, targetNumTicks)
		}
		if (config.right.ticksConfig!.numTicks < targetNumTicks) {
			getExtendedTicksConfig(config.right, targetNumTicks)
		}
	}

	return config
}

const getExtendedTicksConfig = (config: YAxisConfig, numTicks: number): YAxisConfig => {
	const { domain, ticksConfig } = config
	let increment = ticksConfig!.tickInterval / 2
	let exDomain
	let exTicks
	let count = 0

	while (count < 10) {
		exDomain = nice(domain[0], domain[1] + increment * count, numTicks)
		exTicks = ticks(...exDomain, numTicks)
		if (exTicks.length === numTicks) {
			count = 11
		} else {
			count++
		}
	}
	if (exTicks && exTicks.length === numTicks) {
		const tickInterval = exTicks![1] - exTicks![0]
		const intervalParts = tickInterval.toString().split('.')
		const decimals = intervalParts.length === 1 ? 0 : intervalParts[1].length

		config.domain = exDomain as [number, number]
		config.ticksConfig = {
			numTicks,
			startVal: exDomain![0],
			tickInterval: tickInterval,
			decimals,
		}
	}
}

// const chartBandScale = (config: BandScaleConfig, range: [number, number]): ScaleBand<string> => {
// 	const { domain, bandwidth } = config
// 	const totalRange = Math.abs(range[1] - range[0])
// 	const totalPaddingOuterSpace = totalRange - bandwidth
// 	const paddingOuter = ((bandwidth / totalPaddingOuterSpace) * (domain.length - 1)) / 2

// 	return scaleBand(domain, range).paddingInner(1).paddingOuter(paddingOuter).align(0.5)
// }

// const chartTimeScale = (config: TimeScaleConfig, range: [number, number]): ScaleTimeString => {
// 	const { domain, seriesFormat = '%Y-%m-%d' } = config
// 	const dateDomain = domain.map((date) => {
// 		const parsedDate = typeof date === 'string' ? new Date(date) : date
// 		if (isNaN(parsedDate.getTime())) {
// 			throw new Error(`dateScale - Invalid date: ${date}`)
// 		}
// 		return parsedDate
// 	})

// 	const scale = scaleTime(dateDomain, range)
// 	const parser = timeParse(seriesFormat)

// 	return (date: string | Date): number => {
// 		const parsedDate = typeof date === 'string' ? parser(date) : date

// 		if (!parsedDate) {
// 			throw new Error(`chartTimeScale - Invalid date format: ${date}`)
// 		}
// 		return scale(parsedDate)
// 	}
// }

// export const getChartScale = (
// 	config: ScaleConfig | undefined,
// 	range: [number, number]
// ): ScaleLinear<number, number, never> | ScaleTimeString | ScaleBand<string> | undefined => {
// 	if (!config) {
// 		return
// 	}

// 	const { type } = config

// 	switch (type) {
// 		case 'linear':
// 			return chartLinearScale(config, range)
// 		case 'time':
// 			return chartTimeScale(config, range)
// 		case 'band':
// 			return chartBandScale(config, range)
// 		default:
// 			return
// 	}
// }

// type TicksReturn<T extends number | string | Date> = {
// 	value: T
// 	label: string
// }

// const numericTicks = (config: NumericTicks): TicksReturn<number>[] => {
// 	const { startVal, tickInterval, numTicks, numberFormat = '' } = config
// 	const formatter = format(numberFormat)
// 	return new Array(numTicks).fill(startVal).map((t, id) => {
// 		const value = t + id * tickInterval
// 		const label = formatter(value)
// 		return { value, label }
// 	})
// }

// function bandTicks(config: BandTicks) {
// 	return config.ticks.map((tick) => ({ value: tick, label: tick }))
// }

// export const getTicks = (
// 	config: TicksConfig | undefined
// ): TicksReturn<number | string | Date>[] | undefined => {
// 	if (!config) {
// 		return
// 	}

// 	const { type } = config
// 	switch (type) {
// 		case 'numeric':
// 			return numericTicks(config)
// 		case 'date':
// 			return dateTicks(config)
// 		case 'band':
// 			return bandTicks(config)
// 		default:
// 			return
// 	}
// }
