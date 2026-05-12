import {
	realmStatusColors,
	realmStatusLabels,
	type Realm,
	type RealmStatus,
} from '@/entities/realm'
import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ReactNode } from 'react'
import styles from './RealmsList.module.css'

const { Text } = Typography

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
			title: 'Статус',
			dataIndex: 'status',
			render: (value: RealmStatus) => (
				<Tag color={realmStatusColors[value]}>{realmStatusLabels[value]}</Tag>
			),
		},
		{ title: 'Число MiniApps', dataIndex: 'miniappsCount' },
		{ title: 'Число пользователй', dataIndex: 'clientsCount' },
		{
			title: 'Создан',
			dataIndex: 'createdAt',
			render: (value: string) => new Date(value).toLocaleDateString(),
		},
	]

	if (renderActions) {
		columns.push({
			align: 'center',
			title: 'Действия',
			width: 150,
			render: (_, realm) => (
				<div
					className={styles.actions}
					onClick={event => event.stopPropagation()}
				>
					{renderActions?.(realm)}
				</div>
			),
		})
	}

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
