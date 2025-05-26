import * as d3 from 'd3'

const data = [
	{ x: 1, y1: 0, y2: 1.1 },
	{ x: 2, y1: 2.5, y2: 1.2 },
	{ x: 3, y1: 4.0, y2: 0.54 },
	{ x: 4, y1: 5.5, y2: 1.8 },
	{ x: 5, y1: 6.5, y2: 2.1 },
	{ x: 6, y1: 0.88, y2: 2.4 },
	{ x: 7, y1: 1.05, y2: 7.91 },
	{ x: 8, y1: 1.18, y2: 3.0 },
]

// --- Configuration ---
const chartHeight = 300 // Example pixel height for your chart area
const targetNumTicks = 5 // The number of ticks/gridlines you want to align

// --- Step 1: Define and Nice the PRIMARY (Left) Y-Axis Scale ---
const y1Domain = d3.extent(data, (d) => d.y1)
const y1Scale = d3.scaleLinear().domain(y1Domain).range([chartHeight, 0]) // D3 y-scales map to [height, 0]

const y1NiceScale = y1Scale.nice(targetNumTicks) // Apply nice() to get rounder domain with desired ticks
const y1NiceDomain = y1NiceScale.domain()
const y1NiceTicks = y1NiceScale.ticks(targetNumTicks)

console.log('--- Primary Y-Axis ---')
console.log(`Raw Domain: ${y1Domain}`)
console.log(`Nice Domain: ${y1NiceDomain}`)
console.log(`Ticks: ${y1NiceTicks}`)

// --- Step 2: Calculate the Derived Domain for the SECONDARY (Right) Y-Axis ---

// Get raw data range for the right axis
const y2Domain = d3.extent(data, (d) => d.y2)
const y2Scale = d3.scaleLinear().domain(y2Domain).range([chartHeight, 0]) // D3 y-scales map to [height, 0]

console.log('\n--- Secondary Y-Axis Calculation ---')
console.log(`Raw Domain: ${y2Domain}`)
console.log(y1Scale.nice(y1NiceTicks.length).domain())
console.log(y1Scale.nice(y1NiceTicks.length).ticks(y1NiceTicks.length))

// Handle potential division by zero if left data range is zero (e.g., all same value)
// let M = 0
// let B = yR_data_min // If no range, just offset by min
// if (yL_data_max - yL_data_min !== 0) {
// 	// Calculate the scaling factor (M) and offset (B)
// 	// This maps a value from the left's RAW data range to the right's RAW data range
// 	M = (yR_data_max - yR_data_min) / (yL_data_max - yL_data_min)
// 	B = yR_data_min - M * yL_data_min
// }

// console.log(`Calculated M (scaling factor): ${M}`)
// console.log(`Calculated B (offset): ${B}`)

// // Apply this linear transformation (M and B) to the LEFT's *nice* domain
// // to get the *corresponding* domain for the right axis.
// const yR_derived_min = M * yL_nice_min + B
// const yR_derived_max = M * yL_nice_max + B

// console.log(`Derived Domain before final nice(): [${yR_derived_min}, ${yR_derived_max}]`)

// // --- Step 3: Create the Secondary (Right) Y-Axis Scale and Apply Nice() ---

// const yScaleRight = d3
// 	.scaleLinear()
// 	.domain([yR_derived_min, yR_derived_max]) // Set domain to the calculated derived range
// 	.range([chartHeight, 0]) // Keep the same range as the left scale

// // Apply nice() to this derived domain, using the *same number of ticks*.
// // This ensures the endpoints are rounded, but the proportionality and tick count are maintained.
// yScaleRight.nice(desiredNumTicks)

// const rightNiceDomain = yScaleRight.domain()
// console.log(`Final Nice Domain: [${rightNiceDomain[0]}, ${rightNiceDomain[1]}]`)
// console.log(`Ticks Generated: ${yScaleRight.ticks(desiredNumTicks)}`)

// // --- Verification: Check Tick Alignment ---
// console.log('\n--- Verification of Tick Alignment (Pixel Coincidence) ---')
// const leftTicks = yScaleLeft.ticks(desiredNumTicks)
// const rightTicks = yScaleRight.ticks(desiredNumTicks)

// if (leftTicks.length !== rightTicks.length) {
// 	console.warn('Warning: Number of ticks generated is different, alignment may not be perfect.')
// }

// leftTicks.forEach((lTick, i) => {
// 	const rTick = rightTicks[i]
// 	const lPixel = yScaleLeft(lTick)
// 	const rPixel = yScaleRight(rTick)

// 	// Due to floating point arithmetic, there might be tiny differences.
// 	// We're looking for differences very close to zero.
// 	const pixelDifference = Math.abs(lPixel - rPixel)

// 	console.log(
// 		`Left Tick: ${lTick.toFixed(2)} (Pixel: ${lPixel.toFixed(2)}) | ` +
// 			`Right Tick: ${rTick.toFixed(2)} (Pixel: ${rPixel.toFixed(2)}) | ` +
// 			`Pixel Diff: ${pixelDifference.toFixed(4)}`
// 	)
// })

// If pixel difference is consistently very small (e.g., < 0.0001), they are aligned for practical purposes.
