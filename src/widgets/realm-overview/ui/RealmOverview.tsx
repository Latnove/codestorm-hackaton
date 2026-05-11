import type { Realm } from '@/entities/realm'
import { ConnectMiniAppButton } from '@/features/realms/connect-miniapp'
import { CreateClientButton } from '@/features/realms/create-client'
import { CreateRoleButton } from '@/features/realms/create-role'
import { ViewStatisticsButton } from '@/features/realms/view-statistics'
import { Card, Tag } from 'antd'
import type { ReactNode } from 'react'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import styles from './RealmOverview.module.css'

interface RealmOverviewProps {
	manageActions?: ReactNode
	realm: Realm
}

const formatDate = (value: string) => new Date(value).toLocaleString()

const getStatusColor = (status: Realm['status']) =>
	status === 'ACTIVE' ? 'green' : 'red'

export const RealmOverview = ({ manageActions, realm }: RealmOverviewProps) => {
	const rows = [
		{ label: 'Описание', value: realm.description || '-' },
		{
			label: 'Статус',
			value: <Tag color={getStatusColor(realm.status)}>{realm.status}</Tag>,
		},
		{ label: 'Дата создания', value: formatDate(realm.createdAt) },
		{ label: 'Последнее обновление', value: formatDate(realm.updatedAt) },
		{ label: 'Количество админов', value: realm.clientsCount },
		{ label: 'Количество MiniApps', value: realm.miniappsCount },
		{ label: 'Активные MiniApps', value: realm.publishedMiniappsCount },
		{ label: 'Число активных сессий', value: realm.activeSessionsCount },
	]

	return (
		<Card className={styles.card}>
			<div className={styles.header}>
				<div>
					<Title className={styles.title} level={3}>
						Overview
					</Title>
					<Text type='secondary'>Основная информация по текущему Realm</Text>
				</div>

				{manageActions}
			</div>

			<div className={styles.profileCard}>
				<div className={styles.identity}>
					<div className={styles.avatar}>
						<span>{realm.name.slice(0, 2).toUpperCase()}</span>
					</div>

					<div className={styles.identityText}>
						<Text className={styles.label}>Realm code</Text>
						<Title className={styles.realmCode} level={2}>
							{realm.code}
						</Title>
						<Text className={styles.realmName}>{realm.name}</Text>
					</div>
				</div>

				<div className={styles.content}>
					<div className={styles.rows}>
						{rows.map(row => (
							<div className={styles.row} key={row.label}>
								<Text className={styles.rowLabel}>{row.label}</Text>
								<div className={styles.rowValue}>{row.value}</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className={styles.actionsBlock}>
				<div className={styles.actionsHeader}>
					<Title level={4}>Быстрые действия</Title>
					<Text type='secondary'>Основные операции для настройки Realm</Text>
				</div>

				<div className={styles.actions}>
					<CreateClientButton realmCode={realm.code} />
					<CreateRoleButton realmCode={realm.code} />
					<ConnectMiniAppButton realmCode={realm.code} />
					<ViewStatisticsButton realmCode={realm.code} />
				</div>
			</div>
		</Card>
	)
}
