import Papa from 'papaparse'

class Chart extends HTMLElement {
	constructor() {
		super()
	}

	async parseDataFile(path: string) {
		const res = Papa.parse(path, {
			download: true,
			header: true,
			dynamicTyping: true,
			complete(results, file) {
				console.log(results)
			},
		})
		// console.log(res)
	}

	connectedCallback() {
		console.log('connected')
		const dataPath = this.dataset.dataPath
		this.parseDataFile(dataPath!)

		console.log(dataPath)
	}
}

export default Chart
