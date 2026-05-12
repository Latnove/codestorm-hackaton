import type {
	ExternalRoleMapping,
	Realm,
	RealmRole,
	RealmStatus,
} from '@/entities/realm/model/types'
import {
	apiClient,
	buildQueryParams,
	unwrapData,
	type PageResponse,
} from '@/shared/api'

export type RoleSource = 'HOST_ROLE'

export type CreateRealmRequest = {
	code: string
	description?: string
	name: string
}

export type UpdateRealmRequest = {
	description?: string
	name?: string
}

export type CreateRealmResponse = {
	clientId: string
	clientSecret: string
	code: string
	description: string | null
	name: string
	status: RealmStatus
}

export type RealmListItemResponse = {
	clientsCount: number
	code: string
	createdAt: string
	miniAppsCount: number
	name: string
	status: RealmStatus
}

export type RealmDetailsResponse = {
	clientsCount: number
	code: string
	createdAt: string
	description: string | null
	miniAppsCount: number
	name: string
	rolesCount: number
	status: RealmStatus
	updatedAt: string
}

export type RealmClientResponse = {
	clientId: string
	createdAt: string
	status: 'ACTIVE' | 'BLOCKED'
	updatedAt: string
}

export type CreateRealmClientRequest = {
	clientId: string
}

export type CreateRealmClientResponse = {
	clientId: string
	clientSecret: string
}

export type RotateSecretResponse = {
	clientId: string
	clientSecret: string
}

export type CreateRealmRoleRequest = {
	code: string
	description?: string
	name: string
}

export type UpdateRealmRoleRequest = {
	description?: string
	name?: string
}

export type RealmRoleResponse = {
	code: string
	createdAt: string
	description: string | null
	name: string
	usedInPoliciesCount: number
}

export type CreateRoleMappingRequest = {
	externalRole: string
	realmRoleCode: string
	source: RoleSource
}

export type UpdateRoleMappingRequest = {
	realmRoleCode: string
}

export type RoleMappingResponse = {
	createdAt: string
	externalRole: string
	id: string
	realmRoleCode: string
	source: RoleSource
}

export type RealmListParams = {
	page?: number
	search?: string
	size?: number
	sort?: string
	status?: RealmStatus | 'ALL'
}

export type RealmCredentials = {
	clientId: string
	clientSecret: string
	realmCode: string
}

export type CreateRealmResult = {
	credentials: RealmCredentials
	realm: Realm
}

const buildRealmBase = (
	code: string,
	name: string,
	description: string | null | undefined,
	status: RealmStatus,
	createdAt: string,
	updatedAt: string,
	miniAppsCount: number,
	clientsCount: number,
): Realm => ({
	activeSessionsCount: 0,
	clientsCount,
	code,
	createdAt,
	description: description ?? undefined,
	id: `realm-${code}`,
	metadata: {
		allowedOrigins: [],
		authMode: 'SSO',
		clientId: `${code}-backend`,
		environment: 'demo',
		ownerTeam: name,
		region: 'ru-central-1',
		scopes: ['miniapp:catalog', 'miniapp:launch', 'session:logout'],
	},
	miniappsCount: miniAppsCount,
	name,
	publishedMiniappsCount: 0,
	status,
	updatedAt,
})

export const mapRealmListItem = (
	response: RealmListItemResponse,
): Realm =>
	buildRealmBase(
		response.code,
		response.name,
		null,
		response.status,
		response.createdAt,
		response.createdAt,
		response.miniAppsCount,
		response.clientsCount,
	)

export const mapRealmDetails = (
	response: RealmDetailsResponse,
): Realm =>
	buildRealmBase(
		response.code,
		response.name,
		response.description,
		response.status,
		response.createdAt,
		response.updatedAt,
		response.miniAppsCount,
		response.clientsCount,
	)

export const mapRealmRole = (
	realmCode: string,
	response: RealmRoleResponse,
): RealmRole => ({
	code: response.code,
	createdAt: response.createdAt,
	description: response.description ?? undefined,
	id: `realm-role-${realmCode}-${response.code.toLowerCase()}`,
	name: response.name,
	realmCode,
	updatedAt: response.createdAt,
	usedInPoliciesCount: response.usedInPoliciesCount,
})

export const mapRoleMapping = (
	realmCode: string,
	response: RoleMappingResponse,
): ExternalRoleMapping => ({
	createdAt: response.createdAt,
	externalRole: response.externalRole,
	id: response.id,
	realmCode,
	realmRoleCode: response.realmRoleCode,
	source: response.source,
	updatedAt: response.createdAt,
})

export const realmKeys = {
	all: ['realms'] as const,
	clients: (realmCode: string) =>
		[...realmKeys.detail(realmCode), 'clients'] as const,
	detail: (realmCode: string) => [...realmKeys.details(), realmCode] as const,
	details: () => [...realmKeys.all, 'detail'] as const,
	list: (params?: RealmListParams) => [...realmKeys.lists(), params] as const,
	lists: () => [...realmKeys.all, 'list'] as const,
}

export const realmRoleKeys = {
	all: ['realm-roles'] as const,
	list: (realmCode: string) => [...realmRoleKeys.all, realmCode] as const,
}

export const roleMappingKeys = {
	all: ['role-mappings'] as const,
	list: (realmCode: string) => [...roleMappingKeys.all, realmCode] as const,
}

export const getAdminRealms = async (
	params?: RealmListParams,
): Promise<PageResponse<Realm>> => {
	const data = await unwrapData(
		apiClient.get<PageResponse<RealmListItemResponse>>('/api/admin/realms', {
			params: buildQueryParams({
				page: params?.page ?? 0,
				search: params?.search,
				size: params?.size ?? 100,
				sort: params?.sort,
				status: params?.status === 'ALL' ? undefined : params?.status,
			}),
		}),
	)

	return {
		...data,
		items: data.items.map(mapRealmListItem),
	}
}

export const getAdminRealm = async (realmCode: string): Promise<Realm> => {
	const data = await unwrapData(
		apiClient.get<RealmDetailsResponse>(`/api/admin/realms/${realmCode}`),
	)

	return mapRealmDetails(data)
}

export const createAdminRealm = async (
	request: CreateRealmRequest,
): Promise<CreateRealmResult> => {
	const data = await unwrapData(
		apiClient.post<CreateRealmResponse>('/api/admin/realms', request),
	)
	const now = new Date().toISOString()

	return {
		credentials: {
			clientId: data.clientId,
			clientSecret: data.clientSecret,
			realmCode: data.code,
		},
		realm: buildRealmBase(
			data.code,
			data.name,
			data.description,
			data.status,
			now,
			now,
			0,
			1,
		),
	}
}

export const updateAdminRealm = (realmCode: string, request: UpdateRealmRequest) =>
	unwrapData(apiClient.patch<void>(`/api/admin/realms/${realmCode}`, request))

export const enableAdminRealm = (realmCode: string) =>
	unwrapData(apiClient.post<void>(`/api/admin/realms/${realmCode}/enable`))

export const disableAdminRealm = (realmCode: string) =>
	unwrapData(apiClient.post<void>(`/api/admin/realms/${realmCode}/disable`))

export const deleteAdminRealm = (realmCode: string) =>
	unwrapData(apiClient.delete<void>(`/api/admin/realms/${realmCode}`))

export const getRealmClients = (realmCode: string) =>
	unwrapData(
		apiClient.get<RealmClientResponse[]>(
			`/api/admin/realms/${realmCode}/clients`,
		),
	)

export const createRealmClient = (
	realmCode: string,
	request: CreateRealmClientRequest,
) =>
	unwrapData(
		apiClient.post<CreateRealmClientResponse>(
			`/api/admin/realms/${realmCode}/clients`,
			request,
		),
	)

export const rotateRealmClientSecret = (
	realmCode: string,
	clientId: string,
) =>
	unwrapData(
		apiClient.post<RotateSecretResponse>(
			`/api/admin/realms/${realmCode}/clients/${clientId}/rotate-secret`,
		),
	)

export const blockRealmClient = (realmCode: string, clientId: string) =>
	unwrapData(
		apiClient.post<void>(
			`/api/admin/realms/${realmCode}/clients/${clientId}/block`,
		),
	)

export const unblockRealmClient = (realmCode: string, clientId: string) =>
	unwrapData(
		apiClient.post<void>(
			`/api/admin/realms/${realmCode}/clients/${clientId}/unblock`,
		),
	)

export const getRealmRoles = async (
	realmCode: string,
): Promise<RealmRole[]> => {
	const data = await unwrapData(
		apiClient.get<RealmRoleResponse[]>(
			`/api/admin/realms/${realmCode}/roles`,
		),
	)

	return data.map(role => mapRealmRole(realmCode, role))
}

export const createRealmRole = async (
	realmCode: string,
	request: CreateRealmRoleRequest,
): Promise<RealmRole> => {
	const data = await unwrapData(
		apiClient.post<RealmRoleResponse>(
			`/api/admin/realms/${realmCode}/roles`,
			request,
		),
	)

	return mapRealmRole(realmCode, data)
}

export const updateRealmRole = async (
	realmCode: string,
	roleCode: string,
	request: UpdateRealmRoleRequest,
): Promise<RealmRole> => {
	const data = await unwrapData(
		apiClient.patch<RealmRoleResponse>(
			`/api/admin/realms/${realmCode}/roles/${roleCode}`,
			request,
		),
	)

	return mapRealmRole(realmCode, data)
}

export const deleteRealmRole = (realmCode: string, roleCode: string) =>
	unwrapData(
		apiClient.delete<void>(`/api/admin/realms/${realmCode}/roles/${roleCode}`),
	)

export const getRoleMappings = async (
	realmCode: string,
): Promise<ExternalRoleMapping[]> => {
	const data = await unwrapData(
		apiClient.get<RoleMappingResponse[]>(
			`/api/admin/realms/${realmCode}/role-mappings`,
		),
	)

	return data.map(mapping => mapRoleMapping(realmCode, mapping))
}

export const createRoleMapping = async (
	realmCode: string,
	request: Omit<CreateRoleMappingRequest, 'source'>,
): Promise<ExternalRoleMapping> => {
	const data = await unwrapData(
		apiClient.post<RoleMappingResponse>(
			`/api/admin/realms/${realmCode}/role-mappings`,
			{
				...request,
				source: 'HOST_ROLE',
			} satisfies CreateRoleMappingRequest,
		),
	)

	return mapRoleMapping(realmCode, data)
}

export const updateRoleMapping = async (
	realmCode: string,
	mappingId: string,
	request: UpdateRoleMappingRequest,
): Promise<ExternalRoleMapping> => {
	const data = await unwrapData(
		apiClient.patch<RoleMappingResponse>(
			`/api/admin/realms/${realmCode}/role-mappings/${mappingId}`,
			request,
		),
	)

	return mapRoleMapping(realmCode, data)
}

export const deleteRoleMapping = (realmCode: string, mappingId: string) =>
	unwrapData(
		apiClient.delete<void>(
			`/api/admin/realms/${realmCode}/role-mappings/${mappingId}`,
		),
	)
