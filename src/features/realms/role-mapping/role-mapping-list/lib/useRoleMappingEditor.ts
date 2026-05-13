import {
	createRoleMapping,
	roleMappingSchema,
	roleMappingKeys,
	updateRoleMapping,
	type ExternalRoleMapping,
	type RealmRole,
	type RoleMappingFormValues,
} from '@/entities/realm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
	const queryClient = useQueryClient()
	const [editingId, setEditingId] = useState<string | null>(null)
	const [values, setValues] = useState<RoleMappingFormValues>({
		...emptyRoleMappingValues,
	})

	const realmRoleOptions = useMemo(
		() => buildRealmRoleOptions(realmRoles),
		[realmRoles],
	)
	const invalidateMappings = () => {
		void queryClient.invalidateQueries({
			queryKey: roleMappingKeys.list(realmCode),
		})
	}
	const createMappingMutation = useMutation({
		mutationFn: (nextValues: RoleMappingFormValues) =>
			createRoleMapping(realmCode, nextValues),
		onSuccess: mapping => {
			invalidateMappings()
			message.success(`Mapping для ${mapping.externalRole} создан`)
			cancelEdit()
		},
		onError: () => {
			message.error('Не удалось создать mapping')
		},
	})
	const updateMappingMutation = useMutation({
		mutationFn: (nextValues: RoleMappingFormValues) => {
			if (!editingId) {
				return Promise.reject(new Error('Mapping id is required'))
			}

			return updateRoleMapping(realmCode, editingId, {
				realmRoleCode: nextValues.realmRoleCode,
			})
		},
		onSuccess: mapping => {
			invalidateMappings()
			message.success(`Mapping для ${mapping.externalRole} обновлён`)
			cancelEdit()
		},
		onError: () => {
			message.error('Не удалось обновить mapping')
		},
	})

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
			createMappingMutation.mutate(result.data)
			return
		}

		if (editingId) {
			updateMappingMutation.mutate(result.data)
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
		saving: createMappingMutation.isPending || updateMappingMutation.isPending,
		updateValue,
		values,
	}
}
