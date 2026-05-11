import {
	createRealmSchema,
	type CreateRealmFormValues,
	type Realm,
} from '@/entities/realm'
import { useRealmsStore } from '@/features/realms/realms-catalog/model'
import { ButtonField } from '@/shared/ui/ButtonField'
import { InputField } from '@/shared/ui/InputField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, Typography, message } from 'antd'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import clsx from 'clsx'
import styles from './EditRealmButton.module.css'

const { Text, Title } = Typography

interface EditRealmButtonProps {
	className?: string
	onDone?: () => void
	realm: Realm
	variant?: 'button' | 'menu-item'
}

export const EditRealmButton = ({
	className,
	onDone,
	realm,
	variant = 'button',
}: EditRealmButtonProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const updateRealm = useRealmsStore(state => state.updateRealm)
	const initialValues: CreateRealmFormValues = {
		code: realm.code,
		description: realm.description ?? '',
		name: realm.name,
	}

	const {
		control,
		formState: { isSubmitting },
		handleSubmit,
		reset,
	} = useForm<CreateRealmFormValues>({
		defaultValues: initialValues,
		mode: 'onBlur',
		resolver: zodResolver(createRealmSchema),
	})

	const handleOpen = () => {
		reset(initialValues)
		setIsOpen(true)
	}

	const handleClose = () => {
		setIsOpen(false)
		reset(initialValues)
		onDone?.()
	}

	const handleEdit = handleSubmit(values => {
		updateRealm(realm.code, {
			description: values.description,
			name: values.name,
		})

		message.success(`Realm ${realm.code} обновлён`)

		setIsOpen(false)
		onDone?.()
	})

	return (
		<>
			<ButtonField
				className={clsx(variant === 'button' && styles.button, className)}
				onClick={handleOpen}
				type={variant === 'menu-item' ? 'text' : 'default'}
			>
				{variant === 'menu-item' ? 'Изменить' : 'Редактировать Realm'}
			</ButtonField>

			<Modal
				centered
				className={styles.modal}
				destroyOnHidden
				footer={null}
				onCancel={handleClose}
				open={isOpen}
				title={null}
				width={560}
				zIndex={1300}
			>
				<div className={styles.modalContent}>
					<div className={styles.header}>
						<Title level={3}>Редактировать Realm</Title>

						<Text type='secondary'>
							Измените параметры <strong>Realm - {realm.code}</strong>
						</Text>
					</div>

					<form className={styles.form} onSubmit={handleEdit}>
						<InputField
							control={control}
							disabled
							hint='Код Realm нельзя изменить'
							label='Код'
							name='code'
							placeholder='bank-mobile'
						/>

						<InputField
							control={control}
							label='Название'
							name='name'
							placeholder='Bank Mobile'
						/>

						<TextAreaField
							control={control}
							label='Описание'
							name='description'
							placeholder='Описание Realm'
						/>

						<div className={styles.submitRow}>
							<ButtonField
								htmlType='submit'
								loading={isSubmitting}
								type='primary'
							>
								Сохранить
							</ButtonField>

							<ButtonField onClick={handleClose}>Отмена</ButtonField>
						</div>
					</form>
				</div>
			</Modal>
		</>
	)
}
