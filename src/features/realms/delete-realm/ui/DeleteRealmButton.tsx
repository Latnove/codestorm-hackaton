import { useRealmsStore } from '@/features/realms/realms-catalog/model'
import { ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

interface DeleteRealmButtonProps {
	afterDeletePath?: string
	onDone?: () => void
	realmCode: string
	variant?: 'button' | 'menu-item'
}

export const DeleteRealmButton = ({
	afterDeletePath,
	onDone,
	realmCode,
	variant = 'button',
}: DeleteRealmButtonProps) => {
	const location = useLocation()
	const navigate = useNavigate()
	const deleteRealm = useRealmsStore(state => state.deleteRealm)

	const handleDelete = () => {
		const isCurrentRealmPage =
			location.pathname === `/realms/${realmCode}` ||
			location.pathname.startsWith(`/realms/${realmCode}/`)
		const redirectPath =
			afterDeletePath ?? (isCurrentRealmPage ? ROUTES.REALMS : undefined)

		if (redirectPath) {
			navigate(redirectPath, { replace: isCurrentRealmPage })
		}

		window.setTimeout(() => {
			deleteRealm(realmCode)
			message.success(`Realm ${realmCode} удалён`)
			onDone?.()
		}, 0)
	}

	return (
		<DeleteConfirm
			description='Realm будет удалён из списка.'
			okText='Удалить'
			onConfirm={handleDelete}
			title='Удалить Realm?'
		>
			<ButtonField
				danger
				type={variant === 'menu-item' ? 'text' : 'default'}
			>
				Удалить
			</ButtonField>
		</DeleteConfirm>
	)
}
