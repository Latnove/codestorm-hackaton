export type RealmStatus = 'ACTIVE' | 'DISABLED'

export type RealmMetadata = {
	ownerTeam: string
	environment: 'production' | 'stage' | 'demo'
	region: string
	authMode: 'SSO'
	allowedOrigins: string[]
	clientId: string
	scopes: string[]
}

export type Realm = {
	id: string
	code: string
	name: string
	description?: string
	status: RealmStatus
	miniappsCount: number
	publishedMiniappsCount: number
	clientsCount: number
	activeSessionsCount: number
	createdAt: string
	updatedAt: string
	metadata: RealmMetadata
}

export type RealmRole = {
	id: string
	realmCode: string
	code: string
	name: string
	description?: string
	usedInPoliciesCount: number
	createdAt: string
	updatedAt: string
}

export type ExternalRoleMapping = {
	id: string
	realmCode: string
	externalRole: string
	realmRoleCode: string
	createdAt: string
	updatedAt: string
}
