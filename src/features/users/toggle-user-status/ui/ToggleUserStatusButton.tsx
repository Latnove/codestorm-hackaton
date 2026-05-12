import type { PlatformUser } from '@/entities/user'
import { useUsersStore } from '@/features/users/users-catalog/model'
import { ButtonField } from '@/shared/ui/ButtonField'
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
	const toggleStatus = useUsersStore(state => state.toggleStatus)
	const isActive = user.status === 'active'

	const handleToggle = () => {
		toggleStatus(user.id)
		message.success(
			isActive
				? `${user.username} заблокирован`
				: `${user.username} разблокирован`,
		)
		onDone?.()
	}

	return (
		<ButtonField
			onClick={handleToggle}
			type={variant === 'menu-item' ? 'text' : 'default'}
		>
			{isActive ? 'Заблокировать' : 'Разблокировать'}
		</ButtonField>
	)
}
