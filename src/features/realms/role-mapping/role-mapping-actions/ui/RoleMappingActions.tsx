import {
	deleteRoleMapping,
	roleMappingKeys,
	type ExternalRoleMapping,
} from '@/entities/realm'
import { ActionsDropdown } from '@/shared/ui/ActionsDropdown'
import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

interface RoleMappingActionsProps {
	mapping: ExternalRoleMapping
	onEdit: (mapping: ExternalRoleMapping) => void
}

export const RoleMappingActions = ({
	mapping,
	onEdit,
}: RoleMappingActionsProps) => {
	const queryClient = useQueryClient()
	const deleteMappingMutation = useMutation({
		mutationFn: () => deleteRoleMapping(mapping.realmCode, mapping.id),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: roleMappingKeys.list(mapping.realmCode),
			})
			message.success(`Mapping для ${mapping.externalRole} удалён`)
		},
		onError: () => {
			message.error(`Не удалось удалить mapping для ${mapping.externalRole}`)
		},
	})

	const handleDelete = (onDone: () => void) => {
		deleteMappingMutation.mutate()
		onDone()
	}

	return (
		<ActionsDropdown>
			{({ close }) => (
				<>
					<ButtonField
						onClick={() => {
							close()
							onEdit(mapping)
						}}
						type='text'
					>
						Изменить
					</ButtonField>

					<DeleteConfirm
						description='Связь external role с Realm Role будет удалена.'
						okText='Удалить'
						onConfirm={() => handleDelete(close)}
						title='Удалить mapping?'
					>
						<ButtonField danger loading={deleteMappingMutation.isPending} type='text'>
							Удалить
						</ButtonField>
					</DeleteConfirm>
				</>
			)}
		</ActionsDropdown>
	)
}
