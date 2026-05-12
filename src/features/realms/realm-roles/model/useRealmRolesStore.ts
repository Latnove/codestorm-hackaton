import {
	mockRealmRoles,
	type RealmRole,
	type RealmRoleFormValues,
} from '@/entities/realm'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RealmRolesState {
	roles: RealmRole[]
}

interface RealmRolesActions {
	createRealmRole: (realmCode: string, values: RealmRoleFormValues) => void
	updateRealmRole: (
		roleId: string,
		values: Pick<RealmRoleFormValues, 'description' | 'name'>,
	) => void
	deleteRealmRole: (roleId: string) => boolean
}

type RealmRolesStore = RealmRolesState & RealmRolesActions

const buildRealmRoleId = (realmCode: string, code: string) =>
	`realm-role-${realmCode}-${code.toLowerCase().replaceAll('_', '-')}`

const initialState: RealmRolesState = {
	roles: mockRealmRoles,
}

export const useRealmRolesStore = create<RealmRolesStore>()(
	devtools(
		set => ({
			...initialState,

			createRealmRole: (realmCode, values) => {
				const now = new Date().toISOString()
				const code = values.code.trim()
				const role: RealmRole = {
					id: buildRealmRoleId(realmCode, code),
					code,
					createdAt: now,
					description: values.description?.trim() || undefined,
					name: values.name.trim(),
					realmCode,
					updatedAt: now,
					usedInPoliciesCount: 0,
				}

				set(
					state => ({
						roles: [role, ...state.roles],
					}),
					false,
					'realm-roles/createRealmRole',
				)
			},

			updateRealmRole: (roleId, values) => {
				set(
					state => ({
						roles: state.roles.map(role =>
							role.id === roleId
								? {
										...role,
										description: values.description?.trim() || undefined,
										name: values.name.trim(),
										updatedAt: new Date().toISOString(),
									}
								: role,
						),
					}),
					false,
					'realm-roles/updateRealmRole',
				)
			},

			deleteRealmRole: roleId => {
				let canDelete = true

				set(
					state => {
						const role = state.roles.find(item => item.id === roleId)

						if (!role || role.usedInPoliciesCount > 0) {
							canDelete = false

							return state
						}

						return {
							roles: state.roles.filter(item => item.id !== roleId),
						}
					},
					false,
					'realm-roles/deleteRealmRole',
				)

				return canDelete
			},
		}),
		{ name: 'realm-roles-store' },
	),
)

export const selectRealmRolesByRealmCode =
	(realmCode: string) => (state: RealmRolesStore) =>
		state.roles.filter(role => role.realmCode === realmCode)

export const useRealmRolesActions = (state: RealmRolesStore) => ({
	createRealmRole: state.createRealmRole,
	deleteRealmRole: state.deleteRealmRole,
	updateRealmRole: state.updateRealmRole,
})
