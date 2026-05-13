import { blockPlatformUser, userKeys, type PlatformUser } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
	const queryClient = useQueryClient()
	const blockUserMutation = useMutation({
		mutationFn: () => blockPlatformUser(user.id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: userKeys.lists() })
			void queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) })
			message.success(`${user.username} заблокирован`)
			onDone?.()
		},
		onError: () => {
			message.error(`Не удалось заблокировать ${user.username}`)
		},
	})

	const handleDelete = () => {
		const isCurrentUserPage = location.pathname === `/users/${user.id}`

		blockUserMutation.mutate()

		if (isCurrentUserPage) {
			navigate(ROUTES.USERS, { replace: true })
		}
	}

	return (
		<DeleteConfirm
			description='В текущем API нет удаления пользователя, действие заблокирует аккаунт.'
			okText='Заблокировать'
			onConfirm={handleDelete}
			title='Заблокировать пользователя?'
		>
			<ButtonField
				danger
				loading={blockUserMutation.isPending}
				type={variant === 'menu-item' ? 'text' : 'default'}
			>
				Заблокировать
			</ButtonField>
		</DeleteConfirm>
	)
}
