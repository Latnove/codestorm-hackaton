import type { PlatformUser } from '@/entities/user'
import { DeleteUserButton, ToggleUserStatusButton } from '@/features/users'
import { buildUserRoute } from '@/shared/config'
import { ActionsDropdown } from '@/shared/ui/ActionsDropdown'
import { ButtonField } from '@/shared/ui/ButtonField'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import styles from './UserManageActions.module.css'

interface UserManageActionsProps {
	className?: string
	showView?: boolean
	user: PlatformUser
	variant?: 'dropdown' | 'inline'
}

export const UserManageActions = ({
	className,
	showView = true,
	user,
	variant = 'dropdown',
}: UserManageActionsProps) => {
	const navigate = useNavigate()

	const renderActions = (onDone?: () => void) => (
		<>
			{showView && (
				<ButtonField
					onClick={() => {
						navigate(buildUserRoute(user.id))
						onDone?.()
					}}
					type={variant === 'dropdown' ? 'text' : 'default'}
				>
					Информация
				</ButtonField>
			)}

			{showView && (
				<ToggleUserStatusButton
					onDone={onDone}
					user={user}
					variant={variant === 'dropdown' ? 'menu-item' : 'button'}
				/>
			)}

			<DeleteUserButton
				onDone={onDone}
				user={user}
				variant={variant === 'dropdown' ? 'menu-item' : 'button'}
			/>
		</>
	)

	if (variant === 'inline') {
		return (
			<div className={clsx(styles.inline, className)}>{renderActions()}</div>
		)
	}

	return (
		<div className={className}>
			<ActionsDropdown>{({ close }) => renderActions(close)}</ActionsDropdown>
		</div>
	)
}
