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
