import puppeteer from 'puppeteer'

export const renderPdf = async (slug: string) => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	console.log(slug)

	await page.goto(`http://localhost:4321/test`)
	const templateSize = await page.evaluate((): { width: number; height: number } => {
		const t = document.querySelector<HTMLElement>('.chart-template')!
		return { width: Number(t?.getAttribute('width')), height: Number(t.getAttribute('height')) }
	})

	await page.setViewport(templateSize)
	await page.pdf({
		...templateSize,
		path: `./out/${slug}.pdf`,
		pageRanges: '1',
		omitBackground: true,
	})

	await browser.close()
	return 'ok'
}
