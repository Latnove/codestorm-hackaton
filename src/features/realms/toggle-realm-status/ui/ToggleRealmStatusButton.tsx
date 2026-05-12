import {
	disableAdminRealm,
	enableAdminRealm,
	realmKeys,
	type Realm,
} from '@/entities/realm'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
	const queryClient = useQueryClient()
	const isActive = realm.status === 'ACTIVE'
	const toggleRealmMutation = useMutation({
		mutationFn: () =>
			isActive ? disableAdminRealm(realm.code) : enableAdminRealm(realm.code),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: realmKeys.lists() })
			void queryClient.invalidateQueries({
				queryKey: realmKeys.detail(realm.code),
			})
			message.success(
				isActive
					? `Realm ${realm.code} отключён`
					: `Realm ${realm.code} включён`,
			)
			onDone?.()
		},
		onError: () => {
			message.error(`Не удалось изменить статус Realm ${realm.code}`)
		},
	})

	const handleToggle = () => {
		toggleRealmMutation.mutate()
	}

	return (
		<ButtonField
			onClick={handleToggle}
			loading={toggleRealmMutation.isPending}
			type={variant === 'menu-item' ? 'text' : 'default'}
		>
			{isActive ? 'Отключить' : 'Включить'}
		</ButtonField>
	)
}
