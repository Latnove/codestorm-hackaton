import { Roles, type Role } from '@/entities/user/model/roles'
import type {
	AuthPayload,
	PlatformUser,
	PlatformUserStatus,
	User,
} from '@/entities/user/model/types'
import { apiClient, buildQueryParams, unwrapData } from '@/shared/api'
import type { PageResponse } from '@/shared/api'

export type AuthGlobalRole = 'PLATFORM_ADMIN' | 'PLATFORM_AUDITOR' | 'ROOT'
export type CoreGlobalRole = 'ADMIN' | 'AUDITOR' | 'ROOT'
export type UserStatusDto = 'ACTIVE' | 'BLOCKED'

export type AdminLoginRequest = {
	password: string
	username: string
}

export type AdminAuthResponse = {
	accessToken: string
	expiresIn: number
	refreshToken: string
	tokenType: string
	user: {
		globalRole: AuthGlobalRole
		id: string
		realmCode: string | null
		username: string
	}
}

export type TokenResponse = {
	accessToken: string
	expiresIn: number
	refreshToken: string
	tokenType: string
}

export type PlatformUserResponse = {
	createdAt: string
	email: string | null
	globalRole: CoreGlobalRole
	id: string
	realmCode?: string
	status: UserStatusDto
	username: string
}

export type UsersListParams = {
	page?: number
	realmCode?: string
	role?: Role | 'ALL'
	search?: string
	size?: number
	sort?: string
	status?: PlatformUserStatus | 'ALL'
}

export type CreateUserRequest = {
	email?: string
	globalRole: CoreGlobalRole
	password: string
	realmCode?: string
	username: string
}

export type UpdateUserRequest = {
	email?: string
	status?: UserStatusDto
}

export type ChangeAccessRequest = {
	globalRole: CoreGlobalRole
	realmCode?: string
}

export const mapAuthRoleToRole = (role: AuthGlobalRole): Role => {
	if (role === 'ROOT') {
		return Roles.ROOT
	}

	return role === 'PLATFORM_AUDITOR' ? Roles.READONLY : Roles.ADMIN
}

export const mapCoreGlobalRoleToRole = (role: CoreGlobalRole): Role => {
	if (role === 'ROOT') {
		return Roles.ROOT
	}

	return role === 'AUDITOR' ? Roles.READONLY : Roles.ADMIN
}

export const mapRoleToCoreGlobalRole = (role: Role): CoreGlobalRole => {
	if (role === Roles.ROOT) {
		return 'ROOT'
	}

	return role === Roles.READONLY || role === Roles.VIEWER
		? 'AUDITOR'
		: 'ADMIN'
}

export const mapUserStatusFromDto = (
	status: UserStatusDto,
): PlatformUserStatus => (status === 'ACTIVE' ? 'active' : 'disable')

export const mapUserStatusToDto = (
	status: PlatformUserStatus,
): UserStatusDto => (status === 'active' ? 'ACTIVE' : 'BLOCKED')

export const mapAdminAuthResponse = (
	response: AdminAuthResponse,
): AuthPayload => ({
	accessToken: response.accessToken,
	expiresIn: response.expiresIn,
	refreshToken: response.refreshToken,
	tokenType: response.tokenType,
	user: {
		createdAt: new Date().toISOString(),
		id: response.user.id,
		realmCode: response.user.realmCode ?? undefined,
		role: mapAuthRoleToRole(response.user.globalRole),
		serviceName: 'MiniApp Platform',
		username: response.user.username,
	},
})

export const mapPlatformUser = (
	response: PlatformUserResponse,
): PlatformUser => ({
	createdAt: response.createdAt,
	email: response.email ?? '',
	id: response.id,
	realmCode: response.realmCode ?? '',
	role: mapCoreGlobalRoleToRole(response.globalRole),
	status: mapUserStatusFromDto(response.status),
	updatedAt: response.createdAt,
	username: response.username,
})

const mapUserParams = (params?: UsersListParams) =>
	buildQueryParams({
		page: params?.page ?? 0,
		realmCode: params?.realmCode,
		role:
			params?.role && params.role !== 'ALL'
				? mapRoleToCoreGlobalRole(params.role)
				: undefined,
		search: params?.search,
		size: params?.size ?? 100,
		sort: params?.sort,
		status:
			params?.status && params.status !== 'ALL'
				? mapUserStatusToDto(params.status)
				: undefined,
	})

export const userKeys = {
	all: ['users'] as const,
	detail: (userId: string) => [...userKeys.details(), userId] as const,
	details: () => [...userKeys.all, 'detail'] as const,
	list: (params?: UsersListParams) => [...userKeys.lists(), params] as const,
	lists: () => [...userKeys.all, 'list'] as const,
}

export const loginAdmin = async (
	payload: AdminLoginRequest,
): Promise<AuthPayload> => {
	const data = await unwrapData(
		apiClient.post<AdminAuthResponse>('/api/admin/auth/login', payload),
	)

	return mapAdminAuthResponse(data)
}

export const logoutAdmin = (refreshToken: string) =>
	unwrapData(
		apiClient.post<void>('/api/admin/auth/logout', {
			refreshToken,
		}),
	)

export const getPlatformUsers = async (
	params?: UsersListParams,
): Promise<PageResponse<PlatformUser>> => {
	const data = await unwrapData(
		apiClient.get<PageResponse<PlatformUserResponse>>('/api/admin/users', {
			params: mapUserParams(params),
		}),
	)

	return {
		...data,
		items: data.items.map(mapPlatformUser),
	}
}

export const getPlatformUser = async (
	userId: string,
): Promise<PlatformUser> => {
	const data = await unwrapData(
		apiClient.get<PlatformUserResponse>(`/api/admin/users/${userId}`),
	)

	return mapPlatformUser(data)
}

export const createPlatformUser = async (
	request: CreateUserRequest & { status?: PlatformUserStatus },
): Promise<PlatformUser> => {
	const created = await unwrapData(
		apiClient.post<PlatformUserResponse>('/api/admin/users', {
			email: request.email,
			globalRole: request.globalRole,
			password: request.password,
			realmCode: request.realmCode,
			username: request.username,
		} satisfies CreateUserRequest),
	)

	if (request.status && request.status !== 'active') {
		const updated = await updatePlatformUser(created.id, {
			status: mapUserStatusToDto(request.status),
		})

		return updated
	}

	return mapPlatformUser(created)
}

export const updatePlatformUser = async (
	userId: string,
	request: UpdateUserRequest,
): Promise<PlatformUser> => {
	const data = await unwrapData(
		apiClient.patch<PlatformUserResponse>(
			`/api/admin/users/${userId}`,
			request,
		),
	)

	return mapPlatformUser(data)
}

export const changePlatformUserAccess = async (
	userId: string,
	request: ChangeAccessRequest,
): Promise<PlatformUser> => {
	const data = await unwrapData(
		apiClient.put<PlatformUserResponse>(
			`/api/admin/users/${userId}/access`,
			request,
		),
	)

	return mapPlatformUser(data)
}

export const updatePlatformUserAndAccess = async (
	user: Pick<PlatformUser, 'id' | 'realmCode'>,
	values: Pick<PlatformUser, 'email' | 'role' | 'status'>,
) => {
	await updatePlatformUser(user.id, {
		email: values.email,
		status: mapUserStatusToDto(values.status),
	})

	return changePlatformUserAccess(user.id, {
		globalRole: mapRoleToCoreGlobalRole(values.role),
		realmCode: user.realmCode || undefined,
	})
}

export const blockPlatformUser = (userId: string) =>
	updatePlatformUser(userId, { status: 'BLOCKED' })

export const activatePlatformUser = (userId: string) =>
	updatePlatformUser(userId, { status: 'ACTIVE' })

export const buildUserFromAuthPayload = (payload: AuthPayload): User =>
	payload.user

export const mapPlatformUserToAuthUser = (user: PlatformUser): User => ({
	createdAt: user.createdAt,
	id: user.id,
	realmCode: user.realmCode || undefined,
	role: user.role,
	serviceName: 'MiniApp Platform',
	username: user.username,
})
