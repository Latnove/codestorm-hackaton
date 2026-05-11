import type { Role } from './roles'

export type User = {
	id: string
	username: string
	role: Role
	serviceName: string
	createdAt: string
}

export type AuthPayload = {
	user: User
	accessToken: string
}

export type PlatformUserStatus = 'active' | 'blocked'

export type UserRealmRoles = {
	realmCode: string
	roles: Role[]
}

export type PlatformUser = {
	id: string
	username: string
	email: string
	status: PlatformUserStatus
	globalRoles: Role[]
	realmRoles: UserRealmRoles[]
	createdAt: string
	updatedAt: string
}
