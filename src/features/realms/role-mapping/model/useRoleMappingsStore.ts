import {
	mockRoleMappings,
	type ExternalRoleMapping,
	type RoleMappingFormValues,
} from '@/entities/realm'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RoleMappingsState {
	mappings: ExternalRoleMapping[]
}

interface RoleMappingsActions {
	createRoleMapping: (realmCode: string, values: RoleMappingFormValues) => void
	updateRoleMapping: (
		mappingId: string,
		values: RoleMappingFormValues,
	) => void
	deleteRoleMapping: (mappingId: string) => void
}

type RoleMappingsStore = RoleMappingsState & RoleMappingsActions

const buildRoleMappingId = (realmCode: string, externalRole: string) =>
	`role-mapping-${realmCode}-${externalRole.toLowerCase().replaceAll('_', '-')}-${Date.now()}`

const initialState: RoleMappingsState = {
	mappings: mockRoleMappings,
}

export const useRoleMappingsStore = create<RoleMappingsStore>()(
	devtools(
		set => ({
			...initialState,

			createRoleMapping: (realmCode, values) => {
				const now = new Date().toISOString()
				const externalRole = values.externalRole.trim()
				const mapping: ExternalRoleMapping = {
					id: buildRoleMappingId(realmCode, externalRole),
					createdAt: now,
					externalRole,
					realmCode,
					realmRoleCode: values.realmRoleCode,
					updatedAt: now,
				}

				set(
					state => ({
						mappings: [mapping, ...state.mappings],
					}),
					false,
					'role-mappings/createRoleMapping',
				)
			},

			updateRoleMapping: (mappingId, values) => {
				set(
					state => ({
						mappings: state.mappings.map(mapping =>
							mapping.id === mappingId
								? {
										...mapping,
										externalRole: values.externalRole.trim(),
										realmRoleCode: values.realmRoleCode,
										updatedAt: new Date().toISOString(),
									}
								: mapping,
						),
					}),
					false,
					'role-mappings/updateRoleMapping',
				)
			},

			deleteRoleMapping: mappingId => {
				set(
					state => ({
						mappings: state.mappings.filter(mapping => mapping.id !== mappingId),
					}),
					false,
					'role-mappings/deleteRoleMapping',
				)
			},
		}),
		{ name: 'role-mappings-store' },
	),
)

export const selectRoleMappingsByRealmCode =
	(realmCode: string) => (state: RoleMappingsStore) =>
		state.mappings.filter(mapping => mapping.realmCode === realmCode)
