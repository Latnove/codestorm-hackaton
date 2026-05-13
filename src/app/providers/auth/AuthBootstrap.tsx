import {
	getPlatformUser,
	getStoredAuthUserId,
	mapPlatformUserToAuthUser,
	useUserActions,
	useUserState,
	useUserStore,
	userKeys,
} from '@/entities/user'
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

interface AuthBootstrapProps {
	children: ReactNode
}

export const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
	const { accessToken, user } = useUserStore(useShallow(useUserState))
	const { logout, setUser } = useUserStore(useShallow(useUserActions))
	const storedUserId = getStoredAuthUserId()
	const shouldLoadUser = Boolean(accessToken && !user && storedUserId)
	const { data, isError, isLoading } = useQuery({
		enabled: shouldLoadUser,
		queryFn: () => getPlatformUser(storedUserId ?? ''),
		queryKey: userKeys.detail(storedUserId ?? ''),
		retry: false,
	})

	useEffect(() => {
		if (data) {
			setUser(mapPlatformUserToAuthUser(data))
		}
	}, [data, setUser])

	useEffect(() => {
		if (isError) {
			logout()
		}
	}, [isError, logout])

	if (shouldLoadUser && isLoading) {
		return null
	}

	return children
}
