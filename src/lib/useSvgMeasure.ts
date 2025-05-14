import { useState, useRef, useCallback, useEffect } from 'react'

type SvgDimensions = {
	svgWidth: number | null
	svgHeight: number | null
	svgLeft: number | null
	svgRight: number | null
	svgTop: number | null
	svgBottom: number | null
}

export function useSvgMeasure(
	targetWidth: number,
	targetHeight: number
): [(node: SVGGElement) => void, SvgDimensions] {
	const [dimensions, setDimensions] = useState<SvgDimensions>({
		svgWidth: null,
		svgHeight: null,
		svgLeft: null,
		svgRight: null,
		svgTop: null,
		svgBottom: null,
	})
	const [bbox, setBBox] = useState<DOMRect>()

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
					setBBox(box)
				}
			})

			observer.observe(node)
			previousObserver.current = observer
		}
	}, [])

	useEffect(() => {
		if (bbox) {
			const bleedLeft = bbox.x < 0 ? Math.ceil(-bbox.x) : 0
			const svgLeft =
				bleedLeft > 0 && bleedLeft !== dimensions.svgLeft ? bleedLeft : dimensions.svgLeft
			const bleedRight = Math.ceil(bbox.width - targetWidth + bbox.x)
			const svgRight =
				bleedRight > 0 && bleedRight !== dimensions.svgRight ? bleedRight : dimensions.svgRight
			const bleedTop = bbox.y < 0 ? Math.ceil(-bbox.y) : 0
			const svgTop = bleedTop > 0 && bleedTop !== dimensions.svgTop ? bleedTop : dimensions.svgTop
			const bleedBottom = Math.ceil(bbox.height - targetHeight + bbox.y)
			const svgBottom =
				bleedBottom > 0 && bleedBottom !== dimensions.svgBottom ? bleedBottom : dimensions.svgBottom

			const newDimensions: SvgDimensions = {
				svgWidth: bbox.width,
				svgHeight: bbox.height,
				svgLeft,
				svgRight,
				svgBottom,
				svgTop,
			}

			setDimensions(newDimensions)
		}
	}, [bbox])

	return [customRef, dimensions]
}
