import {
	platformUserStatusColors,
	platformUserStatusLabels,
	roleLabels,
	type PlatformUser,
	type PlatformUserStatus,
} from '@/entities/user'
import { buildRealmOverviewRoute } from '@/shared/config'
import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './UsersList.module.css'

const { Text } = Typography

interface UsersListProps {
	data: PlatformUser[]
	onOpen: (userId: string) => void
	renderActions?: (user: PlatformUser) => ReactNode
}

const formatDate = (value: string) => new Date(value).toLocaleDateString()

export const UsersList = ({ data, onOpen, renderActions }: UsersListProps) => {
	const columns: ColumnsType<PlatformUser> = [
		{
			title: 'Username',
			dataIndex: 'username',
			render: (value: string) => (
				<div className={styles.userCell}>
					<div className={styles.avatar}>{value.slice(0, 2).toUpperCase()}</div>
					<Text className={styles.username}>{value}</Text>
				</div>
			),
		},
		{ title: 'Email', dataIndex: 'email' },
		{
			title: 'Статус',
			dataIndex: 'status',
			render: (value: PlatformUserStatus) => (
				<Tag color={platformUserStatusColors[value]}>
					{platformUserStatusLabels[value]}
				</Tag>
			),
		},
		{
			title: 'Роль',
			dataIndex: 'role',
			render: (role: PlatformUser['role']) => (
				<Tag color='geekblue'>{roleLabels[role]}</Tag>
			),
		},
		{
			title: 'Realm',
			dataIndex: 'realmCode',
			render: (realmCode: string) => (
				<Link
					className={styles.realmLink}
					onClick={event => event.stopPropagation()}
					to={buildRealmOverviewRoute(realmCode)}
				>
					{realmCode}
				</Link>
			),
		},
		{
			title: 'Дата создания',
			dataIndex: 'createdAt',
			render: formatDate,
		},
		{
			align: 'center',
			title: 'Действия',
			width: 150,
			render: (_, user) => (
				<div
					className={styles.actions}
					onClick={event => event.stopPropagation()}
				>
					{renderActions?.(user)}
				</div>
			),
		},
	]

	return (
		<Table<PlatformUser>
			className={styles.table}
			columns={columns}
			dataSource={data}
			onRow={user => ({
				onClick: () => onOpen(user.id),
				style: { cursor: 'pointer' },
			})}
			pagination={{
				pageSize: 10,
				position: ['bottomRight'],
			}}
			rowKey='id'
			scroll={{ x: 980 }}
		/>
	)
}
