export type RealmMiniAppStatus = 'DRAFT' | 'PUBLISHED' | 'STOPPED' | 'DELETED'

export type AccessType = 'PUBLIC_IN_REALM' | 'AUTHENTICATED' | 'ROLE_BASED'

export type RoleMatchMode = 'ANY' | 'ALL'

export interface RealmMiniApp {
	id: string
	realmCode: string
	code: string
	name: string
	description?: string
	iconUrl?: string
	status: RealmMiniAppStatus
	entryUrl: string
	backendUrl?: string
	settings?: Record<string, unknown>
	accessType: AccessType
	roleMatchMode?: RoleMatchMode
	requiredRoles?: string[]
	launches?: number
	errors?: number
	createdAt: string
	updatedAt: string
}

export type RealmMiniAppFormValues = {
	accessType: AccessType
	backendUrl?: string
	code?: string
	description?: string
	entryUrl: string
	iconUrl?: string
	name: string
	requiredRoles?: string[]
	roleMatchMode?: RoleMatchMode
	settings?: string
}
