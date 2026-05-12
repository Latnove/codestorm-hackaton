import { apiClient, buildQueryParams, unwrapData } from '@/shared/api'

import type { DashboardMetricPoint } from '../model/types'

export type DashboardMetricsParams = {
	miniAppCode?: string
	range?: string
	realmCode?: string
}

type DashboardMetricsResponse =
	| DashboardMetricPoint[]
	| {
			items: DashboardMetricPoint[]
	  }
	| {
			points: DashboardMetricPoint[]
	  }

export const dashboardKeys = {
	all: ['dashboard'] as const,
	metrics: (params?: DashboardMetricsParams) =>
		[...dashboardKeys.all, 'metrics', params] as const,
}

const normalizeDashboardMetrics = (
	response: DashboardMetricsResponse,
): DashboardMetricPoint[] => {
	if (Array.isArray(response)) {
		return response
	}

	if ('points' in response) {
		return response.points
	}

	return response.items
}

export const getDashboardMetrics = async (
	params?: DashboardMetricsParams,
): Promise<DashboardMetricPoint[]> => {
	const data = await unwrapData(
		apiClient.get<DashboardMetricsResponse>(
			'/api/admin/statistics/dashboard',
			{
				params: buildQueryParams(params),
			},
		),
	)

	return normalizeDashboardMetrics(data)
}
