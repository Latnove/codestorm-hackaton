import type { PlatformUserStatus } from './types'

export const platformUserStatusLabels: Record<PlatformUserStatus, string> = {
	active: 'Активен',
	disable: 'Отключён',
}

export const platformUserStatusColors: Record<PlatformUserStatus, string> = {
	active: '#16a34a',
	disable: '#ea580c',
}
