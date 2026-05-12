export const ROUTES = {
	DASHBOARD: '/dashboard',
	LOGIN: '/login',
	USERS: '/users',
	USER_CREATE: '/users/create',
	USER_DETAILS: '/users/:userId',
	REALMS: '/realms',
	REALM_CREATE: '/realms/create',
	REALM_DETAILS: '/realms/:realmCode',
	REALM_MINIAPP_ACCESS: '/realms/:realmCode/miniapps/:miniAppCode/access',
	REALM_MINIAPP_CREATE: '/realms/:realmCode/miniapps/create',
	REALM_MINIAPP_DETAILS: '/realms/:realmCode/miniapps/:miniAppCode',
	REALM_MINIAPP_EDIT: '/realms/:realmCode/miniapps/:miniAppCode/edit',
	REALM_MINIAPPS: '/realms/:realmCode/miniapps',
	REALM_OVERVIEW: '/realms/:realmCode/overview',
	REALM_ROLE_CREATE: '/realms/:realmCode/roles/create',
	REALM_ROLES: '/realms/:realmCode/roles',
	REALM_ROLE_MAPPING: '/realms/:realmCode/role-mapping',
	LAUNCH: '/launch/:miniappId',
	FORBIDDEN: '/forbidden',
	NOT_FOUND: '/not-found',
} as const

export const buildLaunchRoute = (miniappId: string) => `/launch/${miniappId}`

export const buildRealmMiniappsRoute = (realmCode: string) =>
	`/realms/${realmCode}/miniapps`

export const buildRealmMiniappCreateRoute = (realmCode: string) =>
	`/realms/${realmCode}/miniapps/create`

export const buildRealmMiniappRoute = (
	realmCode: string,
	miniAppCode: string,
) => `/realms/${realmCode}/miniapps/${miniAppCode}`

export const buildRealmMiniappEditRoute = (
	realmCode: string,
	miniAppCode: string,
) => `/realms/${realmCode}/miniapps/${miniAppCode}/edit`

export const buildRealmMiniappAccessRoute = (
	realmCode: string,
	miniAppCode: string,
) => `/realms/${realmCode}/miniapps/${miniAppCode}/access`

export const buildRealmRoute = (realmCode: string) => `/realms/${realmCode}`

export const buildRealmOverviewRoute = (realmCode: string) =>
	`/realms/${realmCode}/overview`

export const buildRealmRoleCreateRoute = (realmCode: string) =>
	`/realms/${realmCode}/roles/create`

export const buildRealmRolesRoute = (realmCode: string) =>
	`/realms/${realmCode}/roles`

export const buildRealmRoleMappingRoute = (realmCode: string) =>
	`/realms/${realmCode}/role-mapping`

export const buildUserRoute = (userId: string) => `/users/${userId}`
