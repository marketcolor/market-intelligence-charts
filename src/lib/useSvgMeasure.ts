import { useDebounce } from '@uidotdev/usehooks'
import { useState, useRef, useCallback, useEffect, useLayoutEffect, type RefObject } from 'react'

type SvgDimensions = {
	svgWidth: number | null
	svgHeight: number | null
	svgLeft: number
	svgRight: number
	svgTop: number | null
	svgBottom: number | null
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
		svgTop: null,
		svgBottom: null,
	})
	const [bbox, setBBox] = useState<DOMRect>()
	const debouncedBbox = useDebounce(bbox, 1000)

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

	// useEffect(() => {
	// 	if (debouncedBbox) {
	// 		const svgWidth = Math.ceil(debouncedBbox.width)
	// 		const svgHeight = Math.ceil(debouncedBbox.height)
	// 		console.log(svgWidth, targetWidth)

	// 		if (svgWidth <= targetWidth && svgHeight <= targetHeight) {
	// 			return
	// 		}

	// 		const bleedLeft = debouncedBbox.x < 0 ? Math.ceil(-debouncedBbox.x) : 0
	// 		// console.log(debouncedBbox.x)
	// 		console.log(bleedLeft)
	// 		const svgLeft = bleedLeft <= 0 ? dimensions.svgLeft : bleedLeft

	// 		const bleedRight = Math.ceil(debouncedBbox.width - targetWidth + debouncedBbox.x)
	// 		// console.log(bleedRight)
	// 		const svgRight = bleedRight <= 0 ? dimensions.svgRight : bleedRight + 1
	// 		// console.log(svgRight)

	// 		// const svgRight =
	// 		// 	bleedRight > 0 && bleedRight !== dimensions.svgRight ? bleedRight : dimensions.svgRight
	// 		// console.log(svgRight)

	// 		// const bleedTop = debouncedBbox.y < 0 ? Math.ceil(-debouncedBbox.y) : 0
	// 		// const svgTop = bleedTop > 0 && bleedTop !== dimensions.svgTop ? bleedTop : dimensions.svgTop

	// 		// const bleedBottom = Math.ceil(debouncedBbox.height - targetHeight + debouncedBbox.y)
	// 		// const svgBottom =
	// 		// 	bleedBottom > 0 && bleedBottom !== dimensions.svgBottom ? bleedBottom : dimensions.svgBottom

	// 		const newDimensions: SvgDimensions = {
	// 			svgWidth: debouncedBbox.width,
	// 			svgHeight: debouncedBbox.height,
	// 			svgLeft,
	// 			svgRight: 0,
	// 			svgBottom: null,
	// 			svgTop: null,
	// 		}

	// 		// setDimensions(newDimensions)
	// 	}
	// }, [debouncedBbox])

	return [ref, dimensions]
}
