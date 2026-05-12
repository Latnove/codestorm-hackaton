import { useUsersStore } from '@/features/users'
import { UsersListPanel } from '@/widgets/users-list-panel'
import { useShallow } from 'zustand/react/shallow'

interface RealmUsersListProps {
	realmCode: string
}

export const RealmUsersList = ({ realmCode }: RealmUsersListProps) => {
	const users = useUsersStore(
		useShallow(state =>
			state.users.filter(user => user.realmCode === realmCode),
		),
	)

	return (
		<UsersListPanel
			description='Пользователи платформы, связанные с текущим Realm'
			title='Связанные пользователи'
			users={users}
		/>
	)
}
