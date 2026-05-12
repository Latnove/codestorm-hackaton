import type {
	AccessType,
	RealmMiniApp,
	RealmMiniAppStatus,
	RoleMatchMode,
} from './types'

export const realmMiniAppStatusLabels: Record<RealmMiniAppStatus, string> = {
	DELETED: 'Удалён',
	DRAFT: 'Черновик',
	PUBLISHED: 'Опубликован',
	STOPPED: 'Остановлен',
}

export const realmMiniAppStatusColors: Record<RealmMiniAppStatus, string> = {
	DELETED: '#ff4d4f',
	DRAFT: '#64748b',
	PUBLISHED: '#16a34a',
	STOPPED: '#ea580c',
}

export const accessTypeLabels: Record<AccessType, string> = {
	AUTHENTICATED: 'Авторизованные',
	PUBLIC_IN_REALM: 'Публичный в Realm',
	ROLE_BASED: 'По Realm Roles',
}

export const accessTypeDescriptions: Record<AccessType, string> = {
	AUTHENTICATED:
		'MiniApp доступен любому пользователю host-приложения, если передан externalUserId.',
	PUBLIC_IN_REALM:
		'MiniApp доступен любому пользователю, пришедшему из host-app в контексте данного Realm.',
	ROLE_BASED:
		'MiniApp проверяет только realmRoles, которые получаются через Role Mapping.',
}

export const roleMatchModeLabels: Record<RoleMatchMode, string> = {
	ALL: 'ALL',
	ANY: 'ANY',
}

export const roleMatchModeDescriptions: Record<RoleMatchMode, string> = {
	ALL: 'Пользователь должен иметь все роли из списка.',
	ANY: 'Достаточно одной роли из списка.',
}

export const getRealmMiniAppPublishError = (miniApp: RealmMiniApp) => {
	if (!miniApp.entryUrl) {
		return 'Перед публикацией заполните entryUrl.'
	}

	if (!miniApp.accessType) {
		return 'Перед публикацией выберите тип доступа.'
	}

	if (
		miniApp.accessType === 'ROLE_BASED' &&
		(!miniApp.requiredRoles || miniApp.requiredRoles.length === 0)
	) {
		return 'Для ROLE_BASED выберите хотя бы одну Realm Role.'
	}

	return null
}
