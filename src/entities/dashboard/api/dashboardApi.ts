import type { DashboardMetricPoint } from '../model/types'

const SNAPSHOT_INTERVAL_MS = 10_000
const SNAPSHOT_COUNT = 10
const MOCK_NETWORK_DELAY_MS = 250
const mockStartedBucket = Math.floor(Date.now() / SNAPSHOT_INTERVAL_MS) - 48

const baseTotals = {
	hostTokensIssuedTotal: 180,
	launchDeniedTotal: 18,
	launchSuccessTotal: 1200,
	ssoFailedTotal: 9,
	ssoSuccessTotal: 1160,
}

const getDelta = (
	offset: number,
	min: number,
	range: number,
	salt: number,
) => min + ((offset * salt + Math.floor(offset / 3) * (salt + 2)) % range)

const buildTotal = (
	offset: number,
	base: number,
	min: number,
	range: number,
	salt: number,
) => {
	let total = base

	for (let index = 0; index <= offset; index += 1) {
		total += getDelta(index, min, range, salt)
	}

	return total
}

const buildMockPoint = (bucket: number): DashboardMetricPoint => {
	const offset = Math.max(0, bucket - mockStartedBucket)

	return {
		timestamp: new Date(bucket * SNAPSHOT_INTERVAL_MS).toISOString(),
		launchSuccessTotal: buildTotal(
			offset,
			baseTotals.launchSuccessTotal,
			7,
			14,
			5,
		),
		launchDeniedTotal: buildTotal(
			offset,
			baseTotals.launchDeniedTotal,
			0,
			4,
			3,
		),
		ssoSuccessTotal: buildTotal(offset, baseTotals.ssoSuccessTotal, 6, 12, 7),
		ssoFailedTotal: buildTotal(offset, baseTotals.ssoFailedTotal, 0, 3, 2),
		hostTokensIssuedTotal: buildTotal(
			offset,
			baseTotals.hostTokensIssuedTotal,
			1,
			7,
			4,
		),
	}
}

const getMockDashboardMetrics = (): DashboardMetricPoint[] => {
	const currentBucket = Math.floor(Date.now() / SNAPSHOT_INTERVAL_MS)
	const firstBucket = currentBucket - SNAPSHOT_COUNT + 1

	return Array.from({ length: SNAPSHOT_COUNT }, (_, index) =>
		buildMockPoint(firstBucket + index),
	)
}

export const getDashboardMetrics = async (): Promise<
	DashboardMetricPoint[]
> => {
	await new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS))

	return getMockDashboardMetrics()
}
