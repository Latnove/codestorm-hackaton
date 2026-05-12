import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AuthBootstrap } from '../auth/AuthBootstrap'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
			retry: 1,
			staleTime: 30_000,
		},
	},
})

interface QueryProviderProps {
	children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => (
	<QueryClientProvider client={queryClient}>
		<AuthBootstrap>{children}</AuthBootstrap>
	</QueryClientProvider>
)
