import { mockRealms, type Realm, type RealmStatus } from '@/entities/realm'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RealmsState {
	realms: Realm[]
	search: string
	status: RealmStatus | 'ALL'
}

interface RealmsActions {
	createRealm: (realm: Realm) => void
	updateRealm: (
		realmCode: string,
		values: Pick<Realm, 'description' | 'name'>,
	) => void
	setSearch: (search: string) => void
	setStatus: (status: RealmStatus | 'ALL') => void
	toggleStatus: (realmCode: string) => void
	deleteRealm: (realmCode: string) => void
}

type RealmsStore = RealmsState & RealmsActions

const initialState: RealmsState = {
	realms: mockRealms,
	search: '',
	status: 'ALL',
}

export const useRealmsStore = create<RealmsStore>()(
	devtools(
		set => ({
			...initialState,

			createRealm: realm => {
				set(
					state => ({
						realms: [realm, ...state.realms],
					}),
					false,
					'realms/createRealm',
				)
			},

			updateRealm: (realmCode, values) => {
				set(
					state => ({
						realms: state.realms.map(realm =>
							realm.code === realmCode
								? {
										...realm,
										description: values.description,
										metadata: {
											...realm.metadata,
											ownerTeam: values.name,
										},
										name: values.name,
										updatedAt: new Date().toISOString(),
									}
								: realm,
						),
					}),
					false,
					'realms/updateRealm',
				)
			},

			deleteRealm: realmCode => {
				set(
					state => ({
						realms: state.realms.filter(realm => realm.code !== realmCode),
					}),
					false,
					'realms/deleteRealm',
				)
			},

			setSearch: search => {
				set({ search }, false, 'realms/setSearch')
			},

			setStatus: status => {
				set({ status }, false, 'realms/setStatus')
			},

			toggleStatus: realmCode => {
				set(
					state => ({
						realms: state.realms.map(realm =>
							realm.code === realmCode
								? {
										...realm,
										status: realm.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE',
										updatedAt: new Date().toISOString(),
									}
								: realm,
						),
					}),
					false,
					'realms/toggleStatus',
				)
			},
		}),
		{ name: 'realms-store' },
	),
)

export const selectFilteredRealms = (state: RealmsStore) => {
	const normalizedSearch = state.search.trim().toLowerCase()

	return state.realms.filter(realm => {
		const matchesSearch = normalizedSearch
			? [realm.code, realm.name].some(value =>
					value.toLowerCase().includes(normalizedSearch),
				)
			: true
		const matchesStatus =
			state.status === 'ALL' ? true : realm.status === state.status

		return matchesSearch && matchesStatus
	})
}

export const useRealmsFiltersState = (state: RealmsStore) => ({
	search: state.search,
	status: state.status,
})

export const useRealmsActions = (state: RealmsStore) => ({
	createRealm: state.createRealm,
	deleteRealm: state.deleteRealm,
	setSearch: state.setSearch,
	setStatus: state.setStatus,
	toggleStatus: state.toggleStatus,
	updateRealm: state.updateRealm,
})
