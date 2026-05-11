import { Input, Typography } from 'antd'
import type { SearchProps } from 'antd/es/input'
import {
	Controller,
	type Control,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form'

import styles from './SearchField.module.css'

const { Text } = Typography

type SearchFieldProps<TValues extends FieldValues> = {
	control: Control<TValues>
	name: FieldPath<TValues>
	label: string
	placeholder?: string
	hint?: string
	allowClear?: boolean
}

export const SearchField = <TValues extends FieldValues>({
	allowClear = true,
	control,
	hint,
	label,
	name,
	placeholder,
}: SearchFieldProps<TValues>) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const hasError = Boolean(fieldState.error?.message)

				const props: SearchProps = {
					allowClear,
					className: styles.search,
					placeholder,
					size: 'large',
					status: hasError ? 'error' : undefined,
					...field,
				}

				return (
					<label className={styles.field}>
						<span className={styles.label}>{label}</span>

						<Input.Search {...props} />

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
