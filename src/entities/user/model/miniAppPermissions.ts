import { canAccessRealm } from './realmAccess'
import { Roles } from './roles'
import type { User } from './types'

export type RealmMiniAppPermissions = {
	canCreate: boolean
	canDelete: boolean
	canEditAccess: boolean
	canEditMiniApp: boolean
	canPublish: boolean
	canStop: boolean
	canView: boolean
}

export const getRealmMiniAppPermissions = (
	user: User | null,
	realmCode: string,
): RealmMiniAppPermissions => {
	const canOpenRealm = canAccessRealm(user, realmCode)

	if (!user || !canOpenRealm) {
		return {
			canCreate: false,
			canDelete: false,
			canEditAccess: false,
			canEditMiniApp: false,
			canPublish: false,
			canStop: false,
			canView: false,
		}
	}

	const hasFullRealmAccess =
		user.role === Roles.ROOT ||
		user.role === Roles.ADMIN ||
		user.role === Roles.REALM_ADMIN
	const isAccessManager = user.role === Roles.ACCESS_MANAGER
	const isMiniAppManager = user.role === Roles.MINIAPP_MANAGER

	return {
		canCreate: hasFullRealmAccess || isMiniAppManager,
		canDelete: hasFullRealmAccess || isMiniAppManager,
		canEditAccess: hasFullRealmAccess || isAccessManager,
		canEditMiniApp: hasFullRealmAccess || isMiniAppManager,
		canPublish: hasFullRealmAccess || isMiniAppManager,
		canStop: hasFullRealmAccess || isMiniAppManager,
		canView: true,
	}
}
