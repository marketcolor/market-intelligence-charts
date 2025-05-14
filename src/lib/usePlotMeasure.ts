import type { PlotDimensions } from '@/types'
import { useState, useRef, useCallback } from 'react'

export function usePlotMeasure(
	initialWidth: number,
	initialHeight: number
): [(node: HTMLElement) => void, PlotDimensions] {
	const [dimensions, setDimensions] = useState({
		plotWidth: initialWidth,
		plotHeight: initialHeight,
		leftMargin: 0,
		rightMargin: 0,
		topMargin: 0,
		bottomMargin: 0,
	})

	const previousObserver = useRef<ResizeObserver>(null)

	const customRef = useCallback((node: HTMLElement) => {
		if (previousObserver.current) {
			previousObserver.current.disconnect()
			previousObserver.current = null
		}

		if (node?.nodeType === Node.ELEMENT_NODE) {
			const observer = new ResizeObserver(([entry]) => {
				if (entry && entry.borderBoxSize) {
					const { inlineSize: plotWidth, blockSize: plotHeight } = entry.borderBoxSize[0]
					const { offsetLeft: leftMargin, offsetTop: topMargin } = entry.target as HTMLElement
					const { clientWidth: parentWidth, clientHeight: parentHeight } = entry.target
						.parentElement as HTMLElement

					setDimensions({
						plotWidth,
						plotHeight,
						leftMargin,
						topMargin,
						rightMargin: parentWidth - plotWidth - leftMargin,
						bottomMargin: parentHeight - plotHeight - topMargin,
					})
				}
			})

			observer.observe(node)
			previousObserver.current = observer
		}
	}, [])

	return [customRef, dimensions]
}
