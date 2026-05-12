import type { PlatformUser } from '@/entities/user'
import { useUsersStore } from '@/features/users/users-catalog/model'
import { ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

interface DeleteUserButtonProps {
	onDone?: () => void
	user: PlatformUser
	variant?: 'button' | 'menu-item'
}

export const DeleteUserButton = ({
	onDone,
	user,
	variant = 'button',
}: DeleteUserButtonProps) => {
	const location = useLocation()
	const navigate = useNavigate()
	const deleteUser = useUsersStore(state => state.deleteUser)

	const handleDelete = () => {
		const isCurrentUserPage = location.pathname === `/users/${user.id}`

		deleteUser(user.id)
		message.success(`${user.username} удалён`)
		onDone?.()

		if (isCurrentUserPage) {
			navigate(ROUTES.USERS, { replace: true })
		}
	}

	return (
		<DeleteConfirm
			description='Пользователь будет удалён из списка.'
			okText='Удалить'
			onConfirm={handleDelete}
			title='Удалить пользователя?'
		>
			<ButtonField danger type={variant === 'menu-item' ? 'text' : 'default'}>
				Удалить
			</ButtonField>
		</DeleteConfirm>
	)
}
