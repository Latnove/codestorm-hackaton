import { getPlatformUsers, userKeys } from '@/entities/user'
import { UsersListPanel } from '@/widgets/users-list-panel'
import { useQuery } from '@tanstack/react-query'

interface RealmUsersListProps {
	realmCode: string
}

export const RealmUsersList = ({ realmCode }: RealmUsersListProps) => {
	const params = { realmCode, size: 100 }
	const { data } = useQuery({
		enabled: Boolean(realmCode),
		queryFn: () => getPlatformUsers(params),
		queryKey: userKeys.list(params),
	})

	return (
		<UsersListPanel
			description='Пользователи платформы, связанные с текущим Realm'
			title='Связанные пользователи'
			users={data?.items ?? []}
		/>
	)
}
