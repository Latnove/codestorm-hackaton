import type { Realm } from '@/entities/realm'
import { useRealmsStore } from '@/features/realms/realms-catalog/model'
import { ButtonField } from '@/shared/ui/ButtonField'
import { message } from 'antd'

interface ToggleRealmStatusButtonProps {
	onDone?: () => void
	realm: Realm
	variant?: 'button' | 'menu-item'
}

export const ToggleRealmStatusButton = ({
	onDone,
	realm,
	variant = 'button',
}: ToggleRealmStatusButtonProps) => {
	const toggleStatus = useRealmsStore(state => state.toggleStatus)
	const isActive = realm.status === 'ACTIVE'

	const handleToggle = () => {
		toggleStatus(realm.code)
		message.success(
			isActive
				? `Realm ${realm.code} отключён`
				: `Realm ${realm.code} включён`,
		)
		onDone?.()
	}

	return (
		<ButtonField
			onClick={handleToggle}
			type={variant === 'menu-item' ? 'text' : 'default'}
		>
			{isActive ? 'Отключить' : 'Включить'}
		</ButtonField>
	)
}
