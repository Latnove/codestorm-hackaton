import { deleteAdminRealm, realmKeys } from '@/entities/realm'
import { ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
	const queryClient = useQueryClient()
	const deleteRealmMutation = useMutation({
		mutationFn: () => deleteAdminRealm(realmCode),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: realmKeys.lists() })
			void queryClient.removeQueries({ queryKey: realmKeys.detail(realmCode) })
			message.success(`Realm ${realmCode} удалён`)
			onDone?.()
		},
		onError: () => {
			message.error(`Не удалось удалить Realm ${realmCode}`)
		},
	})

	const handleDelete = () => {
		const isCurrentRealmPage =
			location.pathname === `/realms/${realmCode}` ||
			location.pathname.startsWith(`/realms/${realmCode}/`)
		const redirectPath =
			afterDeletePath ?? (isCurrentRealmPage ? ROUTES.REALMS : undefined)

		if (redirectPath) {
			navigate(redirectPath, { replace: isCurrentRealmPage })
		}

		deleteRealmMutation.mutate()
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
				loading={deleteRealmMutation.isPending}
				type={variant === 'menu-item' ? 'text' : 'default'}
			>
				Удалить
			</ButtonField>
		</DeleteConfirm>
	)
}
