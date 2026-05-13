import {
	activatePlatformUser,
	blockPlatformUser,
	userKeys,
	type PlatformUser,
} from '@/entities/user'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

interface ToggleUserStatusButtonProps {
	onDone?: () => void
	user: PlatformUser
	variant?: 'button' | 'menu-item'
}

export const ToggleUserStatusButton = ({
	onDone,
	user,
	variant = 'button',
}: ToggleUserStatusButtonProps) => {
	const queryClient = useQueryClient()
	const isActive = user.status === 'active'
	const toggleUserMutation = useMutation({
		mutationFn: () =>
			isActive ? blockPlatformUser(user.id) : activatePlatformUser(user.id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: userKeys.lists() })
			void queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) })
			message.success(
				isActive
					? `${user.username} заблокирован`
					: `${user.username} разблокирован`,
			)
			onDone?.()
		},
		onError: () => {
			message.error(`Не удалось изменить статус ${user.username}`)
		},
	})

	const handleToggle = () => {
		toggleUserMutation.mutate()
	}

	return (
		<ButtonField
			onClick={handleToggle}
			loading={toggleUserMutation.isPending}
			type={variant === 'menu-item' ? 'text' : 'default'}
		>
			{isActive ? 'Заблокировать' : 'Разблокировать'}
		</ButtonField>
	)
}
