import { useState, useRef, useCallback } from 'react'

export function usePlotMeasure() {
	const [dimensions, setDimensions] = useState({
		plotWidth: null,
		plotHeight: null,
		leftMargin: 0,
		rightMargin: 0,
		topMargin: 0,
		bottomMargin: 0,
	})

	const previousObserver = useRef(null)

	const customRef = useCallback((node) => {
		if (previousObserver.current) {
			previousObserver.current.disconnect()
			previousObserver.current = null
		}

		if (node?.nodeType === Node.ELEMENT_NODE) {
			const observer = new ResizeObserver(([entry]) => {
				if (entry && entry.borderBoxSize) {
					const { inlineSize: plotWidth, blockSize: plotHeight } = entry.borderBoxSize[0]
					const { offsetLeft: leftMargin, offsetTop: topMargin } = entry.target
					const { clientWidth: parentWidth, clientHeight: parentHeight } = entry.target.parentElement

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
