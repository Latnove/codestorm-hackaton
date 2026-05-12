import type { RealmMiniApp } from './types'

export const mockRealmMiniapps: RealmMiniApp[] = [
	{
		accessType: 'ROLE_BASED',
		backendUrl: 'https://bank.example.com/api/credit-calculator',
		code: 'credit-calculator',
		createdAt: '2026-05-01T09:00:00.000Z',
		description: 'Credit calculator miniapp for premium clients.',
		entryUrl: 'https://bank.example.com/miniapps/credit-calculator',
		errors: 7,
		iconUrl: 'https://placehold.co/64x64/52c41a/ffffff?text=CC',
		id: 'realm-miniapp-bank-mobile-credit-calculator',
		launches: 1280,
		name: 'Credit Calculator',
		realmCode: 'bank-mobile',
		requiredRoles: ['PREMIUM_CLIENT'],
		roleMatchMode: 'ANY',
		settings: {
			currency: 'RUB',
			maxAmount: 5000000,
		},
		status: 'PUBLISHED',
		updatedAt: '2026-05-10T11:30:00.000Z',
	},
	{
		accessType: 'AUTHENTICATED',
		code: 'card-order',
		createdAt: '2026-05-03T14:15:00.000Z',
		description: 'Card order flow embedded into host app.',
		entryUrl: 'https://bank.example.com/miniapps/card-order',
		errors: 1,
		iconUrl: 'https://placehold.co/64x64/7188d4/ffffff?text=CO',
		id: 'realm-miniapp-bank-mobile-card-order',
		launches: 642,
		name: 'Card Order',
		realmCode: 'bank-mobile',
		settings: {
			defaultProduct: 'debit-card',
		},
		status: 'DRAFT',
		updatedAt: '2026-05-09T16:40:00.000Z',
	},
	{
		accessType: 'PUBLIC_IN_REALM',
		backendUrl: 'https://telecom.example.com/api/tariffs',
		code: 'tariff-picker',
		createdAt: '2026-05-02T10:05:00.000Z',
		description: 'Helps customers compare available tariff plans.',
		entryUrl: 'https://telecom.example.com/miniapps/tariff-picker',
		errors: 12,
		iconUrl: 'https://placehold.co/64x64/38bdf8/ffffff?text=TP',
		id: 'realm-miniapp-telecom-app-tariff-picker',
		launches: 2114,
		name: 'Tariff Picker',
		realmCode: 'telecom-app',
		status: 'STOPPED',
		updatedAt: '2026-05-10T10:05:00.000Z',
	},
	{
		accessType: 'ROLE_BASED',
		code: 'vip-support',
		createdAt: '2026-05-06T12:35:00.000Z',
		description: 'Priority support entry point for VIP customers.',
		entryUrl: 'https://demo.example.com/miniapps/vip-support',
		errors: 0,
		iconUrl: 'https://placehold.co/64x64/faad14/ffffff?text=VS',
		id: 'realm-miniapp-fintech-demo-vip-support',
		launches: 96,
		name: 'VIP Support',
		realmCode: 'fintech-demo',
		requiredRoles: ['VIP'],
		roleMatchMode: 'ALL',
		status: 'PUBLISHED',
		updatedAt: '2026-05-08T12:15:00.000Z',
	},
]

export const getMockRealmMiniapp = (
	realmCode: string,
	miniAppCode: string,
) =>
	mockRealmMiniapps.find(
		miniApp =>
			miniApp.realmCode === realmCode &&
			miniApp.code === miniAppCode &&
			miniApp.status !== 'DELETED',
	)
