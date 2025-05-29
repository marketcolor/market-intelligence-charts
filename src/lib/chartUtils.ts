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
} from 'd3'

import type { ScaleLinear, ScaleTime } from 'd3'

import type {
	DateInterval,
	NumericTicksConfig,
	TickObject,
	TimelineChartDataEntry,
	TimelineTicksConfig,
	YAxisConfig,
} from '@types'

import type { YAxisSide } from '@/enums'

export const getLinearScale = (
	domain: [number, number],
	range: [number, number]
): ScaleLinear<number, number, never> => {
	return scaleLinear(domain, range)
}

export const getTimeScale = (
	data: TimelineChartDataEntry[],
	range: [number, number]
): ScaleTime<number, number, never> => {
	const timeDomain = getTimeDomain(data, 0)

	return scaleTime(timeDomain, range)
}

export const getNumericTicks = (config: NumericTicksConfig): TickObject<number>[] => {
	const { startVal, tickInterval, numTicks = 0, decimals } = config
	const stopVal = startVal + tickInterval * numTicks
	const tickValues = range(startVal, stopVal, tickInterval)

	const formatter = format(decimals !== undefined ? `,.${decimals}f` : '')

	return tickValues.map((value, id) => {
		const label = formatter(value)
		return { value, label }
	})
}

export function getDateTicks(config: TimelineTicksConfig): TickObject<Date>[] {
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
	data: TimelineChartDataEntry[],
	xSeries: number,
	xScale: ScaleTime<number, number, never>,
	ySeries: number,
	yScale: ScaleLinear<number, number, never>
): string | null => {
	const lineFunc = line<TimelineChartDataEntry>()
		.x((entry) => xScale(entry[xSeries] as any) as number)
		.y((entry) => yScale(entry[ySeries] as any) as number)

	return lineFunc(data)
}

export const getAreaString = (
	data: TimelineChartDataEntry[],
	xSeries: number,
	xScale: ScaleTime<number, number, never>,
	ySeries: number,
	yScale: ScaleLinear<number, number, never>,
	baseline: number,
	curve?: string
): string | null => {
	const lineFunc = area<TimelineChartDataEntry>()
		.x((entry) => xScale(entry[xSeries] as any) as number)
		.y0((entry) => yScale(entry[ySeries] as any) as number)
		.y1((entry) => baseline)
	// .curve(getCurveFunc(curve || 'linear'))

	return lineFunc(data)
}

export const getPeriodAreaString = (
	data: TimelineChartDataEntry[],
	xSeries: number,
	xScale: ScaleTime<number, number, never>,
	ySeries: number,
	height: number
): string | null => {
	const lineFunc = area<TimelineChartDataEntry>()
		.x((entry) => xScale(entry[xSeries] as any) as number)
		.y0((entry) => 0)
		.y1((entry) => (entry[ySeries] === 1 ? height : 0))
		.curve(curveStep)

	return lineFunc(data)
}

export const getTimeDomain = (data: TimelineChartDataEntry[], timeSeries: number) => {
	return extent(data, (d) => d[timeSeries]) as [Date, Date]
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

export const getTimeTicksConfig = (domain: [Date, Date], preset?: Partial<TimelineTicksConfig>) => {
	const ticks = utcTicks(domain[0], domain[1], 9)
	const [start, end] = ticks
	const { dateInterval, intervalStep } = getTimeInterval(start, end)

	const config: TimelineTicksConfig = {
		startDate: preset?.startDate || start,
		numTicks: preset?.numTicks || ticks.length,
		dateInterval: preset?.dateInterval || dateInterval,
		intervalStep: preset?.intervalStep || intervalStep,
		dateFormat: preset?.dateFormat || '%m/%y',
	}

	return config
}

export const getXAxisConfig = (
	data: TimelineChartDataEntry[],
	preset?: Partial<TimelineTicksConfig>
) => {
	const domain = extent(data, (d) => d[0]) as [Date, Date]

	const ticksConfig = getTimeTicksConfig(domain, preset)
	return { domain, ticksConfig }
}

export const getYAxisConfig = (
	data: TimelineChartDataEntry[],
	series: { side: YAxisSide }[],
	height = 500
) => {
	const sidesIndices = series.reduce((pv: { [key: string]: any }, s, id) => {
		if (!Object.hasOwn(pv, s.side)) {
			pv[s.side] = { dataIndices: [] }
		}
		pv[s.side].dataIndices.push(id + 1)
		return pv
	}, {})

	const numTicks = Math.round(height / 75)
	const config: { [key in YAxisSide]?: YAxisConfig } = {}

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

		config[key as YAxisSide] = {
			domain: niceDomain,
			guideLines: key === 'left',
			ticksConfig: {
				startVal: ticks[0],
				numTicks: ticks.length,
				tickInterval: ticks[1] - ticks[0],
				decimals,
			},
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
