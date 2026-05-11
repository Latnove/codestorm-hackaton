import type { SelectProps } from 'antd'
import { Select, Typography } from 'antd'
import {
	Controller,
	type Control,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form'

import styles from './SelectField.module.css'

const { Text } = Typography

type SelectFieldProps<TValues extends FieldValues, TValue> = {
	control: Control<TValues>
	name: FieldPath<TValues>
	label: string
	options: SelectProps<TValue>['options']
	mode?: SelectProps<TValue>['mode']
	placeholder?: string
	hint?: string
	disabled?: boolean
}

export const SelectField = <TValues extends FieldValues, TValue = string>({
	control,
	disabled,
	hint,
	label,
	mode,
	name,
	options,
	placeholder,
}: SelectFieldProps<TValues, TValue>) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const hasError = Boolean(fieldState.error?.message)

				return (
					<label className={styles.field}>
						<span className={styles.label}>{label}</span>

						<Select<TValue>
							{...field}
							className={styles.select}
							disabled={disabled}
							mode={mode}
							options={options}
							placeholder={placeholder}
							size='large'
							status={hasError ? 'error' : undefined}
						/>

						{hasError ? (
							<Text className={styles.error}>{fieldState.error?.message}</Text>
						) : hint ? (
							<Text className={styles.hint}>{hint}</Text>
						) : null}
					</label>
				)
			}}
		/>
	)
}
