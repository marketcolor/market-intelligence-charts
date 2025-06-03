import {
	Input,
	InputNumber,
	SelectPicker,
	Checkbox,
	VStack,
	Accordion,
	DatePicker,
	RadioTileGroup,
	RadioTile,
} from 'rsuite'

import type { ReactNode } from 'react'
import { ChartColor } from '@/enums'

export const ControlTab = ({
	title,
	children,
	open,
}: {
	title: string
	open?: boolean
	children?: ReactNode
}) => {
	return (
		<Accordion>
			<Accordion.Panel header={title} defaultExpanded={open}>
				{children}
			</Accordion.Panel>
		</Accordion>
	)
}

export const InputBlock = ({
	numColumns = '2',
	level = 0,
	children,
}: {
	numColumns?: string
	level?: number
	children?: ReactNode
}) => {
	return (
		<div className='input-block' data-col={numColumns} data-level={level}>
			{children}
		</div>
	)
}

export const NumberInput = ({
	label,
	value,
	min,
	max,
	step = 1,
	disabled,
	handleChange,
}: {
	label: string
	value: number
	min?: number
	max?: number
	step?: number
	disabled?: boolean
	handleChange: Function
}) => {
	return (
		<VStack>
			<label htmlFor={label}>{label}:</label>
			<InputNumber
				id={label}
				value={value}
				step={step}
				max={max}
				min={min}
				disabled={disabled}
				onChange={(value) => handleChange(Number(value))}
			></InputNumber>
		</VStack>
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
	const dateValue = typeof value === 'string' ? new Date(value) : value
	return (
		<VStack>
			<label htmlFor={label}>{label}</label>
			<DatePicker
				value={dateValue}
				onChange={(value) => handleChange(value)}
				cleanable={false}
			></DatePicker>
		</VStack>
	)
}

export const Select = ({
	label,
	value,
	options,
	disabled,
	handleChange,
}: {
	label: string
	value: string
	options: { label?: string; value: string }[]
	disabled?: boolean
	handleChange: Function
}) => {
	const dropdownOptions = options.map((option) => ({
		...option,
		label: option.label || option.value,
	}))

	return (
		<VStack>
			<label htmlFor={label}>{label}</label>
			<SelectPicker
				id={label}
				data={dropdownOptions}
				value={value}
				onChange={(value) => handleChange(value)}
				searchable={false}
				cleanable={false}
				disabled={disabled}
			></SelectPicker>
		</VStack>
	)
}

export const ColorSelect = ({
	label,
	value,
	options,
	disabled,
	handleChange,
}: {
	label: string
	value: string
	options: { label: string; value: string }[]
	disabled?: boolean
	handleChange: Function
}) => {
	return (
		<VStack>
			<label htmlFor={label}>{label}</label>
			<RadioTileGroup
				//@ts-ignore
				defaultValue={value}
				onChange={(value) => {
					handleChange(value)
				}}
				inline
				disabled={disabled}
			>
				{options.map(({ value, label }) => (
					<RadioTile value={value}>
						<div
							className='swatch-bullet'
							//@ts-ignore
							style={{ color: ChartColor[value] }}
						></div>
					</RadioTile>
				))}
			</RadioTileGroup>
		</VStack>
	)
}

export const CheckboxInput = ({
	label,
	value,
	disabled,
	handleChange,
}: {
	label: string
	value: boolean
	disabled?: boolean
	handleChange: Function
}) => {
	return (
		<Checkbox checked={value} disabled={disabled} onChange={(_, checked) => handleChange(checked)}>
			{label}
		</Checkbox>
	)
}

export const TextInput = ({
	label,
	value,
	disabled,
	handleChange,
}: {
	label: string
	value: string
	disabled?: boolean
	handleChange: Function
}) => {
	return (
		<VStack>
			<label htmlFor={label}>{label}</label>
			<Input
				id={label}
				name={label}
				value={value}
				disabled={disabled}
				onChange={(value) => handleChange(value)}
			/>
		</VStack>
	)
}

export const TextAreaInput = ({
	label,
	value,
	disabled = false,
	handleChange,
}: {
	label: string
	value: string
	disabled?: boolean
	handleChange: Function
}) => {
	return (
		<VStack>
			<label htmlFor={label}>{label}</label>
			<Input
				as='textarea'
				id={label}
				value={value}
				disabled={disabled}
				onChange={(value) => handleChange(value)}
			/>
		</VStack>
	)
}
