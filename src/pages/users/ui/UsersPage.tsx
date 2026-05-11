import type { PlatformUser } from '@/entities/user'
import {
	selectFilteredUsers,
	useUsersStore,
	UsersFilters,
	UsersList,
} from '@/features/users'
import { buildUserRoute, ROUTES } from '@/shared/config'
import { ActionsDropdown, type ActionsDropdownItem } from '@/shared/ui/ActionsDropdown'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Card, Space, message } from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './UsersPage.module.css'

export const UsersPage = () => {
	const navigate = useNavigate()
	const users = useUsersStore(useShallow(selectFilteredUsers))
	const deleteUser = useUsersStore(state => state.deleteUser)
	const toggleStatus = useUsersStore(state => state.toggleStatus)

	const getActions = (user: PlatformUser): ActionsDropdownItem[] => [
		{
			key: 'view',
			label: 'View',
			onClick: () => navigate(buildUserRoute(user.id)),
		},
		{
			key: 'edit',
			label: 'Edit',
			onClick: () => navigate(buildUserRoute(user.id)),
		},
		{
			key: 'assign-roles',
			label: 'Assign roles',
			onClick: () => navigate(buildUserRoute(user.id)),
		},
		{
			key: 'toggle-status',
			label: user.status === 'active' ? 'Block' : 'Unblock',
			onClick: () => {
				toggleStatus(user.id)
				message.success(
					user.status === 'active'
						? `${user.username} заблокирован`
						: `${user.username} разблокирован`,
				)
			},
		},
		{
			key: 'delete',
			label: 'Delete',
			danger: true,
			confirm: {
				description: 'Пользователь будет удалён из списка.',
				okText: 'Удалить',
				title: 'Удалить пользователя?',
			},
			onClick: () => {
				deleteUser(user.id)
				message.success(`${user.username} удалён`)
			},
		},
	]

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Platform management</Text>
					<Title level={1}>Users</Title>
				</div>

				<ButtonField onClick={() => navigate(ROUTES.USER_CREATE)}>
					<span className={styles.createButtonIcon}>+</span>
					Создать пользователя
				</ButtonField>
			</div>

			<Card>
				<Space
					className={styles.cardSpace}
					direction='vertical'
					size={20}
					style={{ width: '100%' }}
				>
					<UsersFilters />
					<UsersList
						data={users}
						onOpen={userId => navigate(buildUserRoute(userId))}
						renderActions={user => <ActionsDropdown items={getActions(user)} />}
					/>
				</Space>
			</Card>
		</div>
	)
}
