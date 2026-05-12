import type { RealmRole } from '@/entities/realm'
import { RealmRoleFormButton } from '@/features/realms/create-role'
import { useRealmRolesStore } from '@/features/realms/realm-roles/model'
import { ActionsDropdown } from '@/shared/ui/ActionsDropdown'
import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { message, Tooltip } from 'antd'
import styles from './RealmRoleActions.module.css'

interface RealmRoleActionsProps {
	existingRoleCodes: string[]
	realmCode: string
	role: RealmRole
}

const DELETE_BLOCKED_MESSAGE =
	'Эта роль используется в политиках доступа MiniApp. Удаление невозможно.'

export const RealmRoleActions = ({
	existingRoleCodes,
	realmCode,
	role,
}: RealmRoleActionsProps) => {
	const deleteRealmRole = useRealmRolesStore(state => state.deleteRealmRole)
	const canDelete = role.usedInPoliciesCount === 0

	const handleDelete = (onDone: () => void) => {
		const deleted = deleteRealmRole(role.id)

		if (!deleted) {
			message.warning(DELETE_BLOCKED_MESSAGE)
			return
		}

		message.success(`Роль ${role.code} удалена`)
		onDone()
	}

	const deleteButton = (
		<ButtonField
			aria-disabled={!canDelete}
			danger
			onClick={() => {
				if (!canDelete) {
					message.warning(DELETE_BLOCKED_MESSAGE)
				}
			}}
			type='text'
		>
			Удалить
		</ButtonField>
	)

	return (
		<ActionsDropdown>
			{({ close }) => (
				<>
					<RealmRoleFormButton
						existingRoleCodes={existingRoleCodes}
						onDone={close}
						realmCode={realmCode}
						role={role}
						triggerProps={{
							onClick: close,
							type: 'text',
						}}
					>
						Изменить
					</RealmRoleFormButton>

					{!canDelete ? (
						<Tooltip title={DELETE_BLOCKED_MESSAGE}>
							<span className={styles.tooltipTarget}>{deleteButton}</span>
						</Tooltip>
					) : (
						<DeleteConfirm
							description='Роль будет удалена из текущего Realm.'
							okText='Удалить'
							onConfirm={() => handleDelete(close)}
							title='Удалить роль?'
						>
							{deleteButton}
						</DeleteConfirm>
					)}
				</>
			)}
		</ActionsDropdown>
	)
}
