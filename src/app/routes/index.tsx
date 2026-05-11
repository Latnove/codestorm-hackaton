import { Roles } from '@/entities/user'
import { LoginPage } from '@/pages/auth'
import { DashboardPage } from '@/pages/dashboard'
import { Forbidden, NotFound } from '@/pages/error'
import { LaunchPage } from '@/pages/launch'
import {
	CreateMiniappPage,
	EditMiniappPage,
	MiniappsPage,
} from '@/pages/miniapps'
import { CreateRealmPage, RealmDetailsPage, RealmsPage } from '@/pages/realms'
import { SettingsPage } from '@/pages/settings'
import { CreateUserPage, UserDetailsPage, UsersPage } from '@/pages/users'
import { EXTERNAL_LINKS, ROUTES } from '@/shared/config'
import { ExternalRedirect } from '@/shared/ui/ExternalRedirect'
import { Navigate } from 'react-router-dom'
import { RequireRole } from '../providers/router/RequireRole'
import { AppLayout } from '../ui/AppLayout'

export const routes = [
	{
		element: <AppLayout />,
		children: [
			{
				path: ROUTES.LOGIN,
				element: <LoginPage />,
			},
			{
				path: ROUTES.REALMS,
				element: (
					<RequireRole roles={[Roles.ROOT]}>
						<RealmsPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.USERS,
				element: (
					<RequireRole roles={[Roles.ROOT]}>
						<UsersPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.USER_CREATE,
				element: (
					<RequireRole roles={[Roles.ROOT]}>
						<CreateUserPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.USER_DETAILS,
				element: (
					<RequireRole roles={[Roles.ROOT]}>
						<UserDetailsPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_CREATE,
				element: (
					<RequireRole roles={[Roles.ROOT]}>
						<CreateRealmPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_DETAILS,
				element: (
					<Navigate to='overview' replace />
				),
			},
			{
				path: ROUTES.REALM_OVERVIEW,
				element: (
					<RequireRole roles={[Roles.ROOT, Roles.ADMIN]}>
						<RealmDetailsPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.DASHBOARD,
				element: (
					<RequireRole roles={[Roles.ADMIN]}>
						<DashboardPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.MINIAPPS,
				element: (
					<RequireRole roles={[Roles.ADMIN]}>
						<MiniappsPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.MINIAPP_CREATE,
				element: (
					<RequireRole roles={[Roles.ADMIN]}>
						<CreateMiniappPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.MINIAPP_EDIT,
				element: (
					<RequireRole roles={[Roles.ADMIN]}>
						<EditMiniappPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.LAUNCH,
				element: (
					<RequireRole roles={[Roles.ADMIN]}>
						<LaunchPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.ANALYTICS,
				element: (
					<RequireRole roles={[Roles.ADMIN]}>
						<ExternalRedirect
							title='Переходим в Grafana Analytics'
							to={EXTERNAL_LINKS.GRAFANA_ANALYTICS}
						/>
					</RequireRole>
				),
			},
			{
				path: ROUTES.AUDIT_LOGS,
				element: (
					<RequireRole roles={[Roles.ADMIN]}>
						<ExternalRedirect
							title='Переходим в Grafana Logs'
							to={EXTERNAL_LINKS.GRAFANA_LOGS}
						/>
					</RequireRole>
				),
			},
			{
				path: ROUTES.SETTINGS,
				element: (
					<RequireRole roles={[Roles.ADMIN]}>
						<SettingsPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.FORBIDDEN,
				element: <Forbidden />,
			},
			{
				path: ROUTES.NOT_FOUND,
				element: <NotFound />,
			},
			{
				path: '*',
				element: <Navigate to={ROUTES.NOT_FOUND} replace />,
			},
		],
	},
]
