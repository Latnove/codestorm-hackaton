import { Roles } from './roles'
import type { PlatformUser } from './types'

export const mockPlatformUsers: PlatformUser[] = [
	{
		id: 'user-ivan-petrov',
		username: 'ivan.petrov',
		email: 'ivan.petrov@bank.example.com',
		status: 'active',
		role: Roles.ADMIN,
		realmCode: 'bank-mobile',
		createdAt: '2026-05-01T09:10:00.000Z',
		updatedAt: '2026-05-08T11:20:00.000Z',
	},
	{
		id: 'user-maria-sokolova',
		username: 'maria.sokolova',
		email: 'maria.sokolova@bank.example.com',
		status: 'active',
		role: Roles.READONLY,
		realmCode: 'bank-mobile',
		createdAt: '2026-05-02T11:20:00.000Z',
		updatedAt: '2026-05-09T14:10:00.000Z',
	},
	{
		id: 'user-anna-volkova',
		username: 'anna.volkova',
		email: 'anna.volkova@telecom.example.com',
		status: 'active',
		role: Roles.ADMIN,
		realmCode: 'telecom-app',
		createdAt: '2026-05-03T12:45:00.000Z',
		updatedAt: '2026-05-10T10:05:00.000Z',
	},
	{
		id: 'user-timur-galeev',
		username: 'timur.galeev',
		email: 'timur.galeev@bank.example.com',
		status: 'disable',
		role: Roles.ADMIN,
		realmCode: 'bank-mobile',
		createdAt: '2026-05-04T13:30:00.000Z',
		updatedAt: '2026-05-11T09:35:00.000Z',
	},
]
