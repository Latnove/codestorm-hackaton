import { getPlatformUsers, userKeys } from '@/entities/user'
import { useUsersFiltersState, useUsersStore } from '@/features/users'
import { ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { UsersListPanel } from '@/widgets/users-list-panel'
import { useQuery } from '@tanstack/react-query'
import Title from 'antd/es/typography/Title'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './UsersPage.module.css'

export const UsersPage = () => {
	const navigate = useNavigate()
	const filters = useUsersStore(useShallow(useUsersFiltersState))
	const { data: usersPage } = useQuery({
		queryFn: () => getPlatformUsers(filters),
		queryKey: userKeys.list(filters),
	})
	const users = usersPage?.items ?? []

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
