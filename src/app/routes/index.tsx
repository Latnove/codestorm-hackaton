import { Roles } from '@/entities/user'
import { LoginPage } from '@/pages/auth'
import { DashboardPage } from '@/pages/dashboard'
import { Forbidden, NotFound } from '@/pages/error'
import { LaunchPage } from '@/pages/launch'
import {
	CreateMiniappPage,
	EditMiniappPage,
	MiniappAccessPage,
	MiniappDetailsPage,
	MiniappsPage,
} from '@/pages/miniapps'
import {
	CreateRealmPage,
	RealmDetailsPage,
	RealmRolesPage,
	RealmsPage,
	RoleMappingPage,
} from '@/pages/realms'
import { CreateUserPage, UserDetailsPage, UsersPage } from '@/pages/users'
import { ROUTES } from '@/shared/config'
import { Navigate } from 'react-router-dom'
import { RequireRole } from '../providers/router/RequireRole'
import { AppLayout } from '../ui/AppLayout'

const realmViewRoles = [
	Roles.ROOT,
	Roles.ADMIN,
	Roles.REALM_ADMIN,
	Roles.ACCESS_MANAGER,
	Roles.MINIAPP_MANAGER,
	Roles.READONLY,
	Roles.VIEWER,
]

const realmManageRoles = [Roles.ROOT, Roles.ADMIN, Roles.REALM_ADMIN]

const realmMiniAppCreateRoles = [
	Roles.ROOT,
	Roles.ADMIN,
	Roles.REALM_ADMIN,
	Roles.MINIAPP_MANAGER,
]

const realmMiniAppEditRoles = [
	Roles.ROOT,
	Roles.ADMIN,
	Roles.REALM_ADMIN,
	Roles.ACCESS_MANAGER,
	Roles.MINIAPP_MANAGER,
]

const realmMiniAppAccessRoles = [
	Roles.ROOT,
	Roles.ADMIN,
	Roles.REALM_ADMIN,
	Roles.ACCESS_MANAGER,
]

const dashboardRoles = [
	Roles.ROOT,
	Roles.ADMIN,
	Roles.REALM_ADMIN,
	Roles.MINIAPP_MANAGER,
	Roles.ACCESS_MANAGER,
	Roles.VIEWER,
]

export const routes = [
	{
		element: <AppLayout />,
		children: [
			{
				path: '/',
				element: <Navigate to={ROUTES.DASHBOARD} replace />,
			},
			{
				path: ROUTES.LOGIN,
				element: <LoginPage />,
			},
			{
				path: ROUTES.REALMS,
				element: (
					<RequireRole roles={[Roles.ROOT, Roles.ADMIN]}>
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
				element: <Navigate to='overview' replace />,
			},
			{
				path: ROUTES.REALM_OVERVIEW,
				element: (
					<RequireRole roles={realmViewRoles}>
						<RealmDetailsPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_ROLES,
				element: (
					<RequireRole roles={realmManageRoles}>
						<RealmRolesPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_ROLE_CREATE,
				element: (
					<RequireRole roles={realmManageRoles}>
						<RealmRolesPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_ROLE_MAPPING,
				element: (
					<RequireRole roles={realmManageRoles}>
						<RoleMappingPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_MINIAPPS,
				element: (
					<RequireRole roles={realmViewRoles}>
						<MiniappsPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_MINIAPP_CREATE,
				element: (
					<RequireRole roles={realmMiniAppCreateRoles}>
						<CreateMiniappPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_MINIAPP_DETAILS,
				element: (
					<RequireRole roles={realmViewRoles}>
						<MiniappDetailsPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_MINIAPP_EDIT,
				element: (
					<RequireRole roles={realmMiniAppEditRoles}>
						<EditMiniappPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.REALM_MINIAPP_ACCESS,
				element: (
					<RequireRole roles={realmMiniAppAccessRoles}>
						<MiniappAccessPage />
					</RequireRole>
				),
			},
			{
				path: ROUTES.DASHBOARD,
				element: (
					<RequireRole roles={dashboardRoles}>
						<DashboardPage />
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
