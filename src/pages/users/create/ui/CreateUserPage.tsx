import {
	platformUserStatusColors,
	platformUserStatusLabels,
	createPlatformUser,
	mapRoleToCoreGlobalRole,
	userKeys,
	roleLabels,
	Roles,
	type PlatformUser,
	type Role,
} from '@/entities/user'
import { getAdminRealms, realmKeys } from '@/entities/realm'
import {
	createUserSchema,
	type CreateUserFormValues,
} from '@/features/users/create-user'
import { buildUserRoute, ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { InputField } from '@/shared/ui/InputField'
import { SelectField } from '@/shared/ui/SelectField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Card, message, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styles from './CreateUserPage.module.css'

const { Text, Title } = Typography

const roleOptions = [Roles.ROOT, Roles.ADMIN, Roles.READONLY].map(role => ({
	label: roleLabels[role],
	value: role,
}))

const statusOptions = [
	{ label: platformUserStatusLabels.active, value: 'active' },
	{ label: platformUserStatusLabels.disable, value: 'disable' },
]

export const CreateUserPage = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { data: realmsPage } = useQuery({
		queryFn: () => getAdminRealms(),
		queryKey: realmKeys.list(),
	})
	const realms = realmsPage?.items ?? []
	const [createdUser, setCreatedUser] = useState<PlatformUser | null>(null)
	const createUserMutation = useMutation({
		mutationFn: (values: CreateUserFormValues) =>
			createPlatformUser({
				email: values.email.trim() || undefined,
				globalRole: mapRoleToCoreGlobalRole(values.role),
				password: values.password,
				realmCode: values.realmCode || undefined,
				status: values.status,
				username: values.username.trim(),
			}),
		onSuccess: user => {
			setCreatedUser(user)
			void queryClient.invalidateQueries({ queryKey: userKeys.lists() })
			message.success(`Пользователь ${user.username} создан`)
		},
		onError: () => {
			message.error('Не удалось создать пользователя')
		},
	})

	const realmOptions = realms.map(realm => ({
		label: `${realm.name} (${realm.code})`,
		value: realm.code,
	}))

	const {
		control,
		formState: { isDirty, isSubmitting, isValid },
		getValues,
		handleSubmit,
		setValue,
	} = useForm<CreateUserFormValues>({
		defaultValues: {
			confirmPassword: '',
			email: '',
			password: '',
			realmCode: realmOptions[0]?.value ?? '',
			role: Roles.ADMIN,
			status: 'active',
			username: '',
		},
		mode: 'onBlur',
		resolver: zodResolver(createUserSchema),
	})

	useEffect(() => {
		if (!getValues('realmCode') && realmOptions[0]?.value) {
			setValue('realmCode', realmOptions[0].value)
		}
	}, [getValues, realmOptions, setValue])

	const handleCreate = (values: CreateUserFormValues) => {
		createUserMutation.mutate(values)
	}

	const isCreated = Boolean(createdUser)
	const createdUserRealm = realms.find(
		realm => realm.code === createdUser?.realmCode,
	)

	return (
		<div className='container'>
			<div className={isCreated ? styles.layoutCreated : styles.layout}>
				<Card className={styles.formCard}>
					<div className={styles.header}>
						<Title level={1}>Создать пользователя</Title>
					</div>

					<form className={styles.form} onSubmit={handleSubmit(handleCreate)}>
						<InputField
							control={control}
							disabled={isCreated}
							label='Username'
							name='username'
							placeholder='ivan.petrov'
							size='medium'
						/>
						<InputField
							control={control}
							disabled={isCreated}
							label='Email'
							name='email'
							placeholder='ivan.petrov@example.com'
							size='medium'
						/>
						<InputField
							control={control}
							disabled={isCreated}
							label='Password'
							name='password'
							placeholder='Минимум 6 символов'
							size='medium'
							type='password'
						/>
						<InputField
							control={control}
							disabled={isCreated}
							label='Confirm password'
							name='confirmPassword'
							placeholder='Повторите пароль'
							size='medium'
							type='password'
						/>
						<SelectField<CreateUserFormValues, Role>
							control={control}
							disabled={isCreated}
							label='Роль'
							name='role'
							options={roleOptions}
							placeholder='Выберите роль'
						/>
						<SelectField<CreateUserFormValues, CreateUserFormValues['status']>
							control={control}
							disabled={isCreated}
							label='Статус'
							name='status'
							options={statusOptions}
							placeholder='Выберите статус'
							size='medium'
						/>
						<div className={styles.wide}>
							<SelectField<CreateUserFormValues, string>
								control={control}
								disabled={isCreated}
								label='Realm'
								name='realmCode'
								options={realmOptions}
								placeholder='Выберите Realm'
								size='medium'
							/>
						</div>
						<div className={styles.submitRow}>
							<ButtonField
								disabled={isCreated || !isDirty || !isValid}
								htmlType='submit'
								loading={isSubmitting || createUserMutation.isPending}
								type='primary'
							>
								Создать
							</ButtonField>
							{!isCreated && (
								<ButtonField onClick={() => navigate(ROUTES.USERS)}>
									Отмена
								</ButtonField>
							)}
						</div>
					</form>
				</Card>

				{createdUser && (
					<Card className={styles.resultCard}>
						<div className={styles.header}>
							<Title level={3}>Пользователь создан</Title>
							<Text type='secondary'>
								Проверьте данные перед переходом в профиль
							</Text>
					</div>

					<Alert
						className={styles.alert}
						description='Поля формы заблокированы до выхода со страницы, чтобы данные создания остались на экране.'
						showIcon
						type='success'
					/>

					<div className={styles.resultList}>
						<div className={styles.resultRow}>
							<Text className={styles.resultLabel}>Username</Text>
							<Text className={styles.resultValue}>{createdUser.username}</Text>
						</div>
						<div className={styles.resultRow}>
							<Text className={styles.resultLabel}>Email</Text>
							<Text className={styles.resultValue}>{createdUser.email}</Text>
						</div>
						<div className={styles.resultRow}>
							<Text className={styles.resultLabel}>Статус</Text>
							<Tag color={platformUserStatusColors[createdUser.status]}>
								{platformUserStatusLabels[createdUser.status]}
							</Tag>
						</div>
						<div className={styles.resultRow}>
							<Text className={styles.resultLabel}>Роль</Text>
							<Tag color='geekblue'>{roleLabels[createdUser.role]}</Tag>
						</div>
						<div className={styles.resultRow}>
							<Text className={styles.resultLabel}>Realm</Text>
							<Text className={styles.resultValue}>
								{createdUserRealm
									? `${createdUserRealm.name} (${createdUserRealm.code})`
									: createdUser.realmCode}
							</Text>
						</div>
					</div>

					<div className={styles.resultActions}>
						<ButtonField onClick={() => navigate(ROUTES.USERS)}>
							К списку пользователей
						</ButtonField>
						<ButtonField
							onClick={() => navigate(buildUserRoute(createdUser.id))}
							type='primary'
						>
							Открыть пользователя
						</ButtonField>
					</div>
					</Card>
				)}
			</div>
		</div>
	)
}
