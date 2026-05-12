import {
	accessTypeLabels,
	realmMiniAppStatusColors,
	realmMiniAppStatusLabels,
	roleMatchModeLabels,
	type RealmMiniApp,
} from '@/entities/miniapp'
import { getRealmMiniAppPermissions, useUserStore } from '@/entities/user'
import { selectRealmMiniApp, useRealmMiniAppsStore } from '@/features/miniapps'
import { useRealmsStore } from '@/features/realms'
import {
	buildRealmMiniappsRoute,
	buildRealmOverviewRoute,
	ROUTES,
} from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Card, Space, Tag, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { RealmMiniAppActions } from '../../shared/ui/RealmMiniAppActions'
import styles from '../../shared/ui/RealmMiniAppsPage.module.css'

const { Text, Title } = Typography

const formatDate = (value: string) => new Date(value).toLocaleString()

const formatSettings = (settings?: Record<string, unknown>) =>
	settings ? JSON.stringify(settings, null, 2) : '-'

const MiniAppIcon = ({ miniApp }: { miniApp: RealmMiniApp }) => {
	const fallback = miniApp.name.slice(0, 2).toUpperCase()

	if (!miniApp.iconUrl) {
		return <div className={styles.icon}>{fallback}</div>
	}

	return (
		<div className={styles.icon}>
			<img alt={miniApp.name} src={miniApp.iconUrl} />
		</div>
	)
}

export const MiniappDetailsPage = () => {
	const navigate = useNavigate()
	const { miniAppCode = '', realmCode = '' } = useParams()
	const user = useUserStore(state => state.user)
	const realm = useRealmsStore(state =>
		state.realms.find(item => item.code === realmCode),
	)
	const miniApp = useRealmMiniAppsStore(
		selectRealmMiniApp(realmCode, miniAppCode),
	)
	const permissions = getRealmMiniAppPermissions(user, realmCode)

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	if (!permissions.canView) {
		return <Navigate to={ROUTES.FORBIDDEN} />
	}

	if (!miniApp) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	const rows: Array<{ label: string; value: ReactNode }> = [
		{ label: 'Код', value: miniApp.code },
		{ label: 'Название', value: miniApp.name },
		{ label: 'Описание', value: miniApp.description || '-' },
		{
			label: 'Статус',
			value: (
				<Tag color={realmMiniAppStatusColors[miniApp.status]}>
					{realmMiniAppStatusLabels[miniApp.status]}
				</Tag>
			),
		},
		{ label: 'URL входа', value: miniApp.entryUrl },
		{ label: 'Backend URL', value: miniApp.backendUrl || '-' },
		{ label: 'Тип доступа', value: accessTypeLabels[miniApp.accessType] },
		{
			label: 'Режим проверки ролей',
			value: miniApp.roleMatchMode
				? roleMatchModeLabels[miniApp.roleMatchMode]
				: '-',
		},
		{
			label: 'Обязательные роли',
			value: miniApp.requiredRoles?.length
				? miniApp.requiredRoles.join(', ')
				: '-',
		},
		{ label: 'Запуски', value: miniApp.launches ?? 0 },
		{ label: 'Ошибки', value: miniApp.errors ?? 0 },
		{ label: 'Настройки', value: formatSettings(miniApp.settings) },
		{ label: 'Создан', value: formatDate(miniApp.createdAt) },
		{ label: 'Обновлён', value: formatDate(miniApp.updatedAt) },
	]

	return (
		<div className={`container ${styles.wrapper}`}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Realm / {realm.name}</Text>
					<Title className={styles.mainTitle} level={1}>
						{miniApp.name}
					</Title>
				</div>

				<Space wrap>
					<ButtonField
						onClick={() => navigate(buildRealmOverviewRoute(realm.code))}
					>
						В Realm
					</ButtonField>
					<ButtonField
						onClick={() => navigate(buildRealmMiniappsRoute(realm.code))}
					>
						К MiniApps
					</ButtonField>
				</Space>
			</div>

			<Card className={styles.card}>
				<div className={styles.cardHeader}>
					<div>
						<Title className={styles.sectionTitle} level={3}>
							Страница MiniApp
						</Title>
						<Text type='secondary'>
							Политика доступа ниже опирается только на realmRoles.
						</Text>
					</div>
				</div>

				<div className={styles.detailsGrid}>
					<div className={styles.identity}>
						<MiniAppIcon miniApp={miniApp} />
						<div className={styles.identityText}>
							<Text className={styles.label}>Код MiniApp</Text>
							<Title className={styles.miniAppCode} level={2}>
								{miniApp.code}
							</Title>
							<Text className={styles.realmName}>{realm.name}</Text>
						</div>

						<div className={styles.identityTags}>
							<Tag color={realmMiniAppStatusColors[miniApp.status]}>
								{realmMiniAppStatusLabels[miniApp.status]}
							</Tag>
							<Tag>{accessTypeLabels[miniApp.accessType]}</Tag>
						</div>
					</div>

					<div className={styles.detailsRows}>
						{rows.map(row => (
							<div className={styles.detailsRow} key={row.label}>
								<div className={styles.rowLabel}>{row.label}</div>
								<div className={styles.rowValue}>{row.value}</div>
							</div>
						))}
					</div>
				</div>

				<div className={styles.actionsBlock}>
					<div className={styles.actionsHeader}>
						<Title level={4}>Быстрые действия</Title>
						<Text type='secondary'>
							Управление MiniApp внутри текущего Realm
						</Text>
					</div>

					<div className={styles.actions}>
						<RealmMiniAppActions
							afterDeletePath={buildRealmMiniappsRoute(realm.code)}
							miniApp={miniApp}
							permissions={permissions}
							showView={false}
							variant='inline'
						/>
					</div>
				</div>
			</Card>
		</div>
	)
}
