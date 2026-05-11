import {
	mockPlatformUsers,
	type PlatformUser,
	type PlatformUserStatus,
	type Role,
	type UserRealmRoles,
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
		values: Pick<PlatformUser, 'globalRoles' | 'status'>,
	) => void
	deleteUser: (userId: string) => void
	toggleStatus: (userId: string) => void
	assignRealmRoles: (userId: string, assignment: UserRealmRoles) => void
	removeRealmRoles: (userId: string, realmCode: string) => void
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
										globalRoles: values.globalRoles,
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
										status: user.status === 'active' ? 'blocked' : 'active',
										updatedAt: new Date().toISOString(),
									}
								: user,
						),
					}),
					false,
					'users/toggleStatus',
				)
			},

			assignRealmRoles: (userId, assignment) => {
				set(
					state => ({
						users: state.users.map(user => {
							if (user.id !== userId) {
								return user
							}

							const existingAssignments = user.realmRoles.filter(
								item => item.realmCode !== assignment.realmCode,
							)

							return {
								...user,
								realmRoles: [...existingAssignments, assignment],
								updatedAt: new Date().toISOString(),
							}
						}),
					}),
					false,
					'users/assignRealmRoles',
				)
			},

			removeRealmRoles: (userId, realmCode) => {
				set(
					state => ({
						users: state.users.map(user =>
							user.id === userId
								? {
										...user,
										realmRoles: user.realmRoles.filter(
											item => item.realmCode !== realmCode,
										),
										updatedAt: new Date().toISOString(),
									}
								: user,
						),
					}),
					false,
					'users/removeRealmRoles',
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
			state.globalRole === 'ALL'
				? true
				: user.globalRoles.includes(state.globalRole)

		return matchesSearch && matchesStatus && matchesRole
	})
}

export const useUsersFiltersState = (state: UsersStore) => ({
	globalRole: state.globalRole,
	search: state.search,
	status: state.status,
})

export const useUsersActions = (state: UsersStore) => ({
	assignRealmRoles: state.assignRealmRoles,
	createUser: state.createUser,
	deleteUser: state.deleteUser,
	removeRealmRoles: state.removeRealmRoles,
	setGlobalRole: state.setGlobalRole,
	setSearch: state.setSearch,
	setStatus: state.setStatus,
	toggleStatus: state.toggleStatus,
	updateUserAccess: state.updateUserAccess,
})
