import {
	platformUserStatusColors,
	platformUserStatusLabels,
	getPlatformUser,
	updatePlatformUserAndAccess,
	userKeys,
	roleLabels,
	Roles,
	type PlatformUserStatus,
	type Role,
} from '@/entities/user'
import { getAdminRealms, realmKeys } from '@/entities/realm'
import { buildRealmOverviewRoute, ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { InputField } from '@/shared/ui/InputField'
import { SelectField } from '@/shared/ui/SelectField'
import { UserManageActions } from '@/widgets/user-manage-actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, message, Tag, Typography } from 'antd'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useParams } from 'react-router-dom'
import styles from './UserDetailsPage.module.css'

const { Text, Title } = Typography

type UserAccessForm = {
	email: string
	role: Role
	status: PlatformUserStatus
}

const roleOptions = [Roles.ROOT, Roles.ADMIN, Roles.READONLY].map(role => ({
	label: roleLabels[role],
	value: role,
}))

const statusOptions = [
	{ label: platformUserStatusLabels.active, value: 'active' },
	{ label: platformUserStatusLabels.disable, value: 'disable' },
]

const formatDate = (value: string) => new Date(value).toLocaleString()

export const UserDetailsPage = () => {
	const { userId = '' } = useParams()
	const queryClient = useQueryClient()
	const { data: user, isLoading: isUserLoading } = useQuery({
		enabled: Boolean(userId),
		queryFn: () => getPlatformUser(userId),
		queryKey: userKeys.detail(userId),
	})
	const { data: realmsPage } = useQuery({
		queryFn: () => getAdminRealms(),
		queryKey: realmKeys.list(),
	})
	const realms = realmsPage?.items ?? []

	const {
		control: accessControl,
		formState: { isDirty, isValid },
		handleSubmit: handleAccessSubmit,
		reset,
	} = useForm<UserAccessForm>({
		defaultValues: {
			email: user?.email ?? '',
			role: user?.role ?? Roles.ADMIN,
			status: user?.status ?? 'active',
		},
		mode: 'onBlur',
	})
	const updateUserMutation = useMutation({
		mutationFn: (values: UserAccessForm) =>
			user
				? updatePlatformUserAndAccess(user, values)
				: Promise.reject(new Error('User is required')),
		onSuccess: updatedUser => {
			void queryClient.invalidateQueries({ queryKey: userKeys.lists() })
			void queryClient.invalidateQueries({
				queryKey: userKeys.detail(updatedUser.id),
			})
			message.success('Пользователь обновлён')
		},
		onError: () => {
			message.error('Не удалось обновить пользователя')
		},
	})

	useEffect(() => {
		if (user) {
			reset({
				email: user.email,
				role: user.role,
				status: user.status,
			})
		}
	}, [reset, user])

	if (isUserLoading) {
		return null
	}

	if (!user) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	const userRealm = realms.find(realm => realm.code === user.realmCode)

	const handleUpdateAccess = (values: UserAccessForm) => {
		updateUserMutation.mutate(values)
	}

	const handleReset = () => {
		reset({
			email: user.email,
			role: user.role,
			status: user.status,
		})
	}

	return (
		<div className={`container ${styles.wrapper}`}>
			<div className={styles.header}>
				<Text type='secondary'>Страница пользователя host-app</Text>
				<Title className={styles.mainTitle} level={1}>
					{user.username}
				</Title>
			</div>

			<div className={styles.grid}>
				<Card className={styles.card}>
					<Title className={styles.sectionTitle} level={3}>
						Профиль
					</Title>
					<div className={styles.rows}>
						<div className={styles.row}>
							<Text className={styles.label}>Username</Text>
							<Text className={styles.value}>{user.username}</Text>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>Email</Text>
							<Text className={styles.value}>{user.email}</Text>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>Realm</Text>
							<Text className={styles.value}>
								<Link
									className={styles.realmLink}
									to={buildRealmOverviewRoute(user.realmCode)}
								>
									{userRealm
										? `${userRealm.name} (${userRealm.code})`
										: user.realmCode}
								</Link>
							</Text>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>Статус</Text>
							<div>
								<Tag color={platformUserStatusColors[user.status]}>
									{platformUserStatusLabels[user.status]}
								</Tag>
							</div>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>Роль</Text>
							<div>
								<Tag color='geekblue'>{roleLabels[user.role]}</Tag>
							</div>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>Дата создания</Text>
							<Text className={styles.value}>{formatDate(user.createdAt)}</Text>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>Последнее обновление</Text>
							<Text className={styles.value}>{formatDate(user.updatedAt)}</Text>
						</div>
					</div>
				</Card>

				<Card className={styles.card}>
					<Title className={styles.sectionTitle} level={3}>
						Доступ
					</Title>
					<form
						className={styles.form}
						onSubmit={handleAccessSubmit(handleUpdateAccess)}
					>
						<InputField
							control={accessControl}
							label='Email'
							name='email'
							placeholder='user@example.com'
						/>

						<SelectField<UserAccessForm, Role>
							control={accessControl}
							label='Роль'
							name='role'
							options={roleOptions}
							placeholder='Выберите роль'
						/>

						<SelectField<UserAccessForm, PlatformUserStatus>
							control={accessControl}
							label='Статус'
							name='status'
							options={statusOptions}
							placeholder='Выберите статус'
						/>
						<div className={styles.actions}>
							<UserManageActions
								showView={false}
								user={user}
								variant='inline'
								className={styles.deleteAction}
							/>

							<ButtonField onClick={handleReset}>Очистить</ButtonField>
							<ButtonField
								disabled={!isDirty || !isValid}
								htmlType='submit'
								loading={updateUserMutation.isPending}
								type='primary'
							>
								Сохранить
							</ButtonField>
						</div>
					</form>
				</Card>
			</div>
		</div>
	)
}
