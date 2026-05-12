import type { Role } from './roles'

export type User = {
	id: string
	username: string
	role: Role
	realmCode?: string
	serviceName: string
	createdAt: string
}

export type AuthPayload = {
	user: User
	accessToken: string
}

export type PlatformUserStatus = 'active' | 'disable'

export type PlatformUser = {
	id: string
	username: string
	email: string
	status: PlatformUserStatus
	role: Role
	realmCode: string
	createdAt: string
	updatedAt: string
}
