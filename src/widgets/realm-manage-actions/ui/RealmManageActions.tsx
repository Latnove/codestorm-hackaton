import type { Realm } from '@/entities/realm'
import {
	DeleteRealmButton,
	EditRealmButton,
	OpenRealmButton,
	ToggleRealmStatusButton,
} from '@/features/realms'
import { ActionsDropdown } from '@/shared/ui/ActionsDropdown'
import clsx from 'clsx'
import styles from './RealmManageActions.module.css'

interface RealmManageActionsProps {
	afterDeletePath?: string
	className?: string
	realm: Realm
	showOpen?: boolean
	variant?: 'dropdown' | 'inline'
}

export const RealmManageActions = ({
	afterDeletePath,
	className,
	realm,
	showOpen = false,
	variant = 'dropdown',
}: RealmManageActionsProps) => {
	const renderActions = (onDone?: () => void) => (
		<>
			{showOpen && (
				<OpenRealmButton
					onDone={onDone}
					realmCode={realm.code}
					variant={variant === 'dropdown' ? 'menu-item' : 'button'}
				/>
			)}

			<EditRealmButton
				onDone={onDone}
				realm={realm}
				variant={variant === 'dropdown' ? 'menu-item' : 'button'}
			/>

			<ToggleRealmStatusButton
				onDone={onDone}
				realm={realm}
				variant={variant === 'dropdown' ? 'menu-item' : 'button'}
			/>

			<DeleteRealmButton
				afterDeletePath={afterDeletePath}
				onDone={onDone}
				realmCode={realm.code}
				variant={variant === 'dropdown' ? 'menu-item' : 'button'}
			/>
		</>
	)

	if (variant === 'inline') {
		return (
			<div className={clsx(styles.inline, className)}>
				{renderActions()}
			</div>
		)
	}

	return (
		<div className={className}>
			<ActionsDropdown>{({ close }) => renderActions(close)}</ActionsDropdown>
		</div>
	)
}
