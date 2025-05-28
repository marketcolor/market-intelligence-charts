import { useDebounce } from '@uidotdev/usehooks'
import { useState, useRef, useCallback, useEffect, useLayoutEffect, type RefObject } from 'react'

type SvgDimensions = {
	svgWidth: number | null
	svgHeight: number | null
	svgLeft: number
	svgRight: number
	svgTop: number
	svgBottom: number
}

export function useSvgMeasure(
	targetWidth: number,
	targetHeight: number
): [RefObject<SVGGElement | null>, SvgDimensions] {
	const [dimensions, setDimensions] = useState<SvgDimensions>({
		svgWidth: null,
		svgHeight: null,
		svgLeft: 0,
		svgRight: 0,
		svgTop: 0,
		svgBottom: 0,
	})
	const [bbox, setBBox] = useState<DOMRect>()
	const debouncedBbox = useDebounce(bbox, 300)

	const ref = useRef<SVGGElement>(null)

	useEffect(() => {
		const element = ref.current
		if (!element) return
		const observer = new ResizeObserver(([entry]) => {
			if (entry && entry.target.tagName === 'g') {
				const gEl = entry.target as SVGGElement
				const box = gEl.getBBox()
				setBBox(box)
			}
		})
		observer.observe(element)

		return () => {
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		if (debouncedBbox) {
			const bleedLeft = Math.ceil(-debouncedBbox.x)
			const svgLeft = dimensions.svgLeft + bleedLeft

			const bleedRight = Math.ceil(debouncedBbox.width - targetWidth + debouncedBbox.x)
			const svgRight = dimensions.svgRight + bleedRight

			const bleedTop = Math.ceil(-debouncedBbox.y)
			const svgTop = dimensions.svgTop + bleedTop

			const bleedBottom = Math.ceil(debouncedBbox.height - targetHeight + debouncedBbox.y)
			const svgBottom = dimensions.svgBottom + bleedBottom

			const newDimensions: SvgDimensions = {
				svgWidth: debouncedBbox.width,
				svgHeight: debouncedBbox.height,
				svgLeft,
				svgRight,
				svgBottom,
				svgTop,
			}

			setDimensions(newDimensions)
		}
	}, [debouncedBbox])

	return [ref, dimensions]
}
