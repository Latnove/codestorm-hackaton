import axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from 'axios'

import {
	clearAuthTokens,
	getAuthTokens,
	setAuthTokens,
	type AuthTokens,
} from './authTokens'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
	_isRetry?: boolean
}

type TokenResponse = {
	accessToken: string
	refreshToken: string
	expiresIn: number
	tokenType: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const AUTH_CHANGED_EVENT = 'codestorm:auth-changed'

const rawClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

const buildAuthorizationHeader = (tokens: AuthTokens) =>
	`${tokens.tokenType ?? 'Bearer'} ${tokens.accessToken}`

const isAuthEndpoint = (url?: string) =>
	url?.includes('/api/admin/auth/login') ||
	url?.includes('/api/admin/auth/refresh')

let refreshRequest: Promise<AuthTokens> | null = null

const refreshAdminToken = async (refreshToken: string): Promise<AuthTokens> => {
	const { data } = await rawClient.post<TokenResponse>(
		'/api/admin/auth/refresh',
		{ refreshToken },
	)

	return {
		accessToken: data.accessToken,
		refreshToken: data.refreshToken,
		tokenType: data.tokenType,
	}
}

const emitAuthChanged = () => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
	}
}

apiClient.interceptors.request.use(config => {
	const tokens = getAuthTokens()

	if (tokens?.accessToken && !isAuthEndpoint(config.url)) {
		config.headers.Authorization = buildAuthorizationHeader(tokens)
	}

	return config
})

apiClient.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetriableRequestConfig | undefined
		const status = error.response?.status
		const tokens = getAuthTokens()

		if (
			status !== 401 ||
			!originalRequest ||
			originalRequest._isRetry ||
			isAuthEndpoint(originalRequest.url) ||
			!tokens?.refreshToken
		) {
			return Promise.reject(error)
		}

		originalRequest._isRetry = true

		try {
			refreshRequest ??= refreshAdminToken(tokens.refreshToken).finally(() => {
				refreshRequest = null
			})

			const refreshedTokens = await refreshRequest
			setAuthTokens(refreshedTokens)

			originalRequest.headers.Authorization =
				buildAuthorizationHeader(refreshedTokens)

			return apiClient(originalRequest)
		} catch (refreshError) {
			clearAuthTokens()
			emitAuthChanged()

			return Promise.reject(refreshError)
		}
	},
)

export const unwrapData = async <T>(request: Promise<{ data: T }>) => {
	const { data } = await request

	return data
}

export const buildQueryParams = <TParams extends Record<string, unknown>>(
	params?: TParams,
) => {
	const cleanParams: Record<string, unknown> = {}

	Object.entries(params ?? {}).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			cleanParams[key] = value
		}
	})

	return cleanParams
}

export type ApiRequestConfig = AxiosRequestConfig
export { AUTH_CHANGED_EVENT }
