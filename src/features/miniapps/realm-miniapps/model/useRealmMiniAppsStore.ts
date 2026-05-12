import {
	mockRealmMiniapps,
	type RealmMiniApp,
	type RealmMiniAppFormValues,
} from '@/entities/miniapp'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type RealmMiniAppUpdateValues = Omit<RealmMiniAppFormValues, 'code'>

interface RealmMiniAppsState {
	miniApps: RealmMiniApp[]
}

interface RealmMiniAppsActions {
	createRealmMiniApp: (
		realmCode: string,
		values: RealmMiniAppFormValues,
	) => RealmMiniApp
	deleteRealmMiniApp: (realmCode: string, miniAppCode: string) => void
	publishRealmMiniApp: (realmCode: string, miniAppCode: string) => void
	stopRealmMiniApp: (realmCode: string, miniAppCode: string) => void
	updateRealmMiniApp: (
		realmCode: string,
		miniAppCode: string,
		values: RealmMiniAppUpdateValues,
	) => void
}

type RealmMiniAppsStore = RealmMiniAppsState & RealmMiniAppsActions

const initialState: RealmMiniAppsState = {
	miniApps: mockRealmMiniapps,
}

const buildRealmMiniAppId = (realmCode: string, code: string) =>
	`realm-miniapp-${realmCode}-${code}`

const normalizeOptional = (value?: string) => {
	const cleanValue = value?.trim()

	return cleanValue || undefined
}

const parseSettings = (settings?: string) => {
	if (!settings?.trim()) {
		return undefined
	}

	return JSON.parse(settings) as Record<string, unknown>
}

const buildAccessValues = (
	values: Pick<
		RealmMiniAppFormValues,
		'accessType' | 'requiredRoles' | 'roleMatchMode'
	>,
) => {
	if (values.accessType !== 'ROLE_BASED') {
		return {
			accessType: values.accessType,
			requiredRoles: undefined,
			roleMatchMode: undefined,
		}
	}

	return {
		accessType: values.accessType,
		requiredRoles: values.requiredRoles ?? [],
		roleMatchMode: values.roleMatchMode,
	}
}

export const useRealmMiniAppsStore = create<RealmMiniAppsStore>()(
	devtools(
		set => ({
			...initialState,

			createRealmMiniApp: (realmCode, values) => {
				const now = new Date().toISOString()
				const code = values.code?.trim() ?? ''
				const miniApp: RealmMiniApp = {
					...buildAccessValues(values),
					backendUrl: normalizeOptional(values.backendUrl),
					code,
					createdAt: now,
					description: normalizeOptional(values.description),
					entryUrl: values.entryUrl.trim(),
					errors: 0,
					iconUrl: normalizeOptional(values.iconUrl),
					id: buildRealmMiniAppId(realmCode, code),
					launches: 0,
					name: values.name.trim(),
					realmCode,
					settings: parseSettings(values.settings),
					status: 'DRAFT',
					updatedAt: now,
				}

				set(
					state => ({
						miniApps: [miniApp, ...state.miniApps],
					}),
					false,
					'realm-miniapps/createRealmMiniApp',
				)

				return miniApp
			},

			deleteRealmMiniApp: (realmCode, miniAppCode) => {
				set(
					state => ({
						miniApps: state.miniApps.map(miniApp =>
							miniApp.realmCode === realmCode && miniApp.code === miniAppCode
								? {
										...miniApp,
										status: 'DELETED',
										updatedAt: new Date().toISOString(),
									}
								: miniApp,
						),
					}),
					false,
					'realm-miniapps/deleteRealmMiniApp',
				)
			},

			publishRealmMiniApp: (realmCode, miniAppCode) => {
				set(
					state => ({
						miniApps: state.miniApps.map(miniApp =>
							miniApp.realmCode === realmCode && miniApp.code === miniAppCode
								? {
										...miniApp,
										status: 'PUBLISHED',
										updatedAt: new Date().toISOString(),
									}
								: miniApp,
						),
					}),
					false,
					'realm-miniapps/publishRealmMiniApp',
				)
			},

			stopRealmMiniApp: (realmCode, miniAppCode) => {
				set(
					state => ({
						miniApps: state.miniApps.map(miniApp =>
							miniApp.realmCode === realmCode && miniApp.code === miniAppCode
								? {
										...miniApp,
										status: 'STOPPED',
										updatedAt: new Date().toISOString(),
									}
								: miniApp,
						),
					}),
					false,
					'realm-miniapps/stopRealmMiniApp',
				)
			},

			updateRealmMiniApp: (realmCode, miniAppCode, values) => {
				set(
					state => ({
						miniApps: state.miniApps.map(miniApp =>
							miniApp.realmCode === realmCode && miniApp.code === miniAppCode
								? {
										...miniApp,
										...buildAccessValues(values),
										backendUrl: normalizeOptional(values.backendUrl),
										description: normalizeOptional(values.description),
										entryUrl: values.entryUrl.trim(),
										iconUrl: normalizeOptional(values.iconUrl),
										name: values.name.trim(),
										settings: parseSettings(values.settings),
										updatedAt: new Date().toISOString(),
									}
								: miniApp,
						),
					}),
					false,
					'realm-miniapps/updateRealmMiniApp',
				)
			},
		}),
		{ name: 'realm-miniapps-store' },
	),
)

export const selectVisibleRealmMiniApps =
	(realmCode: string) => (state: RealmMiniAppsStore) =>
		state.miniApps.filter(
			miniApp =>
				miniApp.realmCode === realmCode && miniApp.status !== 'DELETED',
		)

export const selectRealmMiniApp =
	(realmCode: string, miniAppCode: string) =>
	(state: RealmMiniAppsStore) =>
		state.miniApps.find(
			miniApp =>
				miniApp.realmCode === realmCode &&
				miniApp.code === miniAppCode &&
				miniApp.status !== 'DELETED',
		)

export const useRealmMiniAppsActions = (state: RealmMiniAppsStore) => ({
	createRealmMiniApp: state.createRealmMiniApp,
	deleteRealmMiniApp: state.deleteRealmMiniApp,
	publishRealmMiniApp: state.publishRealmMiniApp,
	stopRealmMiniApp: state.stopRealmMiniApp,
	updateRealmMiniApp: state.updateRealmMiniApp,
})
