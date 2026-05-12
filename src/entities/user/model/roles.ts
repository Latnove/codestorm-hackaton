export const Roles = {
	ACCESS_MANAGER: 'access_manager',
	ADMIN: 'admin',
	MINIAPP_MANAGER: 'miniapp_manager',
	READONLY: 'readonly',
	REALM_ADMIN: 'realm_admin',
	ROOT: 'root',
	VIEWER: 'viewer',
} as const

export const roleLabels = {
	[Roles.ACCESS_MANAGER]: 'Access Manager',
	[Roles.ADMIN]: 'Admin',
	[Roles.MINIAPP_MANAGER]: 'MiniApp Manager',
	[Roles.READONLY]: 'Readonly',
	[Roles.REALM_ADMIN]: 'Realm Admin',
	[Roles.ROOT]: 'Root',
	[Roles.VIEWER]: 'Viewer',
} as const

export type Role = (typeof Roles)[keyof typeof Roles]
