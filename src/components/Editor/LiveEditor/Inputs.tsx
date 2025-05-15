import type { ReactNode } from 'react'

export const ControlTab = ({ title, children }: { title: string; children?: ReactNode }) => {
	return (
		<div className='control-tab'>
			<div className='title'>{title}</div>
			{children}
		</div>
	)
}

export const InputBlock = ({
	numColumns = '2',
	children,
}: {
	numColumns?: string
	children?: ReactNode
}) => {
	return (
		<div className='input-block' data-col={numColumns}>
			{children}
		</div>
	)
}

export const NumberInput = ({
	label,
	value,
	min,
	max,
	hasRange = true,
	hasInput = true,
	handleChange,
}: {
	label: string
	value: number
	min?: number
	max?: number
	hasRange?: boolean
	hasInput?: boolean
	handleChange: Function
}) => {
	return (
		<>
			<label>{label}:</label>
			{hasRange && (
				<input
					type='range'
					value={value}
					min={min}
					max={max}
					onChange={(e) => handleChange(e.target.value)}
				/>
			)}
			{hasInput && (
				<input
					type='number'
					value={value}
					min={min}
					max={max}
					onChange={(e) => handleChange(e.target.value)}
				/>
			)}
		</>
	)
}

export const DateInput = ({
	label,
	value,
	handleChange,
}: {
	label: string
	value: string | Date
	handleChange: Function
}) => {
	return (
		<>
			<label>{label}:</label>
			<input
				type='date'
				value={typeof value === 'string' ? value : value.toISOString().slice(0, 10)}
				onChange={(e) => handleChange(e.target.value)}
			></input>
		</>
	)
}

export const Select = ({
	label,
	value,
	options,
	handleChange,
}: {
	label: string
	value: string
	options: { label?: string; value: string }[]
	handleChange: Function
}) => {
	return (
		<>
			<label>{label}:</label>
			<select value={value} onChange={(e) => handleChange(e.target.value)}>
				{options.map(({ value, label }) => (
					<option key={value} value={value}>
						{label || value}
					</option>
				))}
			</select>
		</>
	)
}

export const CheckboxInput = ({
	label,
	value,
	handleChange,
}: {
	label: string
	value: boolean
	handleChange: Function
}) => {
	return (
		<>
			<input type='checkbox' checked={value} onChange={(e) => handleChange(e.target.checked)}></input>
			<label>{label}:</label>
		</>
	)
}

export const TextInput = ({
	label,
	value,
	handleChange,
}: {
	label: string
	value: string
	handleChange: Function
}) => {
	return (
		<>
			<label>{label}:</label>
			<input type='text' value={value} onChange={(e) => handleChange(e.target.value)}></input>
		</>
	)
}
