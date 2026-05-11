export const ROUTES = {
	DASHBOARD: '/',
	LOGIN: '/login',
	USERS: '/users',
	USER_CREATE: '/users/create',
	USER_DETAILS: '/users/:userId',
	REALMS: '/realms',
	REALM_CREATE: '/realms/create',
	REALM_DETAILS: '/realms/:realmCode',
	REALM_OVERVIEW: '/realms/:realmCode/overview',
	MINIAPPS: '/miniapps',
	MINIAPP_CREATE: '/miniapps/create',
	MINIAPP_EDIT: '/miniapps/:miniappId/edit',
	LAUNCH: '/launch/:miniappId',
	ANALYTICS: '/analytics',
	AUDIT_LOGS: '/audit-logs',
	SETTINGS: '/settings',
	FORBIDDEN: '/forbidden',
	NOT_FOUND: '/not-found',
} as const

export const buildMiniappEditRoute = (miniappId: string) =>
	`/miniapps/${miniappId}/edit`

export const buildLaunchRoute = (miniappId: string) => `/launch/${miniappId}`

export const buildRealmRoute = (realmCode: string) => `/realms/${realmCode}`

export const buildRealmOverviewRoute = (realmCode: string) =>
	`/realms/${realmCode}/overview`

export const buildUserRoute = (userId: string) => `/users/${userId}`
