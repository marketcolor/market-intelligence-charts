import * as d3 from 'd3'

import data from './labor-market.json' assert { type: 'json' }

// --- Configuration ---
const chartHeight = 550 // Example pixel height for your chart area
const targetNumTicks = Math.round(chartHeight / 60) // The number of ticks/gridlines you want to align

console.log(chartHeight, targetNumTicks)

// --- Step 1: Define and Nice the PRIMARY (Left) Y-Axis Scale ---
const leftDomain = d3.extent(data, (d) => d.left)
const leftScale = d3.scaleLinear().domain(leftDomain).range([chartHeight, 0]) // D3 y-scales map to [height, 0]

const leftNiceScale = leftScale.nice(targetNumTicks) // Apply nice() to get rounder domain with desired ticks
const leftNiceDomain = leftNiceScale.domain()
const leftNiceTicks = leftNiceScale.ticks(targetNumTicks)

console.log('--- Left Y-Axis ---')
console.log(`Raw Domain: ${leftDomain}`)
console.log(`Nice Domain: ${leftNiceDomain}`)
console.log(`Ticks: ${leftNiceTicks}`)
console.log(`Left Ticks Count: ${leftNiceTicks.length}`)

const leftRange = leftDomain[1] - leftDomain[0]
const leftInterval = leftRange / (targetNumTicks - 1)

const leftNiceInterval = d3.nice(leftDomain[0], leftDomain[0] + leftInterval, 2)
const leftND = [
	leftNiceInterval[0],
	leftNiceInterval[0] + leftNiceInterval[1] * (targetNumTicks - 1),
]
console.log(targetNumTicks)
console.log(leftInterval)
console.log(leftNiceInterval)
console.log(leftND)

// --- Step 2: Calculate the Derived Domain for the SECONDARY (Right) Y-Axis ---

// Get raw data range for the right axis
const rightDomain = d3.extent(data, (d) => d.right)
const rightScale = d3.scaleLinear().domain(rightDomain).range([chartHeight, 0]) // D3 y-scales map to [height, 0]
const rightNiceScale = rightScale.nice(targetNumTicks) // Apply nice() to get rounder domain with desired ticks
const rightNiceDomain = rightNiceScale.domain()
const rightNiceTicks = rightNiceScale.ticks(targetNumTicks)

console.log('--- Right Y-Axis ---')
console.log(`Raw Domain: ${rightDomain}`)
console.log(`Nice Domain: ${rightNiceDomain}`)
console.log(`Ticks: ${rightNiceTicks}`)
console.log(`Right Ticks Count: ${rightNiceTicks.length}`)

const rightRange = rightDomain[1] - rightDomain[0]
const rightInterval = rightRange / (targetNumTicks - 1)

const rightNiceInterval = d3.nice(rightDomain[0], rightDomain[0] + rightInterval, 2)
const rightND = [
	rightNiceInterval[0],
	rightNiceInterval[0] + rightNiceInterval[1] * (targetNumTicks - 1),
]
console.log(targetNumTicks)
console.log(rightInterval)
console.log(rightNiceInterval)
console.log(rightND)

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
