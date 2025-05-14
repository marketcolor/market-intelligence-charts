import { useState, useRef, useCallback } from 'react'

type SvgDimensions = {
	svgWidth: number | null
	svgHeight: number | null
	svgLeft: number | null
	svgTop: number | null
}

export function useSvgMeasure(): [(node: SVGGElement) => void, SvgDimensions] {
	const [dimensions, setDimensions] = useState<SvgDimensions>({
		svgWidth: null,
		svgHeight: null,
		svgLeft: 0,
		svgTop: 0,
	})

	const previousObserver = useRef<ResizeObserver>(null)

	const customRef = useCallback((node: SVGGElement) => {
		if (previousObserver.current) {
			previousObserver.current.disconnect()
			previousObserver.current = null
		}

		if (node?.nodeType === Node.ELEMENT_NODE) {
			const observer = new ResizeObserver(([entry]) => {
				if (entry && entry.target.tagName === 'g') {
					const gEl = entry.target as SVGGElement
					const box = gEl.getBBox()

					setDimensions({
						svgWidth: Math.ceil(box.width),
						svgHeight: Math.ceil(box.height),
						svgLeft: Math.ceil(-box.x),
						svgTop: Math.ceil(-box.y),
					})
				}
			})

			observer.observe(node)
			previousObserver.current = observer
		}
	}, [])

	return [customRef, dimensions]
}
