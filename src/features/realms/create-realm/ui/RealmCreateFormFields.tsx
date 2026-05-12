import { createRealmSchema, type CreateRealmFormValues } from '@/entities/realm'
import { ButtonField } from '@/shared/ui/ButtonField'
import { InputField } from '@/shared/ui/InputField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, Typography } from 'antd'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import styles from './CreateRealmForm.module.css'

const { Text, Title } = Typography

interface RealmCreateFormFieldsProps {
	disabled: boolean
	onCancel: () => void
	onCreate: (values: CreateRealmFormValues) => void
}

export const RealmCreateFormFields: FC<RealmCreateFormFieldsProps> = ({
	disabled,
	onCancel,
	onCreate,
}) => {
	const {
		control,
		formState: { isSubmitting },
		handleSubmit,
	} = useForm<CreateRealmFormValues>({
		defaultValues: {
			code: '',
			description: '',
			name: '',
		},
		mode: 'onBlur',
		resolver: zodResolver(createRealmSchema),
	})

	return (
		<Card className={styles.formCard}>
			<div className={styles.header}>
				<Title level={3}>Создать новый Realm</Title>
				<Text type='secondary'>
					Создайте изолированное пространство для host-приложения
				</Text>
			</div>

			<form className={styles.form} onSubmit={handleSubmit(onCreate)}>
				<InputField
					control={control}
					disabled={disabled}
					hint='Например: bank-mobile'
					label='Код'
					name='code'
					placeholder='bank-mobile'
					size='medium'
				/>

				<InputField
					control={control}
					disabled={disabled}
					label='Название'
					name='name'
					placeholder='Bank Mobile'
					hint='Например: Bank Mobile'
					size='medium'
				/>

				<TextAreaField
					control={control}
					disabled={disabled}
					label='Описание'
					name='description'
					placeholder='Описание Realm'
				/>

				<div className={styles.submitRow}>
					<ButtonField
						disabled={disabled}
						htmlType='submit'
						loading={isSubmitting}
						type='primary'
					>
						Создать Realm
					</ButtonField>

					{!disabled && <ButtonField onClick={onCancel}>Отмена</ButtonField>}
				</div>
			</form>
		</Card>
	)
}
