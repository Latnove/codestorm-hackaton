import { Card } from 'antd'
import type { ReactNode } from 'react'

import styles from '../DashboardCharts.module.css'

interface ChartCardProps {
	children: ReactNode
	title: string
}

export const ChartCard = ({ children, title }: ChartCardProps) => (
	<Card className={styles.card} title={title}>
		<div className={styles.chart}>{children}</div>
	</Card>
)
