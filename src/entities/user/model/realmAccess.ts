import { Roles } from './roles'
import type { User } from './types'

const realmScopedRoles = new Set([
	Roles.ACCESS_MANAGER,
	Roles.ADMIN,
	Roles.MINIAPP_MANAGER,
	Roles.READONLY,
	Roles.REALM_ADMIN,
	Roles.VIEWER,
])

export const canAccessRealm = (user: User | null, realmCode: string) => {
	if (!user) {
		return false
	}

	if (user.role === Roles.ROOT) {
		return true
	}

	return realmScopedRoles.has(user.role) && user.realmCode === realmCode
}
