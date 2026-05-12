import type { ExternalRoleMapping } from '@/entities/realm'
import { useRoleMappingsStore } from '@/features/realms/role-mapping/model'
import { ActionsDropdown } from '@/shared/ui/ActionsDropdown'
import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { message } from 'antd'

interface RoleMappingActionsProps {
	mapping: ExternalRoleMapping
	onEdit: (mapping: ExternalRoleMapping) => void
}

export const RoleMappingActions = ({
	mapping,
	onEdit,
}: RoleMappingActionsProps) => {
	const deleteRoleMapping = useRoleMappingsStore(
		state => state.deleteRoleMapping,
	)

	const handleDelete = (onDone: () => void) => {
		deleteRoleMapping(mapping.id)
		message.success(`Mapping для ${mapping.externalRole} удалён`)
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
						<ButtonField danger type='text'>
							Удалить
						</ButtonField>
					</DeleteConfirm>
				</>
			)}
		</ActionsDropdown>
	)
}
