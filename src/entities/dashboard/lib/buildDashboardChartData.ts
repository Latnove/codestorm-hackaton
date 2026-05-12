import type {
	DashboardMetricChartPoint,
	DashboardMetricPoint,
} from '../model/types'

export const buildDashboardChartData = (
	points: DashboardMetricPoint[],
): DashboardMetricChartPoint[] =>
	points.map((point, index) => {
		const prev = points[index - 1]

		return {
			...point,
			timeLabel: new Date(point.timestamp).toLocaleTimeString('ru-RU', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			}),
			launchSuccessDelta: prev
				? Math.max(0, point.launchSuccessTotal - prev.launchSuccessTotal)
				: 0,
			launchDeniedDelta: prev
				? Math.max(0, point.launchDeniedTotal - prev.launchDeniedTotal)
				: 0,
			ssoSuccessDelta: prev
				? Math.max(0, point.ssoSuccessTotal - prev.ssoSuccessTotal)
				: 0,
			ssoFailedDelta: prev
				? Math.max(0, point.ssoFailedTotal - prev.ssoFailedTotal)
				: 0,
			hostTokensIssuedDelta: prev
				? Math.max(
						0,
						point.hostTokensIssuedTotal - prev.hostTokensIssuedTotal,
					)
				: 0,
		}
	})
