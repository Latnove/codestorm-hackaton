import {
	createRealmRole,
	realmRoleSchema,
	realmRoleKeys,
	roleMappingKeys,
	updateRealmRole,
	type RealmRole,
	type RealmRoleFormValues,
} from '@/entities/realm'
import { ButtonField, type ButtonFieldProps } from '@/shared/ui/ButtonField'
import { InputField } from '@/shared/ui/InputField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import styles from './RealmRoleFormButton.module.css'

interface RealmRoleFormButtonProps {
	children?: ReactNode
	existingRoleCodes?: string[]
	onDone?: () => void
	openOnMount?: boolean
	openOnCreateParam?: boolean
	realmCode: string
	role?: RealmRole
	triggerProps?: ButtonFieldProps
}

const emptyFormValues: RealmRoleFormValues = {
	code: '',
	description: '',
	name: '',
}

export const RealmRoleFormButton = ({
	children,
	existingRoleCodes = [],
	onDone,
	openOnMount = false,
	openOnCreateParam = false,
	realmCode,
	role,
	triggerProps,
}: RealmRoleFormButtonProps) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const roleCodes = useMemo(
		() => new Set(existingRoleCodes),
		[existingRoleCodes],
	)
	const isEdit = Boolean(role)
	const { onClick, ...buttonProps } = triggerProps ?? {}

	const {
		control,
		formState: { isDirty, isSubmitting, isValid },
		handleSubmit,
		reset,
		setError,
	} = useForm<RealmRoleFormValues>({
		defaultValues: emptyFormValues,
		mode: 'onChange',
		resolver: zodResolver(realmRoleSchema),
	})
	const invalidateRoles = () => {
		void queryClient.invalidateQueries({
			queryKey: realmRoleKeys.list(realmCode),
		})
		void queryClient.invalidateQueries({
			queryKey: roleMappingKeys.list(realmCode),
		})
	}
	const createRoleMutation = useMutation({
		mutationFn: (values: RealmRoleFormValues) =>
			createRealmRole(realmCode, values),
		onSuccess: roleResponse => {
			invalidateRoles()
			message.success(`Роль ${roleResponse.code} создана`)
			setOpen(false)
			reset(emptyFormValues)
			onDone?.()
		},
		onError: () => {
			message.error('Не удалось создать роль')
		},
	})
	const updateRoleMutation = useMutation({
		mutationFn: (values: RealmRoleFormValues) =>
			role
				? updateRealmRole(realmCode, role.code, {
						description: values.description,
						name: values.name,
					})
				: Promise.reject(new Error('Role is required')),
		onSuccess: roleResponse => {
			invalidateRoles()
			message.success(`Роль ${roleResponse.code} обновлена`)
			setOpen(false)
			reset(emptyFormValues)
			onDone?.()
		},
		onError: () => {
			message.error('Не удалось обновить роль')
		},
	})

	const openModal = () => {
		reset(
			role
				? {
						code: role.code,
						description: role.description ?? '',
						name: role.name,
					}
				: emptyFormValues,
		)
		setOpen(true)
	}

	const closeModal = () => {
		setOpen(false)
		reset(emptyFormValues)
		onDone?.()
	}

	useEffect(() => {
		if (!openOnCreateParam || role || searchParams.get('create') !== '1') {
			return
		}

		openModal()
		setSearchParams({}, { replace: true })
	}, [openOnCreateParam, reset, role, searchParams, setSearchParams])

	useEffect(() => {
		if (!openOnMount || role) {
			return
		}

		openModal()
	}, [openOnMount, role])

	const handleSave = (values: RealmRoleFormValues) => {
		if (role) {
			updateRoleMutation.mutate(values)
			return
		}

		if (roleCodes.has(values.code)) {
			setError('code', {
				message: 'Роль с таким кодом уже существует',
				type: 'manual',
			})
			return
		}

		createRoleMutation.mutate(values)
	}

	return (
		<>
			<ButtonField
				{...buttonProps}
				onClick={event => {
					onClick?.(event)
					openModal()
				}}
			>
				{children ?? (isEdit ? 'Изменить' : 'Создать роль')}
			</ButtonField>

			<Modal
				footer={null}
				onCancel={closeModal}
				open={open}
				title={isEdit ? 'Редактировать роль' : 'Создать роль'}
			>
				<form className={styles.form} onSubmit={handleSubmit(handleSave)}>
					<InputField
						control={control}
						disabled={isEdit}
						label='Код'
						name='code'
						placeholder='PREMIUM_CLIENT'
					/>
					<InputField
						control={control}
						label='Название'
						name='name'
						placeholder='Премиальный клиент'
					/>
					<TextAreaField
						control={control}
						label='Описание'
						name='description'
						placeholder='Клиент с премиальным статусом'
					/>

					<div className={styles.actions}>
						<ButtonField onClick={closeModal}>Отмена</ButtonField>
						<ButtonField
							disabled={!isDirty || !isValid}
							htmlType='submit'
							loading={
								isSubmitting ||
								createRoleMutation.isPending ||
								updateRoleMutation.isPending
							}
							type='primary'
						>
							{isEdit ? 'Сохранить' : 'Создать'}
						</ButtonField>
					</div>
				</form>
			</Modal>
		</>
	)
}
