import type { RealmStatus } from './types'

export const realmStatusLabels: Record<RealmStatus, string> = {
	ACTIVE: 'Активный',
	DISABLED: 'Отключённый',
}

export const realmStatusColors: Record<RealmStatus, string> = {
	ACTIVE: '#16a34a',
	DISABLED: '#ea580c',
}
