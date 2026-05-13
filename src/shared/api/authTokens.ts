export type AuthTokens = {
	accessToken: string
	refreshToken: string
	tokenType?: string
}

type AuthTokenListener = (tokens: AuthTokens | null) => void

const STORAGE_KEY = 'codestorm.admin.tokens'
const listeners = new Set<AuthTokenListener>()

const readStoredTokens = (): AuthTokens | null => {
	if (typeof window === 'undefined') {
		return null
	}

	const rawTokens = window.localStorage.getItem(STORAGE_KEY)

	if (!rawTokens) {
		return null
	}

	try {
		return JSON.parse(rawTokens) as AuthTokens
	} catch {
		window.localStorage.removeItem(STORAGE_KEY)
		return null
	}
}

let currentTokens = readStoredTokens()

const notifyListeners = () => {
	listeners.forEach(listener => listener(currentTokens))
}

export const getAuthTokens = () => currentTokens

export const setAuthTokens = (tokens: AuthTokens) => {
	currentTokens = tokens

	if (typeof window !== 'undefined') {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
	}

	notifyListeners()
}

export const clearAuthTokens = () => {
	currentTokens = null

	if (typeof window !== 'undefined') {
		window.localStorage.removeItem(STORAGE_KEY)
	}

	notifyListeners()
}

export const subscribeAuthTokens = (listener: AuthTokenListener) => {
	listeners.add(listener)

	return () => {
		listeners.delete(listener)
	}
}
