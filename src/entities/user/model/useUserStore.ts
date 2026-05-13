import {
	clearAuthTokens,
	getAuthTokens,
	setAuthTokens,
	subscribeAuthTokens,
} from '@/shared/api'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AuthPayload, User } from './types'

interface IUserState {
	user: User | null
	accessToken: string | null
	refreshToken: string | null
	tokenType: string
}

interface IUserActions {
	setAuth: (payload: AuthPayload) => void
	setUser: (user: User | null) => void
	setAccessToken: (accessToken: string | null) => void
	setRefreshToken: (refreshToken: string | null) => void
	logout: () => void
}

type UserStore = IUserState & IUserActions

const USER_ID_STORAGE_KEY = 'codestorm.admin.userId'

export const getStoredAuthUserId = () => {
	if (typeof window === 'undefined') {
		return null
	}

	return window.localStorage.getItem(USER_ID_STORAGE_KEY)
}

const writeStoredAuthUserId = (userId: string | null) => {
	if (typeof window === 'undefined') {
		return
	}

	if (!userId) {
		window.localStorage.removeItem(USER_ID_STORAGE_KEY)
		return
	}

	window.localStorage.setItem(USER_ID_STORAGE_KEY, userId)
}

const storedTokens = getAuthTokens()

const initialState: IUserState = {
	accessToken: storedTokens?.accessToken ?? null,
	refreshToken: storedTokens?.refreshToken ?? null,
	tokenType: storedTokens?.tokenType ?? 'Bearer',
	user: null,
}

export const useUserStore = create<UserStore>()(
	devtools(
		set => ({
			...initialState,

			setAuth: payload => {
				setAuthTokens({
					accessToken: payload.accessToken,
					refreshToken: payload.refreshToken,
					tokenType: payload.tokenType,
				})

				set(
					{
						accessToken: payload.accessToken,
						refreshToken: payload.refreshToken,
						tokenType: payload.tokenType ?? 'Bearer',
						user: payload.user,
					},
					false,
					'user/setAuth',
				)
				writeStoredAuthUserId(payload.user.id)
			},

			setUser: user => {
				set({ user }, false, 'user/setUser')
				writeStoredAuthUserId(user?.id ?? null)
			},

			setAccessToken: accessToken => {
				set({ accessToken }, false, 'user/setAccessToken')
			},

			setRefreshToken: refreshToken => {
				set({ refreshToken }, false, 'user/setRefreshToken')
			},

			logout: () => {
				clearAuthTokens()
				writeStoredAuthUserId(null)
				set(
					{
						accessToken: null,
						refreshToken: null,
						tokenType: 'Bearer',
						user: null,
					},
					false,
					'user/logout',
				)
			},
		}),
		{
			name: 'user-store',
		},
	),
)

export const useUserState = (state: UserStore) => ({
	accessToken: state.accessToken,
	refreshToken: state.refreshToken,
	tokenType: state.tokenType,
	user: state.user,
})

export const useUserActions = (state: UserStore) => ({
	logout: state.logout,
	setAccessToken: state.setAccessToken,
	setAuth: state.setAuth,
	setRefreshToken: state.setRefreshToken,
	setUser: state.setUser,
})

subscribeAuthTokens(tokens => {
	const state = useUserStore.getState()

	if (!tokens) {
		if (state.accessToken || state.refreshToken) {
			writeStoredAuthUserId(null)
			useUserStore.setState(
				{
					accessToken: null,
					refreshToken: null,
					user: null,
				},
				false,
				'user/tokenCleared',
			)
		}

		return
	}

	useUserStore.setState(
		{
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			tokenType: tokens.tokenType ?? 'Bearer',
		},
		false,
		'user/tokenRefreshed',
	)
})
