import {
	mockPlatformUsers,
	type PlatformUser,
	type PlatformUserStatus,
	type Role,
} from '@/entities/user'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UsersState {
	users: PlatformUser[]
	search: string
	status: PlatformUserStatus | 'ALL'
	globalRole: Role | 'ALL'
}

interface UsersActions {
	createUser: (user: PlatformUser) => void
	updateUserAccess: (
		userId: string,
		values: Pick<PlatformUser, 'email' | 'role' | 'status'>,
	) => void
	deleteUser: (userId: string) => void
	toggleStatus: (userId: string) => void
	setSearch: (search: string) => void
	setStatus: (status: PlatformUserStatus | 'ALL') => void
	setGlobalRole: (role: Role | 'ALL') => void
}

type UsersStore = UsersState & UsersActions

const initialState: UsersState = {
	globalRole: 'ALL',
	search: '',
	status: 'ALL',
	users: mockPlatformUsers,
}

export const useUsersStore = create<UsersStore>()(
	devtools(
		set => ({
			...initialState,

			createUser: user => {
				set(
					state => ({
						users: [user, ...state.users],
					}),
					false,
					'users/createUser',
				)
			},

			updateUserAccess: (userId, values) => {
				set(
					state => ({
						users: state.users.map(user =>
							user.id === userId
								? {
										...user,
										email: values.email,
										role: values.role,
										status: values.status,
										updatedAt: new Date().toISOString(),
									}
								: user,
						),
					}),
					false,
					'users/updateUserAccess',
				)
			},

			deleteUser: userId => {
				set(
					state => ({
						users: state.users.filter(user => user.id !== userId),
					}),
					false,
					'users/deleteUser',
				)
			},

			toggleStatus: userId => {
				set(
					state => ({
						users: state.users.map(user =>
							user.id === userId
								? {
										...user,
										status: user.status === 'active' ? 'disable' : 'active',
										updatedAt: new Date().toISOString(),
									}
								: user,
						),
					}),
					false,
					'users/toggleStatus',
				)
			},

			setSearch: search => {
				set({ search }, false, 'users/setSearch')
			},

			setStatus: status => {
				set({ status }, false, 'users/setStatus')
			},

			setGlobalRole: globalRole => {
				set({ globalRole }, false, 'users/setGlobalRole')
			},
		}),
		{ name: 'users-store' },
	),
)

export const selectFilteredUsers = (state: UsersStore) => {
	const normalizedSearch = state.search.trim().toLowerCase()

	return state.users.filter(user => {
		const matchesSearch = normalizedSearch
			? [user.username, user.email].some(value =>
					value.toLowerCase().includes(normalizedSearch),
				)
			: true
		const matchesStatus =
			state.status === 'ALL' ? true : user.status === state.status
		const matchesRole =
			state.globalRole === 'ALL' ? true : user.role === state.globalRole

		return matchesSearch && matchesStatus && matchesRole
	})
}

export const useUsersFiltersState = (state: UsersStore) => ({
	globalRole: state.globalRole,
	search: state.search,
	status: state.status,
})

export const useUsersActions = (state: UsersStore) => ({
	createUser: state.createUser,
	deleteUser: state.deleteUser,
	setGlobalRole: state.setGlobalRole,
	setSearch: state.setSearch,
	setStatus: state.setStatus,
	toggleStatus: state.toggleStatus,
	updateUserAccess: state.updateUserAccess,
})
