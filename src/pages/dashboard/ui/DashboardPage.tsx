import { useQuery } from '@tanstack/react-query'
import { Alert, Button, Card, Empty, Result, Skeleton, Typography } from 'antd'
import { useMemo } from 'react'

import {
	buildDashboardChartData,
	getDashboardMetrics,
} from '@/entities/dashboard'
import { DashboardMetricsGrid } from '@/features/dashboard-metrics'
import {
	HostTokensDeltaChart,
	LaunchesDeltaChart,
	SsoDeltaChart,
	TotalsOverviewChart,
} from '@/widgets/dashboard-charts'

import styles from './DashboardPage.module.css'

const { Text, Title } = Typography

const formatUpdatedAt = (value: number) =>
	value
		? new Date(value).toLocaleTimeString('ru-RU', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			})
		: '—'

const getErrorStatus = (error: unknown) => {
	if (typeof error !== 'object' || error === null || !('status' in error)) {
		return undefined
	}

	const status = Number((error as { status?: unknown }).status)

	return Number.isNaN(status) ? undefined : status
}

const DashboardSkeleton = () => (
	<>
		<DashboardMetricsGrid loading />
		<div className={styles.chartsGrid}>
			{Array.from({ length: 4 }, (_, index) => (
				<Card className={styles.skeletonCard} key={index}>
					<Skeleton active paragraph={{ rows: 8 }} />
				</Card>
			))}
		</div>
	</>
)

export const DashboardPage = () => {
	const {
		data: points = [],
		dataUpdatedAt,
		error,
		isError,
		isLoading,
		refetch,
	} = useQuery({
		queryFn: getDashboardMetrics,
		queryKey: ['dashboard-metrics'],
		refetchInterval: 10_000,
		placeholderData: previousData => previousData,
	})

	const chartData = useMemo(() => buildDashboardChartData(points), [points])
	const latest = points.at(-1)
	const hasPoints = points.length > 0
	const errorStatus = getErrorStatus(error)
	const isForbidden = errorStatus === 403
	const isInitialLoading = isLoading && !hasPoints
	const isFirstLoadError = isError && !hasPoints
	const isPollingError = isError && hasPoints

	const renderContent = () => {
		if (isInitialLoading) {
			return <DashboardSkeleton />
		}

		if (isForbidden && !hasPoints) {
			return (
				<Card className={styles.stateCard}>
					<Result status='403' title='Нет доступа к дашборду' />
				</Card>
			)
		}

		if (isFirstLoadError) {
			return (
				<Card className={styles.stateCard}>
					<Result
						extra={
							<Button onClick={() => void refetch()} type='primary'>
								Повторить
							</Button>
						}
						status='error'
						title='Не удалось загрузить метрики'
					/>
				</Card>
			)
		}

		if (!latest) {
			return (
				<Card className={styles.stateCard}>
					<Empty description='Нет данных для отображения' />
				</Card>
			)
		}

		return (
			<>
				<DashboardMetricsGrid latest={latest} />
				<div className={styles.chartsGrid}>
					<LaunchesDeltaChart data={chartData} />
					<SsoDeltaChart data={chartData} />
					<HostTokensDeltaChart data={chartData} />
					<TotalsOverviewChart latest={latest} />
				</div>
			</>
		)
	}

	return (
		<div className='container'>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<div>
						<Title className={styles.title} level={1}>
							Дашборд
						</Title>
						<Text className={styles.subtitle}>
							Живые метрики, которые обновляются каждые 10 секунд
						</Text>
					</div>

					<div className={styles.updatedAt}>
						<Text type='secondary'>Обновлено</Text>
						<Text strong>{formatUpdatedAt(dataUpdatedAt)}</Text>
					</div>
				</div>

				{isPollingError && (
					<Alert
						message={
							isForbidden
								? 'Нет доступа к дашборду'
								: 'Не удалось обновить данные. Показываются последние доступные значения.'
						}
						showIcon
						type={isForbidden ? 'error' : 'warning'}
					/>
				)}

				{renderContent()}
			</div>
		</div>
	)
}
