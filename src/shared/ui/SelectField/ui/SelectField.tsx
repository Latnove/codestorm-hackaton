import { Select, Typography, type SelectProps } from 'antd'
import clsx from 'clsx'
import {
	Controller,
	type Control,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form'

import styles from './SelectField.module.css'

const { Text } = Typography

type SelectFieldProps<TValues extends FieldValues, TValue = string> = Omit<
	SelectProps<TValue>,
	'name' | 'status'
> & {
	control: Control<TValues>
	name: FieldPath<TValues>
	label: string
	hint?: string
}

export const SelectField = <TValues extends FieldValues, TValue = string>({
	className,
	control,
	hint,
	label,
	name,
	options,
	...selectProps
}: SelectFieldProps<TValues, TValue>) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const errorMessage = fieldState.error?.message

				return (
					<label className={styles.field}>
						<span className={styles.label}>{label}</span>

						<Select<TValue>
							{...field}
							{...selectProps}
							className={clsx(styles.select, className)}
							options={options}
							status={errorMessage ? 'error' : undefined}
						/>

						{errorMessage ? (
							<Text className={styles.error}>{errorMessage}</Text>
						) : hint ? (
							<Text className={styles.hint}>{hint}</Text>
						) : null}
					</label>
				)
			}}
		/>
	)
}
