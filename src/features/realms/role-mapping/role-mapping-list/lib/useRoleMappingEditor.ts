import {
	roleMappingSchema,
	type ExternalRoleMapping,
	type RealmRole,
	type RoleMappingFormValues,
} from '@/entities/realm'
import { useRoleMappingsStore } from '@/features/realms/role-mapping/model'
import { message } from 'antd'
import { useMemo, useState } from 'react'
import {
	buildDraftRoleMappingRow,
	buildRealmRoleOptions,
	emptyRoleMappingValues,
	getValuesFromMapping,
	NEW_MAPPING_ID,
	type RoleMappingRow,
} from './roleMappingList'

interface UseRoleMappingEditorParams {
	mappings: ExternalRoleMapping[]
	realmCode: string
	realmRoles: RealmRole[]
}

export type UpdateRoleMappingValue = <
	TKey extends keyof RoleMappingFormValues,
>(
	key: TKey,
	value: RoleMappingFormValues[TKey],
) => void

export const useRoleMappingEditor = ({
	mappings,
	realmCode,
	realmRoles,
}: UseRoleMappingEditorParams) => {
	const createRoleMapping = useRoleMappingsStore(
		state => state.createRoleMapping,
	)
	const updateRoleMapping = useRoleMappingsStore(
		state => state.updateRoleMapping,
	)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [values, setValues] = useState<RoleMappingFormValues>({
		...emptyRoleMappingValues,
	})

	const realmRoleOptions = useMemo(
		() => buildRealmRoleOptions(realmRoles),
		[realmRoles],
	)

	const dataSource: RoleMappingRow[] = useMemo(
		() =>
			editingId === NEW_MAPPING_ID
				? [
						buildDraftRoleMappingRow(realmCode, values.realmRoleCode),
						...mappings,
					]
				: mappings,
		[editingId, mappings, realmCode, values.realmRoleCode],
	)

	const updateValue: UpdateRoleMappingValue = (key, value) => {
		setValues(current => ({
			...current,
			[key]: value,
		}))
	}

	const cancelEdit = () => {
		setEditingId(null)
		setValues(emptyRoleMappingValues)
	}

	const startCreate = () => {
		if (realmRoles.length === 0) {
			message.warning('Сначала создайте Realm Role')
			return
		}

		setValues({
			externalRole: '',
			realmRoleCode: realmRoles[0]?.code ?? '',
		})
		setEditingId(NEW_MAPPING_ID)
	}

	const startEdit = (mapping: ExternalRoleMapping) => {
		setValues(getValuesFromMapping(mapping))
		setEditingId(mapping.id)
	}

	const saveRow = () => {
		const result = roleMappingSchema.safeParse(values)

		if (!result.success) {
			message.warning(result.error.issues[0]?.message ?? 'Проверьте поля')
			return
		}

		if (editingId === NEW_MAPPING_ID) {
			createRoleMapping(realmCode, result.data)
			message.success(`Mapping для ${result.data.externalRole} создан`)
			cancelEdit()
			return
		}

		if (editingId) {
			updateRoleMapping(editingId, result.data)
			message.success(`Mapping для ${result.data.externalRole} обновлён`)
			cancelEdit()
		}
	}

	return {
		cancelEdit,
		canCreate: !editingId && realmRoles.length > 0,
		dataSource,
		editingId,
		realmRoleOptions,
		saveRow,
		startCreate,
		startEdit,
		updateValue,
		values,
	}
}
