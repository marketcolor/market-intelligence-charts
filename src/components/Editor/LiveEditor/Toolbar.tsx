import { useRef } from 'react'

import Session from 'svg-text-to-path'

import { fonts } from '@styles/theme'
import { Button } from 'primereact/button'

const Toolbar = ({ chartTitle }: { chartTitle?: string }) => {
	const tempContainer = useRef<HTMLDivElement>(null)

	const slug = chartTitle?.replaceAll(' ', '_') || 'chart'

	const generateTempSvg = () => {
		if (tempContainer.current) {
			const tempEl = tempContainer.current
			const chartSvg = document.querySelector<SVGElement>('#chart')!
			const cloneSvg = chartSvg?.cloneNode(true) as SVGElement
			cloneSvg.removeAttribute('id')
			tempEl.append(cloneSvg)

			const baselineElements = tempEl.querySelectorAll<SVGAElement>('[dominant-baseline]')
			baselineElements.forEach((el) => {
				const rect = el.getBoundingClientRect()
				const { x, y } = rect
				el.removeAttribute('dominant-baseline')

				const newRect = el.getBoundingClientRect()

				if (newRect.y !== y) {
					const originalY = Number(el.getAttribute('y'))
					el.setAttribute('y', `${y - newRect.y + (originalY || 0)}`)
				}
				if (newRect.x !== x) {
					const originalY = Number(el.getAttribute('y'))
					el.setAttribute('y', `${x - newRect.x + (originalY || 0)}`)
				}
			})
			return cloneSvg
		}
	}

	const saveSvg = () => {
		const cloneSvg = generateTempSvg()
		if (cloneSvg) {
			initSvgDownload(cloneSvg.outerHTML, slug)
			cleanup(cloneSvg)
		}
	}

	const saveOutlinedSvg = async () => {
		const cloneSvg = generateTempSvg()
		if (cloneSvg) {
			// @ts-ignore
			let session = new Session(cloneSvg, {
				fonts: {
					[fonts.manulife]: [
						{
							source: '../fonts/ManulifeJHSansOptimized.ttf',
						},
					],
				},
			})
			await session.replaceAll(['text[data-outlined]'])
			initSvgDownload(cloneSvg.outerHTML, `${slug}-outlined`)
			cleanup(cloneSvg)
		}
	}

	const initSvgDownload = (svgString: string, title: string) => {
		const a = document.createElement('a')
		const blob = new Blob([svgString], { type: 'text/svg' })
		const url = URL.createObjectURL(blob)
		a.setAttribute('href', url)
		a.setAttribute('download', `${title}.svg`)
		a.click()
	}

	const cleanup = (cloneSvg: SVGElement) => {
		cloneSvg.parentNode?.removeChild(cloneSvg)
	}

	return (
		<div className='toolbar'>
			<Button onClick={saveSvg}>Save svg</Button>
			<Button onClick={saveOutlinedSvg}>Save outlined svg</Button>
			<div className='temp-svg-container' ref={tempContainer}></div>
		</div>
	)
}

export default Toolbar
