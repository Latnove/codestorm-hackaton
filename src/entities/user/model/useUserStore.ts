import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Roles } from './roles'
import type { AuthPayload, User } from './types'

interface IUserState {
	user: User | null
	accessToken: string | null
}

interface IUserActions {
	setAuth: (payload: AuthPayload) => void
	setUser: (user: User | null) => void
	setAccessToken: (accessToken: string | null) => void
	logout: () => void
}

type UserStore = IUserState & IUserActions

const initialState: IUserState = {
	user: {
		id: 'string',
		username: 'string',
		role: Roles.ADMIN,
		realmCode: 'bank-mobile',
		serviceName: 'sfsdfsdf',
		createdAt: 'sddsfsdf',
	},
	accessToken: 'sdfsdfdsf',
}

export const useUserStore = create<UserStore>()(
	devtools(
		set => ({
			...initialState,

			setAuth: ({ accessToken, user }) => {
				set({ accessToken, user }, false, 'user/setAuth')
			},

			setUser: user => {
				set({ user }, false, 'user/setUser')
			},

			setAccessToken: accessToken => {
				set({ accessToken }, false, 'user/setAccessToken')
			},

			logout: () => {
				set(initialState, false, 'user/logout')
			},
		}),
		{
			name: 'user-store',
		},
	),
)

export const useUserState = (state: UserStore) => ({
	accessToken: state.accessToken,
	user: state.user,
})

export const useUserActions = (state: UserStore) => ({
	logout: state.logout,
	setAccessToken: state.setAccessToken,
	setAuth: state.setAuth,
	setUser: state.setUser,
})
