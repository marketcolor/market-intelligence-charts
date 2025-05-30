declare module 'd3-regression' {
	export const regressionExp: typeof import('./d3-regression/exponential').default
	export const regressionLinear: typeof import('./d3-regression/linear').default
	export const regressionLoess: typeof import('./d3-regression/loess').default
	export const regressionLog: typeof import('./d3-regression/logarithmic').default
	export const regressionPoly: typeof import('./d3-regression/polynomial').default
	export const regressionPow: typeof import('./d3-regression/power').default
	export const regressionQuad: typeof import('./d3-regression/quadratic').default
}
