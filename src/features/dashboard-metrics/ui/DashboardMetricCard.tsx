import { Card, Skeleton } from 'antd'

import styles from './DashboardMetricCard.module.css'

const numberFormatter = new Intl.NumberFormat('ru-RU')

interface DashboardMetricCardProps {
	title: string
	value: number
	loading?: boolean
}

export const DashboardMetricCard = ({
	loading = false,
	title,
	value,
}: DashboardMetricCardProps) => (
	<Card className={styles.card}>
		<div className={styles.title}>{title}</div>
		{loading ? (
			<Skeleton.Input active block className={styles.skeleton} />
		) : (
			<div className={styles.value}>{numberFormatter.format(value)}</div>
		)}
	</Card>
)
