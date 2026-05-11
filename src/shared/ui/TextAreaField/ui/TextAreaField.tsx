import { Input, Typography } from 'antd'
import type { TextAreaProps } from 'antd/es/input'
import {
	Controller,
	type Control,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form'
import styles from './TextAreaField.module.css'

const { Text } = Typography

type TextAreaFieldProps<TValues extends FieldValues> = {
	control: Control<TValues>
	name: FieldPath<TValues>
	label: string
	placeholder?: string
	disabled?: boolean
	hint?: string
	autoSize?: TextAreaProps['autoSize']
}

export const TextAreaField = <TValues extends FieldValues>({
	autoSize = { maxRows: 5, minRows: 4 },
	control,
	disabled,
	hint,
	label,
	name,
	placeholder,
}: TextAreaFieldProps<TValues>) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const hasError = Boolean(fieldState.error?.message)

				return (
					<label className={styles.field}>
						<span className={styles.label}>{label}</span>

						<Input.TextArea
							{...field}
							autoSize={autoSize}
							className={styles.textarea}
							disabled={disabled}
							placeholder={placeholder}
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
