import type { RealmRole } from './types'

type BaseRealmRole = Pick<
	RealmRole,
	'code' | 'description' | 'name' | 'usedInPoliciesCount'
>

const baseRoles: BaseRealmRole[] = [
	{
		code: 'USER',
		description: 'Базовая внутренняя роль авторизованного пользователя',
		name: 'Пользователь',
		usedInPoliciesCount: 3,
	},
	{
		code: 'PREMIUM_CLIENT',
		description: 'Клиент с премиальным статусом после mapping',
		name: 'Премиальный клиент',
		usedInPoliciesCount: 2,
	},
	{
		code: 'VIP',
		description: 'Клиент с VIP-обслуживанием после mapping',
		name: 'VIP клиент',
		usedInPoliciesCount: 1,
	},
	{
		code: 'EMPLOYEE',
		description: 'Сотрудник host-приложения после mapping',
		name: 'Сотрудник',
		usedInPoliciesCount: 0,
	},
]

const realmSeeds = [
	{
		createdAt: '2026-05-01T09:30:00.000Z',
		realmCode: 'bank-mobile',
		updatedAt: '2026-05-11T09:00:00.000Z',
	},
	{
		createdAt: '2026-05-02T10:05:00.000Z',
		realmCode: 'telecom-app',
		updatedAt: '2026-05-10T10:05:00.000Z',
	},
	{
		createdAt: '2026-05-06T12:35:00.000Z',
		realmCode: 'fintech-demo',
		updatedAt: '2026-05-08T12:15:00.000Z',
	},
]

export const mockRealmRoles: RealmRole[] = realmSeeds.flatMap(realm =>
	baseRoles.map(role => ({
		...role,
		id: `realm-role-${realm.realmCode}-${role.code.toLowerCase()}`,
		createdAt: realm.createdAt,
		realmCode: realm.realmCode,
		updatedAt: realm.updatedAt,
	})),
)
