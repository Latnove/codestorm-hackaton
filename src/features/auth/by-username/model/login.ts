import { Roles, type AuthPayload } from '@/entities/user'

export interface LoginPayload {
	username: string
	password: string
}

export const loginByUsername = ({
	password,
	username,
}: LoginPayload): AuthPayload => {
	const cleanUsername = username.trim()
	const normalizedUsername = cleanUsername.toLowerCase()

	return {
		accessToken: `mock_access_${password.length}_${Date.now()}`,
		user: {
			id: normalizedUsername,
			username: cleanUsername,
			role: normalizedUsername.includes('root')
				? Roles.ROOT
				: normalizedUsername.includes('readonly')
					? Roles.READONLY
					: Roles.ADMIN,
			serviceName: 'MiniApp Platform',
			createdAt: new Date().toISOString(),
		},
	}
}
