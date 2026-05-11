import type { CreateRealmFormValues, Realm } from '@/entities/realm'

export const buildRealm = (values: CreateRealmFormValues): Realm => {
	const now = new Date().toISOString()

	return {
		activeSessionsCount: 0,
		clientsCount: 1,
		code: values.code,
		createdAt: now,
		description: values.description,
		id: `realm-${values.code}`,
		metadata: {
			allowedOrigins: [],
			authMode: 'SSO',
			clientId: `${values.code}-backend`,
			environment: 'demo',
			ownerTeam: values.name,
			region: 'ru-central-1',
			scopes: ['miniapp:catalog', 'miniapp:launch', 'session:logout'],
		},
		miniappsCount: 0,
		name: values.name,
		publishedMiniappsCount: 0,
		status: 'ACTIVE',
		updatedAt: now,
	}
}
