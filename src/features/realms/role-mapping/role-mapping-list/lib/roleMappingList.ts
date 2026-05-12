import type {
	ExternalRoleMapping,
	RealmRole,
	RoleMappingFormValues,
} from '@/entities/realm'

export const NEW_MAPPING_ID = 'new-role-mapping'

export type RoleMappingRow = ExternalRoleMapping & {
	isDraft?: boolean
}

export const emptyRoleMappingValues: RoleMappingFormValues = {
	externalRole: '',
	realmRoleCode: '',
}

export const formatRoleMappingDate = (value: string) =>
	value ? new Date(value).toLocaleDateString() : '-'

export const buildDraftRoleMappingRow = (
	realmCode: string,
	realmRoleCode: string,
): RoleMappingRow => ({
	id: NEW_MAPPING_ID,
	createdAt: '',
	externalRole: '',
	isDraft: true,
	realmCode,
	realmRoleCode,
	updatedAt: '',
})

export const buildRealmRoleOptions = (realmRoles: RealmRole[]) =>
	realmRoles.map(role => ({
		label: `${role.code} · ${role.name}`,
		value: role.code,
	}))

export const getValuesFromMapping = (
	mapping: ExternalRoleMapping,
): RoleMappingFormValues => ({
	externalRole: mapping.externalRole,
	realmRoleCode: mapping.realmRoleCode,
})
