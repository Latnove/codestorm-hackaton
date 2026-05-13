import type { RoleMappingFormValues } from '@/entities/realm'
import { RoleMappingActions } from '@/features/realms/role-mapping/role-mapping-actions'
import type { ColumnsType } from 'antd/es/table'
import {
	formatRoleMappingDate,
	type RoleMappingRow,
} from '../lib/roleMappingList'
import type { UpdateRoleMappingValue } from '../lib/useRoleMappingEditor'
import {
	RoleMappingExternalRoleCell,
	RoleMappingRealmRoleCell,
} from './RoleMappingEditableCells'
import { RoleMappingEditActions } from './RoleMappingEditActions'

interface GetRoleMappingColumnsParams {
	cancelEdit: () => void
	editingId: string | null
	realmRoleOptions: Array<{ label: string; value: string }>
	saveRow: () => void
	saving: boolean
	startEdit: (mapping: RoleMappingRow) => void
	updateValue: UpdateRoleMappingValue
	values: RoleMappingFormValues
}

export const getRoleMappingColumns = ({
	cancelEdit,
	editingId,
	realmRoleOptions,
	saveRow,
	saving,
	startEdit,
	updateValue,
	values,
}: GetRoleMappingColumnsParams): ColumnsType<RoleMappingRow> => [
	{
		dataIndex: 'externalRole',
		render: (_, row) => (
			<RoleMappingExternalRoleCell
				editingId={editingId}
				realmRoleOptions={realmRoleOptions}
				row={row}
				updateValue={updateValue}
				values={values}
			/>
		),
		title: 'External Role',
		width: 280,
	},
	{
		dataIndex: 'realmRoleCode',
		render: (_, row) => (
			<RoleMappingRealmRoleCell
				editingId={editingId}
				realmRoleOptions={realmRoleOptions}
				row={row}
				updateValue={updateValue}
				values={values}
			/>
		),
		title: 'Realm Role',
		width: 320,
	},
	{
		dataIndex: 'createdAt',
		render: formatRoleMappingDate,
		title: 'Создан',
		width: 130,
	},
	{
		align: 'center',
		render: (_, row) =>
			row.id === editingId ? (
				<RoleMappingEditActions
					loading={saving}
					onCancel={cancelEdit}
					onSave={saveRow}
				/>
			) : (
				<RoleMappingActions mapping={row} onEdit={startEdit} />
		),
		title: 'Действия',
		width: 210,
	},
]
