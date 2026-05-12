import type { DashboardMetricPoint } from '@/entities/dashboard'

import { DashboardMetricCard } from './DashboardMetricCard'
import styles from './DashboardMetricsGrid.module.css'

type MetricKey = Exclude<keyof DashboardMetricPoint, 'timestamp'>

const metricDefinitions: Array<{ key: MetricKey; title: string }> = [
	{ key: 'launchSuccessTotal', title: 'Успешные запуски' },
	{ key: 'launchDeniedTotal', title: 'Отклоненные запуски' },
	{ key: 'ssoSuccessTotal', title: 'Успешные SSO-обмены' },
	{ key: 'ssoFailedTotal', title: 'Ошибки SSO-обмена' },
	{ key: 'hostTokensIssuedTotal', title: 'Выданные host-токены' },
]

interface DashboardMetricsGridProps {
	latest?: DashboardMetricPoint
	loading?: boolean
}

export const DashboardMetricsGrid = ({
	latest,
	loading = false,
}: DashboardMetricsGridProps) => (
	<div className={styles.grid}>
		{metricDefinitions.map(metric => (
			<DashboardMetricCard
				key={metric.key}
				loading={loading}
				title={metric.title}
				value={latest?.[metric.key] ?? 0}
			/>
		))}
	</div>
)
