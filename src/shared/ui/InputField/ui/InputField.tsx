import { Input, Typography } from 'antd'
import type { InputProps, PasswordProps } from 'antd/es/input'
import {
	Controller,
	type Control,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form'

import styles from './InputField.module.css'

const { Text } = Typography

interface InputFieldProps<TValues extends FieldValues> extends InputProps {
	control: Control<TValues>
	name: FieldPath<TValues>
	label: string
	placeholder?: string
	autoComplete?: string
	disabled?: boolean
	type?: 'text' | 'password'
	hint?: string
}

export const InputField = <TValues extends FieldValues>({
	autoComplete,
	control,
	disabled,
	hint,
	label,
	name,
	placeholder,
	type = 'text',
	...props
}: InputFieldProps<TValues>) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const hasError = Boolean(fieldState.error?.message)

				const commonProps: InputProps | PasswordProps = {
					autoComplete,
					className: styles.input,
					disabled,
					placeholder,
					size: 'large',
					status: hasError ? 'error' : undefined,
					...field,
					...props,
				}

				return (
					<label className={styles.field}>
						<span className={styles.label}>{label}</span>

						{type === 'password' ? (
							<Input.Password {...commonProps} />
						) : (
							<Input {...commonProps} />
						)}

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
