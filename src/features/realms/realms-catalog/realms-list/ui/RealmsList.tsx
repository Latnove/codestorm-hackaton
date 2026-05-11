import { type Realm, type RealmStatus } from '@/entities/realm'
import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ReactNode } from 'react'
import styles from './RealmsList.module.css'

const { Text } = Typography

const statusColor: Record<RealmStatus, string> = {
	ACTIVE: '#16a34a',
	DISABLED: '#ea580c',
}

interface RealmsListProps {
	data: Realm[]
	onOpen: (realmCode: string) => void
	renderActions?: (realm: Realm) => ReactNode
}

export const RealmsList = ({
	data,
	onOpen,
	renderActions,
}: RealmsListProps) => {
	const columns: ColumnsType<Realm> = [
		{
			title: 'Code',
			dataIndex: 'code',
			render: (value: string) => <Text strong>{value}</Text>,
		},
		{ title: 'Name', dataIndex: 'name' },
		{
			title: 'Status',
			dataIndex: 'status',
			render: (value: RealmStatus) => (
				<Tag color={statusColor[value]}>{value}</Tag>
			),
		},
		{ title: 'MiniApps count', dataIndex: 'miniappsCount' },
		{ title: 'Clients count', dataIndex: 'clientsCount' },
		{
			title: 'Created at',
			dataIndex: 'createdAt',
			render: (value: string) => new Date(value).toLocaleDateString(),
		},
		{
			align: 'center',
			title: 'Actions',
			width: 150,
			render: (_, realm) => (
				<div
					className={styles.actions}
					onClick={event => event.stopPropagation()}
				>
					{renderActions?.(realm)}
				</div>
			),
		},
	]

	return (
		<Table<Realm>
			columns={columns}
			dataSource={data}
			className={styles.table}
			onRow={realm => ({
				onClick: () => onOpen(realm.code),
				style: { cursor: 'pointer' },
			})}
			pagination={{
				pageSize: 10,
				position: ['bottomRight'],
			}}
			rowKey='id'
			scroll={{ x: 1040 }}
		/>
	)
}
