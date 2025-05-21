import { Accordion, AccordionTab } from 'primereact/accordion'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { SelectButton } from 'primereact/selectbutton'

import type { ReactNode } from 'react'

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
		<Accordion activeIndex={open ? 0 : -1}>
			<AccordionTab header={title}>{children}</AccordionTab>
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
	step,
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
		<div className='input-wrapper'>
			<FloatLabel>
				<label htmlFor={label}>{label}:</label>
				<InputNumber
					id={label}
					value={value}
					onValueChange={(e) => handleChange(e.target.value)}
					showButtons
					buttonLayout='horizontal'
					step={step}
					max={max}
					min={min}
					disabled={disabled}
					mode='decimal'
					decrementButtonClassName='p-button-danger'
					incrementButtonClassName='p-button-success'
					incrementButtonIcon='pi pi-plus'
					decrementButtonIcon='pi pi-minus'
				/>
			</FloatLabel>
		</div>
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
		<div className='input-wrapper'>
			<FloatLabel>
				<Calendar id={label} value={dateValue} onChange={(e) => handleChange(e.target.value)} />
				<label htmlFor={label}>{label}</label>
			</FloatLabel>
		</div>
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
	const dropdownOptions = options.map((option) => ({
		...option,
		label: option.label || option.value,
	}))

	return (
		<div className='input-wrapper'>
			<FloatLabel>
				<label htmlFor={label}>{label}</label>
				<Dropdown
					id={label}
					value={value}
					onChange={(e) => handleChange(e.target.value)}
					options={dropdownOptions}
					optionLabel='label'
					optionValue='value'
				/>
			</FloatLabel>
		</div>
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
	const swatchTemplate = (option: { label: string; value: string }) => {
		return <div className='swatch-bullet' style={{ color: option.value }}></div>
	}

	return (
		<div className='input-wrapper'>
			<label htmlFor={label}>{label}</label>
			<SelectButton
				className='color-select'
				value={value}
				onChange={(e) => handleChange(e.value)}
				options={options}
				disabled={disabled}
				unstyled
				allowEmpty={false}
				itemTemplate={swatchTemplate}
			></SelectButton>
		</div>
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
		<div className='input-wrapper'>
			<label>{label}:</label>
			<Checkbox checked={value} onChange={(e) => handleChange(e.target.checked)}></Checkbox>
		</div>
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
		<div className='input-wrapper'>
			<FloatLabel>
				<InputText
					id={label}
					value={value}
					disabled={disabled}
					onChange={(e) => handleChange(e.target.value)}
				/>
				<label htmlFor={label}>{label}</label>
			</FloatLabel>
		</div>
	)
}

export const TextAreaInput = ({
	label,
	value,
	handleChange,
}: {
	label: string
	value: string
	handleChange: Function
}) => {
	return (
		<div className='input-wrapper'>
			<FloatLabel>
				<InputTextarea id={label} value={value} onChange={(e) => handleChange(e.target.value)} />
				<label htmlFor={label}>{label}</label>
			</FloatLabel>
		</div>
	)
}
