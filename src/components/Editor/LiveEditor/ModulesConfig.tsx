import LineChartEditor from './modules/LineChartEditor'
import AreaChartEditor from './modules/AreaChartEditor'
import ScatterPlotEditor from './modules/ScatterPlotEditor'
import PeriodAreasEditor from './modules/PeriodAreasEditor'
import BarChartEditor from './modules/BarChartEditor'

import type { Modules } from '@/types'

import { YAxisSide } from '@/enums'

const moduleEditors = {
	lineChart: (props: any) => <LineChartEditor {...props} />,
	areaChart: (props: any) => <AreaChartEditor {...props} />,
	barChart: (props: any) => <BarChartEditor {...props} />,
	scatterPlot: (props: any) => <ScatterPlotEditor {...props} />,
	periodAreas: (props: any) => <PeriodAreasEditor {...props} />,
}

const ModulesConfig = ({
	config,
	availableAxis,
	handleChange,
}: {
	config: Modules
	availableAxis: YAxisSide[]
	handleChange: Function
}) => {
	//@ts-ignore
	return moduleEditors[config.type]({
		config,
		availableAxis,
		handleChange,
	})
}

export default ModulesConfig
