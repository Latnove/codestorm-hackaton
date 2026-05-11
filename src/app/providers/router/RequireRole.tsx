import { type Role, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface RequireRoleProps {
	children: ReactNode
	roles?: Role[]
}

export const RequireRole = ({ children, roles }: RequireRoleProps) => {
	const location = useLocation()
	const accessToken = useUserStore((state) => state.accessToken)
	const user = useUserStore((state) => state.user)

	if (!user || !accessToken) {
		return <Navigate replace state={{ from: location }} to={ROUTES.LOGIN} />
	}

	if (roles && !roles.includes(user.role)) {
		return <Navigate replace to={ROUTES.FORBIDDEN} />
	}

	return children
}
