import { Roles, type AuthPayload } from '@/entities/user'

export interface LoginPayload {
	username: string
	password: string
}

const resolveAdminRealmCode = (username: string) => {
	if (username.includes('telecom')) {
		return 'telecom-app'
	}

	if (username.includes('fintech')) {
		return 'fintech-demo'
	}

	return 'bank-mobile'
}

const resolveRole = (username: string) => {
	if (username.includes('root')) {
		return Roles.ROOT
	}

	if (username.includes('realm-admin')) {
		return Roles.REALM_ADMIN
	}

	if (username.includes('access')) {
		return Roles.ACCESS_MANAGER
	}

	if (username.includes('miniapp')) {
		return Roles.MINIAPP_MANAGER
	}

	if (username.includes('viewer')) {
		return Roles.VIEWER
	}

	if (username.includes('readonly')) {
		return Roles.READONLY
	}

	return Roles.ADMIN
}

export const loginByUsername = ({
	password,
	username,
}: LoginPayload): AuthPayload => {
	const cleanUsername = username.trim()
	const normalizedUsername = cleanUsername.toLowerCase()
	const role = resolveRole(normalizedUsername)

	return {
		accessToken: `mock_access_${password.length}_${Date.now()}`,
		user: {
			id: normalizedUsername,
			username: cleanUsername,
			realmCode:
				role !== Roles.ROOT
					? resolveAdminRealmCode(normalizedUsername)
					: undefined,
			role,
			serviceName: 'MiniApp Platform',
			createdAt: new Date().toISOString(),
		},
	}
}
