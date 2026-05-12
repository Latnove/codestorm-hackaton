import type { RealmRole } from '@/entities/realm'
import { RealmRoleActions } from '@/features/realms/realm-role-actions'
import { Empty, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Text from 'antd/es/typography/Text'
import { useMemo } from 'react'
import styles from './RealmRolesList.module.css'

interface RealmRolesListProps {
	realmCode: string
	roles: RealmRole[]
}

const formatDate = (value: string) => new Date(value).toLocaleDateString()

export const RealmRolesList = ({ realmCode, roles }: RealmRolesListProps) => {
	const roleCodes = useMemo(() => roles.map(role => role.code), [roles])

	const columns: ColumnsType<RealmRole> = [
		{
			dataIndex: 'code',
			render: (code: string) => <Tag color='geekblue'>{code}</Tag>,
			title: 'Code',
		},
		{
			dataIndex: 'name',
			render: (name: string) => <Text className={styles.name}>{name}</Text>,
			title: 'Название',
		},
		{
			dataIndex: 'description',
			render: (description?: string) => description || '-',
			title: 'Описание',
		},
		{
			align: 'center',
			dataIndex: 'usedInPoliciesCount',
			render: (count: number) => (
				<Tag color={count > 0 ? 'gold' : 'default'}>{count}</Tag>
			),
			title: 'В политиках',
			width: 160,
		},
		{
			dataIndex: 'createdAt',
			render: formatDate,
			title: 'Создана',
			width: 130,
		},
		{
			align: 'center',
			render: (_, role) => (
				<RealmRoleActions
					existingRoleCodes={roleCodes}
					realmCode={realmCode}
					role={role}
				/>
			),
			title: 'Действия',
			width: 150,
		},
	]

	if (roles.length === 0) {
		return <Empty className={styles.empty} description='Роли не найдены' />
	}

	return (
		<Table<RealmRole>
			className={styles.table}
			columns={columns}
			dataSource={roles}
			pagination={false}
			rowKey='id'
			scroll={{ x: 980 }}
		/>
	)
}
