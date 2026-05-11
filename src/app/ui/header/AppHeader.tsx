import {
	Roles,
	useUserActions,
	useUserState,
	useUserStore,
} from '@/entities/user'
import { EXTERNAL_LINKS, ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Logo } from '@/shared/ui/Logo'
import { Layout } from 'antd'
import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './AppHeader.module.css'

const { Header } = Layout

type AdminNavItem =
	| { label: string; route: string }
	| { externalUrl: string; label: string }

const navItems: AdminNavItem[] = [
	{ label: 'Дашборд', route: ROUTES.DASHBOARD },
	{ label: 'Mini-Apps', route: ROUTES.MINIAPPS },
	{ externalUrl: EXTERNAL_LINKS.GRAFANA_ANALYTICS, label: 'Аналитика' },
	{ externalUrl: EXTERNAL_LINKS.GRAFANA_LOGS, label: 'Логи' },
]

const rootNavItems = [
	{ label: 'Users', route: ROUTES.USERS },
	{ label: 'Realms', route: ROUTES.REALMS },
	{ label: 'Создать Realm', route: ROUTES.REALM_CREATE },
]

export const AppHeader = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { user } = useUserStore(useShallow(useUserState))
	const { logout } = useUserStore(useShallow(useUserActions))

	const isRouteActive = (route: string) => {
		if (route === ROUTES.DASHBOARD) {
			return location.pathname === route
		}

		if (route === ROUTES.REALMS) {
			return (
				location.pathname === ROUTES.REALMS ||
				(location.pathname.startsWith('/realms/') &&
					location.pathname !== ROUTES.REALM_CREATE)
			)
		}

		return location.pathname.startsWith(route)
	}

	const navigateHome = () => {
		navigate(user?.role === Roles.ROOT ? ROUTES.REALMS : ROUTES.DASHBOARD)
	}

	const handleLogout = () => {
		logout()
		navigate(ROUTES.LOGIN)
	}

	return (
		<Header className={styles.header}>
			<div className={clsx('container', styles.inner)}>
				<Logo onClick={navigateHome} />

				{user?.role === Roles.ROOT ? (
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
						{navItems.map(item => (
							<ButtonField
								key={item.label}
								onClick={() => {
									if ('externalUrl' in item) {
										window.location.assign(item.externalUrl)
										return
									}

									navigate(item.route)
								}}
								type={
									'route' in item && isRouteActive(item.route)
										? 'primary'
										: 'text'
								}
							>
								{item.label}
							</ButtonField>
						))}

						<ButtonField
							className={styles.profileButton}
							onClick={() => navigate(ROUTES.SETTINGS)}
							type='default'
						>
							Профиль
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
