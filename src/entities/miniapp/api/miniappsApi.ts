import type {
	AccessType,
	RealmMiniApp,
	RealmMiniAppFormValues,
	RealmMiniAppStatus,
	RoleMatchMode,
} from '@/entities/miniapp/model/types'
import {
	apiClient,
	buildQueryParams,
	unwrapData,
	type PageResponse,
} from '@/shared/api'

export type MiniAppResponse = {
	createdAt: string
	defaultBackendUrl: string | null
	defaultEntryUrl: string | null
	description: string | null
	iconUrl: string | null
	id: string
	metadata: Record<string, unknown> | null
	code: string
	name: string
}

export type CreateMiniAppRequest = {
	code: string
	defaultBackendUrl?: string
	defaultEntryUrl?: string
	description?: string
	iconUrl?: string
	metadata?: Record<string, unknown>
	name: string
}

export type UpdateMiniAppRequest = Partial<Omit<CreateMiniAppRequest, 'code'>>

export type AccessPolicyRequest = {
	accessType: AccessType
	requiredRoles?: string[]
	roleMatchMode?: RoleMatchMode
}

export type AccessPolicyResponse = AccessPolicyRequest

export type ConnectMiniAppRequest = {
	accessPolicy: AccessPolicyResponse
	backendUrl?: string
	entryUrl?: string
	miniAppCode: string
	settings?: Record<string, unknown>
}

export type UpdateRealmMiniAppRequest = {
	accessPolicy?: AccessPolicyResponse
	backendUrl?: string
	entryUrl?: string
	settings?: Record<string, unknown>
}

export type RealmMiniAppResponse = {
	accessPolicy: AccessPolicyResponse | null
	backendUrl: string | null
	code: string
	entryUrl: string
	name: string
	settings: Record<string, unknown> | null
	status: RealmMiniAppStatus
}

export type RealmMiniAppListItemResponse = {
	accessType: AccessType
	backendUrl: string | null
	code: string
	entryUrl: string
	name: string
	status: RealmMiniAppStatus
}

export type MiniAppsListParams = {
	page?: number
	search?: string
	size?: number
	sort?: string
}

export type RealmMiniAppsListParams = MiniAppsListParams & {
	status?: RealmMiniAppStatus | 'ALL'
}

const normalizeOptional = (value?: string) => {
	const cleanValue = value?.trim()

	return cleanValue || undefined
}

const parseSettings = (settings?: string) => {
	if (!settings?.trim()) {
		return undefined
	}

	return JSON.parse(settings) as Record<string, unknown>
}

const buildAccessPolicy = (
	values: Pick<
		RealmMiniAppFormValues,
		'accessType' | 'requiredRoles' | 'roleMatchMode'
	>,
): AccessPolicyRequest => {
	if (values.accessType !== 'ROLE_BASED') {
		return {
			accessType: values.accessType,
		}
	}

	return {
		accessType: values.accessType,
		requiredRoles: values.requiredRoles ?? [],
		roleMatchMode: values.roleMatchMode,
	}
}

export const mapRealmMiniApp = (
	realmCode: string,
	response: RealmMiniAppResponse,
): RealmMiniApp => ({
	accessType: response.accessPolicy?.accessType ?? 'PUBLIC_IN_REALM',
	backendUrl: response.backendUrl ?? undefined,
	code: response.code,
	createdAt: '',
	entryUrl: response.entryUrl,
	id: `realm-miniapp-${realmCode}-${response.code}`,
	name: response.name,
	realmCode,
	requiredRoles: response.accessPolicy?.requiredRoles,
	roleMatchMode: response.accessPolicy?.roleMatchMode,
	settings: response.settings ?? undefined,
	status: response.status,
	updatedAt: '',
})

export const mapRealmMiniAppListItem = (
	realmCode: string,
	response: RealmMiniAppListItemResponse,
): RealmMiniApp => ({
	accessType: response.accessType,
	backendUrl: response.backendUrl ?? undefined,
	code: response.code,
	createdAt: '',
	entryUrl: response.entryUrl,
	id: `realm-miniapp-${realmCode}-${response.code}`,
	name: response.name,
	realmCode,
	status: response.status,
	updatedAt: '',
})

export const miniAppKeys = {
	all: ['miniapps'] as const,
	detail: (miniAppCode: string) =>
		[...miniAppKeys.details(), miniAppCode] as const,
	details: () => [...miniAppKeys.all, 'detail'] as const,
	list: (params?: MiniAppsListParams) =>
		[...miniAppKeys.lists(), params] as const,
	lists: () => [...miniAppKeys.all, 'list'] as const,
}

export const realmMiniAppKeys = {
	all: ['realm-miniapps'] as const,
	detail: (realmCode: string, miniAppCode: string) =>
		[...realmMiniAppKeys.details(realmCode), miniAppCode] as const,
	details: (realmCode: string) =>
		[...realmMiniAppKeys.all, realmCode, 'detail'] as const,
	list: (realmCode: string, params?: RealmMiniAppsListParams) =>
		[...realmMiniAppKeys.lists(realmCode), params] as const,
	lists: (realmCode: string) =>
		[...realmMiniAppKeys.all, realmCode, 'list'] as const,
}

export const getMiniApps = async (
	params?: MiniAppsListParams,
): Promise<PageResponse<MiniAppResponse>> =>
	unwrapData(
		apiClient.get<PageResponse<MiniAppResponse>>('/api/admin/miniapps', {
			params: buildQueryParams({
				page: params?.page ?? 0,
				search: params?.search,
				size: params?.size ?? 100,
				sort: params?.sort,
			}),
		}),
	)

export const getMiniApp = (miniAppCode: string) =>
	unwrapData(
		apiClient.get<MiniAppResponse>(`/api/admin/miniapps/${miniAppCode}`),
	)

export const createMiniApp = (request: CreateMiniAppRequest) =>
	unwrapData(apiClient.post<MiniAppResponse>('/api/admin/miniapps', request))

export const updateMiniApp = (
	miniAppCode: string,
	request: UpdateMiniAppRequest,
) =>
	unwrapData(
		apiClient.patch<MiniAppResponse>(
			`/api/admin/miniapps/${miniAppCode}`,
			request,
		),
	)

export const deleteMiniApp = (miniAppCode: string) =>
	unwrapData(apiClient.delete<void>(`/api/admin/miniapps/${miniAppCode}`))

export const getRealmMiniApps = async (
	realmCode: string,
	params?: RealmMiniAppsListParams,
): Promise<PageResponse<RealmMiniApp>> => {
	const data = await unwrapData(
		apiClient.get<PageResponse<RealmMiniAppListItemResponse>>(
			`/api/admin/realms/${realmCode}/miniapps`,
			{
				params: buildQueryParams({
					page: params?.page ?? 0,
					search: params?.search,
					size: params?.size ?? 100,
					sort: params?.sort,
					status: params?.status === 'ALL' ? undefined : params?.status,
				}),
			},
		),
	)

	return {
		...data,
		items: data.items.map(item => mapRealmMiniAppListItem(realmCode, item)),
	}
}

export const getRealmMiniApp = async (
	realmCode: string,
	miniAppCode: string,
): Promise<RealmMiniApp> => {
	const data = await unwrapData(
		apiClient.get<RealmMiniAppResponse>(
			`/api/admin/realms/${realmCode}/miniapps/${miniAppCode}`,
		),
	)

	return mapRealmMiniApp(realmCode, data)
}

export const connectRealmMiniApp = async (
	realmCode: string,
	values: RealmMiniAppFormValues,
): Promise<RealmMiniApp> => {
	const miniAppCode = values.code?.trim() ?? ''
	const data = await unwrapData(
		apiClient.post<RealmMiniAppResponse>(
			`/api/admin/realms/${realmCode}/miniapps`,
			{
				accessPolicy: buildAccessPolicy(values),
				backendUrl: normalizeOptional(values.backendUrl),
				entryUrl: normalizeOptional(values.entryUrl),
				miniAppCode,
				settings: parseSettings(values.settings),
			} satisfies ConnectMiniAppRequest,
		),
	)

	return mapRealmMiniApp(realmCode, data)
}

export const updateRealmMiniApp = async (
	realmCode: string,
	miniAppCode: string,
	values: Omit<RealmMiniAppFormValues, 'code'>,
): Promise<RealmMiniApp> => {
	const data = await unwrapData(
		apiClient.patch<RealmMiniAppResponse>(
			`/api/admin/realms/${realmCode}/miniapps/${miniAppCode}`,
			{
				accessPolicy: buildAccessPolicy(values),
				backendUrl: normalizeOptional(values.backendUrl),
				entryUrl: normalizeOptional(values.entryUrl),
				settings: parseSettings(values.settings),
			} satisfies UpdateRealmMiniAppRequest,
		),
	)

	return mapRealmMiniApp(realmCode, data)
}

export const publishRealmMiniApp = (realmCode: string, miniAppCode: string) =>
	unwrapData(
		apiClient.post<void>(
			`/api/admin/realms/${realmCode}/miniapps/${miniAppCode}/publish`,
		),
	)

export const stopRealmMiniApp = (realmCode: string, miniAppCode: string) =>
	unwrapData(
		apiClient.post<void>(
			`/api/admin/realms/${realmCode}/miniapps/${miniAppCode}/stop`,
		),
	)

export const deleteRealmMiniApp = (realmCode: string, miniAppCode: string) =>
	unwrapData(
		apiClient.delete<void>(
			`/api/admin/realms/${realmCode}/miniapps/${miniAppCode}`,
		),
	)

export const updateRealmMiniAppAccessPolicy = async (
	realmCode: string,
	miniAppCode: string,
	values: Pick<
		RealmMiniAppFormValues,
		'accessType' | 'requiredRoles' | 'roleMatchMode'
	>,
): Promise<RealmMiniApp> => {
	const data = await unwrapData(
		apiClient.put<RealmMiniAppResponse>(
			`/api/admin/realms/${realmCode}/miniapps/${miniAppCode}/access-policy`,
			buildAccessPolicy(values),
		),
	)

	return mapRealmMiniApp(realmCode, data)
}
