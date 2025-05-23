import {
	area,
	format,
	line,
	scaleLinear,
	scaleTime,
	timeDay,
	timeFormat,
	timeMonth,
	timeWeek,
	timeYear,
	curveStep,
	extent,
	max,
	min,
	utcTicks,
	utcYear,
	utcMonth,
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
	domain: [string, string] | [Date, Date],
	range: [number, number]
): ScaleTime<number, number, never> => {
	const timeDomain = domain.map((d) => (typeof d === 'string' ? new Date(d) : d))
	return scaleTime(timeDomain, range)
}

export const getNumericTicks = (config: NumericTicksConfig): TickObject<number>[] => {
	const { startVal, tickInterval, numTicks = 0, decimals } = config
	const formatter = format(decimals !== undefined ? `,.${decimals}f` : '')

	return new Array(numTicks).fill(startVal).map((t, id) => {
		const value = t + id * tickInterval
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
	const formatter = timeFormat(dateFormat)
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
	baseline: number
): string | null => {
	const lineFunc = area<TimelineChartDataEntry>()
		.x((entry) => xScale(entry[xSeries] as any) as number)
		.y0((entry) => yScale(entry[ySeries] as any) as number)
		.y1((entry) => baseline)

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

	const numTicks = Math.round(height / 50)
	const config: { [key in YAxisSide]?: YAxisConfig } = {}

	let primaryBaseDomain = [0, 100]

	for (const [key, { dataIndices }] of Object.entries(sidesIndices)) {
		const domain: [number, number] = [
			min(data, (d) => min(d.filter((e, id) => dataIndices.includes(id)))) as number,
			max(data, (d) => max(d.filter((e, id) => dataIndices.includes(id)))) as number,
		]
		if (Object.keys(config).length === 1) {
			const primConfig = config.left!
			// secondary scale should be adjusted to primary
			const M = (domain[1] - domain[0]) / (primaryBaseDomain[1] - primaryBaseDomain[0])
			const B = domain[0] - M * primaryBaseDomain[0]

			// Apply this transformation to the LEFT's *nice* domain
			// to get the *corresponding* domain for the right axis.
			const y2DerivedMin = M * primConfig.domain[0] + B
			const y2DerivedMax = M * primConfig.domain[1] + B

			// Create the right Y-Axis scale
			const ySecondaryScale = scaleLinear([y2DerivedMin, y2DerivedMax], [height, 0]).nice(numTicks)

			const secondaryDomain = ySecondaryScale.domain() as [number, number]

			const secondaryTicks = ySecondaryScale.ticks(numTicks)
			const tickInterval = secondaryTicks[1] - secondaryTicks[0]
			const intervalParts = tickInterval.toString().split('.')

			const decimals = intervalParts.length === 1 ? 0 : intervalParts[1].length

			config[key as YAxisSide] = {
				domain: secondaryDomain,
				guideLines: false,
				ticksConfig: {
					startVal: secondaryTicks[0],
					numTicks: secondaryTicks.length,
					tickInterval: secondaryTicks[1] - secondaryTicks[0],
					decimals,
				},
			}
		} else {
			primaryBaseDomain = domain
			const primaryYScale = scaleLinear(domain, [height, 0]).nice(numTicks)
			const primaryYDomain = primaryYScale.domain() as [number, number]
			const primaryTicks = primaryYScale.ticks(numTicks)

			const tickInterval = primaryTicks[1] - primaryTicks[0]
			const intervalParts = tickInterval.toString().split('.')
			const decimals = intervalParts.length === 1 ? 0 : intervalParts[1].length

			config[key as YAxisSide] = {
				domain: primaryYDomain,
				guideLines: key === 'left',
				ticksConfig: {
					startVal: primaryTicks[0],
					numTicks: primaryTicks.length,
					tickInterval: primaryTicks[1] - primaryTicks[0],
					decimals,
				},
			}
		}
	}
	return config
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
