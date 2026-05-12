import {
	Roles,
	logoutAdmin,
	useUserActions,
	useUserState,
	useUserStore,
} from '@/entities/user'
import {
	ROUTES,
	buildRealmMiniappCreateRoute,
	buildRealmMiniappsRoute,
	buildRealmOverviewRoute,
	buildRealmRoleMappingRoute,
	buildRealmRolesRoute,
} from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Logo } from '@/shared/ui/Logo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Layout } from 'antd'
import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './AppHeader.module.css'

const { Header } = Layout

type AdminNavItem = { label: string; route: string }

const navItems: AdminNavItem[] = [{ label: 'Дашборд', route: ROUTES.DASHBOARD }]

const rootNavItems: AdminNavItem[] = [
	{ label: 'Дашборд', route: ROUTES.DASHBOARD },
	{ label: 'Users', route: ROUTES.USERS },
	{ label: 'Realms', route: ROUTES.REALMS },
	{ label: 'Создать Realm', route: ROUTES.REALM_CREATE },
	{ label: 'Создать User', route: ROUTES.USER_CREATE },
]

export const AppHeader = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { refreshToken, user } = useUserStore(useShallow(useUserState))
	const { logout } = useUserStore(useShallow(useUserActions))
	const logoutMutation = useMutation({
		mutationFn: async () => {
			if (refreshToken) {
				await logoutAdmin(refreshToken)
			}
		},
		onSettled: () => {
			logout()
			queryClient.clear()
			navigate(ROUTES.LOGIN)
		},
	})
	const isRoot = user?.role === Roles.ROOT
	const userRealmCode = !isRoot ? user?.realmCode : undefined
	const adminNavItems = userRealmCode
		? [
				navItems[0],
				{
					label: 'Управление ролями',
					route: buildRealmRolesRoute(userRealmCode),
				},
				{
					label: 'Mapping ролей',
					route: buildRealmRoleMappingRoute(userRealmCode),
				},
				{
					label: 'Mini-Apps',
					route: buildRealmMiniappsRoute(userRealmCode),
				},
				{
					label: 'Создать Mini-Apps',
					route: buildRealmMiniappCreateRoute(userRealmCode),
				},
			]
		: navItems
	const adminRealmCode = userRealmCode

	const isRouteActive = (route: string) => {
		const realmMiniappsRoute = userRealmCode
			? buildRealmMiniappsRoute(userRealmCode)
			: undefined
		const realmMiniappCreateRoute = userRealmCode
			? buildRealmMiniappCreateRoute(userRealmCode)
			: undefined

		if (route === ROUTES.DASHBOARD) {
			return location.pathname === route
		}

		if (route === ROUTES.REALMS) {
			if (user?.role === Roles.ADMIN) {
				return location.pathname === ROUTES.REALMS
			}

			return (
				location.pathname === ROUTES.REALMS ||
				(location.pathname.startsWith('/realms/') &&
					location.pathname !== ROUTES.REALM_CREATE)
			)
		}

		if (route === ROUTES.USERS) {
			return (
				location.pathname === ROUTES.USERS ||
				(location.pathname.startsWith('/users/') &&
					location.pathname !== ROUTES.USER_CREATE)
			)
		}

		if (realmMiniappsRoute && route === realmMiniappsRoute) {
			return (
				location.pathname === realmMiniappsRoute ||
				(location.pathname.startsWith(`${realmMiniappsRoute}/`) &&
					location.pathname !== realmMiniappCreateRoute)
			)
		}

		if (realmMiniappCreateRoute && route === realmMiniappCreateRoute) {
			return location.pathname === realmMiniappCreateRoute
		}

		return location.pathname.startsWith(route)
	}

	const navigateHome = () => {
		navigate(user?.role === Roles.ROOT ? ROUTES.REALMS : ROUTES.DASHBOARD)
	}

	const handleLogout = () => {
		logoutMutation.mutate()
	}

	return (
		<Header className={styles.header}>
			<div className={clsx('container', styles.inner)}>
				<Logo onClick={navigateHome} />

				{isRoot ? (
					<nav className={styles.nav}>
						{rootNavItems.map(item => (
							<ButtonField
								key={item.route}
								onClick={() => navigate(item.route)}
								type={isRouteActive(item.route) ? 'primary' : 'text'}
							>
								{item.label}
							</ButtonField>
						))}

						<ButtonField
							className={styles.logoutButton}
							onClick={handleLogout}
							type='default'
						>
							Выйти
						</ButtonField>
					</nav>
				) : user ? (
					<nav className={styles.nav}>
						{adminNavItems.map(item => (
							<ButtonField
								key={item.label}
								onClick={() => navigate(item.route)}
								type={
									'route' in item && isRouteActive(item.route)
										? 'primary'
										: 'text'
								}
							>
								{item.label}
							</ButtonField>
						))}

						{adminRealmCode && (
							<ButtonField
								className={styles.profileButton}
								onClick={() =>
									navigate(buildRealmOverviewRoute(adminRealmCode))
								}
								type='default'
							>
								Мой Realm
							</ButtonField>
						)}

						<ButtonField
							className={styles.logoutButton}
							loading={logoutMutation.isPending}
							onClick={handleLogout}
							type='default'
						>
							Выйти
						</ButtonField>
					</nav>
				) : (
					<ButtonField onClick={() => navigate(ROUTES.LOGIN)} type='primary'>
						Login
					</ButtonField>
				)}
			</div>
		</Header>
	)
}
