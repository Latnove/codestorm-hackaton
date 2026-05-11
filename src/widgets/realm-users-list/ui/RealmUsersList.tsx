import { Roles, roleLabels, type Role } from '@/entities/user'
import { CreateRealmUserButton } from '@/features/realms/create-realm-user'
import {
	ActionsDropdown,
	type ActionsDropdownItem,
} from '@/shared/ui/ActionsDropdown'
import { Card, Empty, Space, Tag, message } from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './RealmUsersList.module.css'

type MockRealmUser = {
	id: string
	username: string
	email: string
	status: 'active' | 'blocked'
	globalRoles: Role[]
	createdAt: string
}

const mockRealmUsersByCode: Record<string, MockRealmUser[]> = {
	'bank-mobile': [
		{
			id: 'bank-admin-1',
			username: 'ivan.petrov',
			email: 'ivan.petrov@bank.example.com',
			status: 'active',
			globalRoles: [Roles.ADMIN],
			createdAt: '2026-05-01T09:10:00.000Z',
		},
		{
			id: 'bank-admin-2',
			username: 'maria.sokolova',
			email: 'maria.sokolova@bank.example.com',
			status: 'active',
			globalRoles: [Roles.READONLY],
			createdAt: '2026-05-02T11:20:00.000Z',
		},
		{
			id: 'bank-admin-3',
			username: 'timur.galeev',
			email: 'timur.galeev@bank.example.com',
			status: 'blocked',
			globalRoles: [Roles.ADMIN],
			createdAt: '2026-05-04T13:30:00.000Z',
		},
	],
	'telecom-app': [
		{
			id: 'telecom-admin-1',
			username: 'anna.volkova',
			email: 'anna.volkova@telecom.example.com',
			status: 'active',
			globalRoles: [Roles.ADMIN],
			createdAt: '2026-05-03T12:45:00.000Z',
		},
		{
			id: 'telecom-admin-2',
			username: 'oleg.nikitin',
			email: 'oleg.nikitin@telecom.example.com',
			status: 'active',
			globalRoles: [Roles.READONLY],
			createdAt: '2026-05-05T16:10:00.000Z',
		},
	],
	'fintech-demo': [
		{
			id: 'fintech-admin-1',
			username: 'demo.admin',
			email: 'demo.admin@fintech.example.com',
			status: 'active',
			globalRoles: [Roles.ADMIN],
			createdAt: '2026-05-06T12:40:00.000Z',
		},
	],
}

interface RealmUsersListProps {
	canCreateUser: boolean
	canEditUsers: boolean
	realmCode: string
}

const formatDate = (value?: string) => {
	if (!value) {
		return '-'
	}

	return new Date(value).toLocaleString()
}

const getStatusColor = (status: MockRealmUser['status']) =>
	status === 'active' ? 'green' : 'red'

export const RealmUsersList = ({
	canCreateUser,
	canEditUsers,
	realmCode,
}: RealmUsersListProps) => {
	const users = mockRealmUsersByCode[realmCode] ?? []
	const [visibleCount, setVisibleCount] = useState(8)
	const listRef = useRef<HTMLDivElement | null>(null)
	const observerTargetRef = useRef<HTMLDivElement | null>(null)

	const visibleUsers = useMemo(
		() => users.slice(0, visibleCount),
		[users, visibleCount],
	)

	const showStub = (action: string, username: string) => {
		message.info(`${action}: ${username} будет добавлено следующим шагом`)
	}

	const getUserActions = (user: MockRealmUser): ActionsDropdownItem[] => [
		{
			key: 'view',
			label: 'Инфо',
			onClick: () => showStub('Инфо', user.username),
		},
		...(canEditUsers
			? [
					{
						key: 'edit',
						label: 'Изменить',
						onClick: () => showStub('Изменить', user.username),
					},
					{
						key: 'assign-roles',
						label: 'Обновить роли',
						onClick: () => showStub('Обновить роли', user.username),
					},
					{
						key: 'toggle-status',
						label:
							user.status === 'active' ? 'Заблокировать' : 'Разблокировать',
						onClick: () =>
							showStub(
								user.status === 'active' ? 'Заблокировать' : 'Разблокировать',
								user.username,
							),
					},
					{
						key: 'delete',
						label: 'Удалить',
						danger: true,
						confirm: {
							description: 'Пользователь будет удалён из списка.',
							okText: 'Удалить',
							title: 'Удалить пользователя?',
						},
						onClick: () => showStub('Удалить', user.username),
					},
				]
			: []),
	]

	useEffect(() => {
		const target = observerTargetRef.current

		if (!target || visibleCount >= users.length) {
			return
		}

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0]?.isIntersecting) {
					setVisibleCount(current => Math.min(current + 8, users.length))
				}
			},
			{
				root: listRef.current,
				threshold: 1,
			},
		)

		observer.observe(target)

		return () => observer.disconnect()
	}, [users.length, visibleCount])

	return (
		<Card className={styles.card}>
			<div className={styles.header}>
				<div>
					<Title className={styles.title} level={3}>
						Связанные пользователи
					</Title>
					<Text type='secondary'>
						Пользователи платформы, связанные с текущим Realm
					</Text>
				</div>

				<Space wrap>
					<Tag color='blue'>{users.length} users</Tag>
					{canCreateUser && <CreateRealmUserButton realmCode={realmCode} />}
				</Space>
			</div>

			<div className={styles.list} ref={listRef}>
				{visibleUsers.length > 0 ? (
					<div className={styles.table}>
						<div className={styles.tableHead}>
							<Text>Username</Text>
							<Text>Email</Text>
							<Text>Статус</Text>
							<Text>Глобальные роли</Text>
							<Text>Дата создания</Text>
							<Text>Действия</Text>
						</div>

						{visibleUsers.map(user => (
							<div className={styles.row} key={user.id}>
								<div className={styles.userCell}>
									<div className={styles.avatar}>
										{user.username.slice(0, 2).toUpperCase()}
									</div>
									<Text className={styles.username}>{user.username}</Text>
								</div>

								<Text className={styles.email}>{user.email}</Text>

								<div>
									<Tag color={getStatusColor(user.status)}>{user.status}</Tag>
								</div>

								<Space className={styles.roles} wrap>
									{user.globalRoles.map(role => (
										<Tag color='geekblue' key={role}>
											{roleLabels[role]}
										</Tag>
									))}
								</Space>

								<Text className={styles.date}>
									{formatDate(user.createdAt)}
								</Text>

								<div className={styles.actions}>
									<ActionsDropdown items={getUserActions(user)} />
								</div>
							</div>
						))}
					</div>
				) : (
					<Empty description='Users not found' className={styles.empty} />
				)}

				<div ref={observerTargetRef} />
			</div>
		</Card>
	)
}
