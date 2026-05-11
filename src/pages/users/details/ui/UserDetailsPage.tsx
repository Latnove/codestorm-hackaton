import {
	roleLabels,
	Roles,
	type PlatformUserStatus,
	type Role,
} from '@/entities/user'
import { useRealmsStore } from '@/features/realms'
import { useUsersStore } from '@/features/users'
import { ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { SelectField } from '@/shared/ui/SelectField'
import { Card, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useForm } from 'react-hook-form'
import { Navigate, useParams } from 'react-router-dom'
import styles from './UserDetailsPage.module.css'

const { Text, Title } = Typography

type AssignRolesForm = {
	realmCode: string
	roles: Role[]
}

type UserAccessForm = {
	globalRoles: Role[]
	status: PlatformUserStatus
}

const roleOptions = [Roles.ROOT, Roles.ADMIN, Roles.READONLY].map(role => ({
	label: roleLabels[role],
	value: role,
}))

const statusOptions = [
	{ label: 'Active', value: 'active' },
	{ label: 'Blocked', value: 'blocked' },
]

const formatDate = (value: string) => new Date(value).toLocaleString()

export const UserDetailsPage = () => {
	const { userId = '' } = useParams()
	const user = useUsersStore(state =>
		state.users.find(item => item.id === userId),
	)
	const realms = useRealmsStore(state => state.realms)
	const assignRealmRoles = useUsersStore(state => state.assignRealmRoles)
	const removeRealmRoles = useUsersStore(state => state.removeRealmRoles)
	const updateUserAccess = useUsersStore(state => state.updateUserAccess)

	const {
		control: assignControl,
		handleSubmit: handleAssignSubmit,
		reset: resetAssignForm,
	} = useForm<AssignRolesForm>({
		defaultValues: {
			realmCode: realms[0]?.code ?? '',
			roles: [Roles.ADMIN],
		},
	})

	const {
		control: accessControl,
		handleSubmit: handleAccessSubmit,
	} = useForm<UserAccessForm>({
		defaultValues: {
			globalRoles: user?.globalRoles ?? [Roles.ADMIN],
			status: user?.status ?? 'active',
		},
	})

	if (!user) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	const realmOptions = realms.map(realm => ({
		label: `${realm.name} (${realm.code})`,
		value: realm.code,
	}))

	const columns: ColumnsType<(typeof user.realmRoles)[number]> = [
		{
			title: 'Realm',
			dataIndex: 'realmCode',
		},
		{
			title: 'Roles',
			dataIndex: 'roles',
			render: (roles: Role[]) =>
				roles.map(role => (
					<Tag color='geekblue' key={role}>
						{roleLabels[role]}
					</Tag>
				)),
		},
		{
			title: 'Actions',
			width: 140,
			render: (_, assignment) => (
				<ButtonField
					danger
					onClick={() => removeRealmRoles(user.id, assignment.realmCode)}
					type='text'
				>
					Удалить
				</ButtonField>
			),
		},
	]

	const handleAssign = (values: AssignRolesForm) => {
		assignRealmRoles(user.id, values)
		message.success('Роли Realm обновлены')
		resetAssignForm(values)
	}

	const handleUpdateAccess = (values: UserAccessForm) => {
		updateUserAccess(user.id, values)
		message.success('Доступ пользователя обновлён')
	}

	return (
		<div className={styles.wrapper}>
			<div>
				<Text type='secondary'>Platform user</Text>
				<Title level={1}>{user.username}</Title>
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
							<Text className={styles.label}>Status</Text>
							<div>
								<Tag color={user.status === 'active' ? 'green' : 'red'}>
									{user.status}
								</Tag>
							</div>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>Global roles</Text>
							<div>
								{user.globalRoles.map(role => (
									<Tag color='geekblue' key={role}>
										{roleLabels[role]}
									</Tag>
								))}
							</div>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>CreatedAt</Text>
							<Text className={styles.value}>{formatDate(user.createdAt)}</Text>
						</div>
						<div className={styles.row}>
							<Text className={styles.label}>UpdatedAt</Text>
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
						<SelectField<UserAccessForm, Role[]>
							control={accessControl}
							label='Global roles'
							mode='multiple'
							name='globalRoles'
							options={roleOptions}
							placeholder='Выберите роли'
						/>
						<SelectField<UserAccessForm, PlatformUserStatus>
							control={accessControl}
							label='Status'
							name='status'
							options={statusOptions}
							placeholder='Status'
						/>
						<div className={styles.actions}>
							<ButtonField htmlType='submit' type='primary'>
								Сохранить
							</ButtonField>
						</div>
					</form>
				</Card>
			</div>

			<Card className={styles.card}>
				<Title className={styles.sectionTitle} level={3}>
					Realm roles
				</Title>
				<form
					className={styles.form}
					onSubmit={handleAssignSubmit(handleAssign)}
				>
					<SelectField<AssignRolesForm, string>
						control={assignControl}
						label='Realm'
						name='realmCode'
						options={realmOptions}
						placeholder='Выберите Realm'
					/>
					<SelectField<AssignRolesForm, Role[]>
						control={assignControl}
						label='Roles'
						mode='multiple'
						name='roles'
						options={roleOptions}
						placeholder='Выберите роли'
					/>
					<ButtonField htmlType='submit' type='primary'>
						Добавить
					</ButtonField>
				</form>
				<Table
					columns={columns}
					dataSource={user.realmRoles}
					pagination={false}
					rowKey='realmCode'
				/>
			</Card>
		</div>
	)
}
