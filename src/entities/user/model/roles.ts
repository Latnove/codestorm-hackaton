export const Roles = {
	ADMIN: 'admin',
	READONLY: 'readonly',
	ROOT: 'root',
} as const

export const roleLabels = {
	[Roles.ADMIN]: 'Admin',
	[Roles.READONLY]: 'Readonly',
	[Roles.ROOT]: 'Root',
} as const

export type Role = (typeof Roles)[keyof typeof Roles]
