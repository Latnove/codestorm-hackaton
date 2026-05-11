import {
	roleLabels,
	type PlatformUser,
	type PlatformUserStatus,
} from '@/entities/user'
import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ReactNode } from 'react'
import styles from './UsersList.module.css'

const { Text } = Typography

const statusColor: Record<PlatformUserStatus, string> = {
	active: 'green',
	blocked: 'red',
}

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
			title: 'Status',
			dataIndex: 'status',
			render: (value: PlatformUserStatus) => (
				<Tag color={statusColor[value]}>{value}</Tag>
			),
		},
		{
			title: 'Global roles',
			dataIndex: 'globalRoles',
			render: (roles: PlatformUser['globalRoles']) => (
				<div className={styles.roles}>
					{roles.map(role => (
						<Tag color='geekblue' key={role}>
							{roleLabels[role]}
						</Tag>
					))}
				</div>
			),
		},
		{
			title: 'Created at',
			dataIndex: 'createdAt',
			render: formatDate,
		},
		{
			align: 'center',
			title: 'Actions',
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
