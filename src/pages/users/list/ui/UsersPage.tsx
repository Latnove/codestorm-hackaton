import { selectFilteredUsers, useUsersStore } from '@/features/users'
import { ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { UsersListPanel } from '@/widgets/users-list-panel'
import Title from 'antd/es/typography/Title'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './UsersPage.module.css'

export const UsersPage = () => {
	const navigate = useNavigate()
	const users = useUsersStore(useShallow(selectFilteredUsers))

	return (
		<div className={`container ${styles.wrapper}`}>
			<div className={styles.header}>
				<Title level={1}>Users</Title>

				<ButtonField onClick={() => navigate(ROUTES.USER_CREATE)}>
					<span className={styles.createButtonIcon}>+</span>
					Создать пользователя
				</ButtonField>
			</div>

			<UsersListPanel showFilters users={users} />
		</div>
	)
}
