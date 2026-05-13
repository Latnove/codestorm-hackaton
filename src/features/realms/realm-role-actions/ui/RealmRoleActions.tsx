import {
	deleteRealmRole,
	realmRoleKeys,
	roleMappingKeys,
	type RealmRole,
} from '@/entities/realm'
import { RealmRoleFormButton } from '@/features/realms/create-role'
import { ActionsDropdown } from '@/shared/ui/ActionsDropdown'
import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
	const queryClient = useQueryClient()
	const canDelete = role.usedInPoliciesCount === 0
	const deleteRoleMutation = useMutation({
		mutationFn: () => deleteRealmRole(realmCode, role.code),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: realmRoleKeys.list(realmCode),
			})
			void queryClient.invalidateQueries({
				queryKey: roleMappingKeys.list(realmCode),
			})
			message.success(`Роль ${role.code} удалена`)
		},
		onError: () => {
			message.error(`Не удалось удалить роль ${role.code}`)
		},
	})

	const handleDelete = (onDone: () => void) => {
		if (!canDelete) {
			message.warning(DELETE_BLOCKED_MESSAGE)
			return
		}

		deleteRoleMutation.mutate()
		onDone()
	}

	const deleteButton = (
		<ButtonField
			aria-disabled={!canDelete}
			danger
			loading={deleteRoleMutation.isPending}
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
