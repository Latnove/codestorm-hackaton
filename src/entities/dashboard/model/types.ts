export interface DashboardMetricPoint {
	timestamp: string
	launchSuccessTotal: number
	launchDeniedTotal: number
	ssoSuccessTotal: number
	ssoFailedTotal: number
	hostTokensIssuedTotal: number
}

export interface DashboardMetricChartPoint extends DashboardMetricPoint {
	timeLabel: string
	launchSuccessDelta: number
	launchDeniedDelta: number
	ssoSuccessDelta: number
	ssoFailedDelta: number
	hostTokensIssuedDelta: number
}
