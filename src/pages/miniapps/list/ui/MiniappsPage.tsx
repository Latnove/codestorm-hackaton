import {
	accessTypeLabels,
	realmMiniAppStatusColors,
	realmMiniAppStatusLabels,
	type AccessType,
	type RealmMiniApp,
	type RealmMiniAppStatus,
} from '@/entities/miniapp'
import { getRealmMiniAppPermissions, useUserStore } from '@/entities/user'
import {
	selectVisibleRealmMiniApps,
	useRealmMiniAppsStore,
} from '@/features/miniapps'
import { useRealmsStore } from '@/features/realms'
import {
	buildRealmMiniappCreateRoute,
	buildRealmMiniappRoute,
	buildRealmOverviewRoute,
	ROUTES,
} from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { SearchField } from '@/shared/ui/SearchField'
import { SelectField } from '@/shared/ui/SelectField'
import { Card, Empty, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { RealmMiniAppActions } from '../../shared/ui/RealmMiniAppActions'
import styles from '../../shared/ui/RealmMiniAppsPage.module.css'

const { Text, Title } = Typography

type MiniAppsFiltersForm = {
	accessType: AccessType | 'ALL'
	search: string
	status: RealmMiniAppStatus | 'ALL'
}

const statusOptions: Array<{ label: string; value: RealmMiniAppStatus | 'ALL' }> = [
	{ label: 'Все статусы', value: 'ALL' },
	{ label: realmMiniAppStatusLabels.DRAFT, value: 'DRAFT' },
	{ label: realmMiniAppStatusLabels.PUBLISHED, value: 'PUBLISHED' },
	{ label: realmMiniAppStatusLabels.STOPPED, value: 'STOPPED' },
]

const accessTypeOptions: Array<{ label: string; value: AccessType | 'ALL' }> = [
	{ label: 'Все типы доступа', value: 'ALL' },
	{ label: accessTypeLabels.PUBLIC_IN_REALM, value: 'PUBLIC_IN_REALM' },
	{ label: accessTypeLabels.AUTHENTICATED, value: 'AUTHENTICATED' },
	{ label: accessTypeLabels.ROLE_BASED, value: 'ROLE_BASED' },
]

export const MiniappsPage = () => {
	const navigate = useNavigate()
	const { realmCode = '' } = useParams()
	const user = useUserStore(state => state.user)
	const realm = useRealmsStore(state =>
		state.realms.find(item => item.code === realmCode),
	)
	const miniApps = useRealmMiniAppsStore(
		useShallow(selectVisibleRealmMiniApps(realmCode)),
	)
	const [filters, setFilters] = useState<MiniAppsFiltersForm>({
		accessType: 'ALL',
		search: '',
		status: 'ALL',
	})
	const { control, watch } = useForm<MiniAppsFiltersForm>({
		defaultValues: filters,
	})
	const permissions = getRealmMiniAppPermissions(user, realmCode)

	useEffect(() => {
		const subscription = watch(value => {
			setFilters({
				accessType: value.accessType ?? 'ALL',
				search: value.search ?? '',
				status: value.status ?? 'ALL',
			})
		})

		return () => subscription.unsubscribe()
	}, [watch])

	const filteredMiniApps = useMemo(() => {
		const normalizedSearch = filters.search.trim().toLowerCase()

		return miniApps.filter(miniApp => {
			const matchesSearch = normalizedSearch
				? [miniApp.code, miniApp.name].some(value =>
						value.toLowerCase().includes(normalizedSearch),
					)
				: true
			const matchesStatus =
				filters.status === 'ALL' ? true : miniApp.status === filters.status
			const matchesAccessType =
				filters.accessType === 'ALL'
					? true
					: miniApp.accessType === filters.accessType

			return matchesSearch && matchesStatus && matchesAccessType
		})
	}, [filters, miniApps])

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	if (!permissions.canView) {
		return <Navigate to={ROUTES.FORBIDDEN} />
	}

	const columns: ColumnsType<RealmMiniApp> = [
		{
			dataIndex: 'code',
			render: (value: string) => (
				<Text className={styles.code} strong>
					{value}
				</Text>
			),
			title: 'Код',
			width: 180,
		},
		{
			dataIndex: 'name',
			render: (value: string) => <span className={styles.name}>{value}</span>,
			title: 'Название',
		},
		{
			dataIndex: 'status',
			render: (value: RealmMiniAppStatus) => (
				<Tag color={realmMiniAppStatusColors[value]}>
					{realmMiniAppStatusLabels[value]}
				</Tag>
			),
			title: 'Статус',
		},
		{
			dataIndex: 'accessType',
			render: (value: AccessType) => accessTypeLabels[value],
			title: 'Тип доступа',
		},
		{ dataIndex: 'launches', title: 'Запуски' },
		{ dataIndex: 'errors', title: 'Ошибки' },
		{
			align: 'center',
			render: (_, miniApp) => (
				<div onClick={event => event.stopPropagation()}>
					<RealmMiniAppActions miniApp={miniApp} permissions={permissions} />
				</div>
			),
			title: 'Действия',
			width: 150,
		},
	]

	return (
		<div className={`container ${styles.wrapper}`}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Realm / {realm.name}</Text>
					<Title className={styles.mainTitle} level={1}>
						MiniApps
					</Title>
				</div>

				<Space wrap>
					<ButtonField
						onClick={() => navigate(buildRealmOverviewRoute(realm.code))}
					>
						В Realm
					</ButtonField>
					{permissions.canCreate && (
						<ButtonField
							onClick={() => navigate(buildRealmMiniappCreateRoute(realm.code))}
							type='primary'
						>
							Создать MiniApp
						</ButtonField>
					)}
				</Space>
			</div>

			<Card className={styles.card}>
				<div className={styles.toolbar}>
					<div>
						<Title className={styles.sectionTitle} level={3}>
							MiniApps в Realm {realm.name}
						</Title>
						<Text type='secondary'>MiniApp создаётся сразу внутри Realm.</Text>
					</div>

					<div className={styles.filters}>
						<div className={styles.search}>
							<SearchField
								control={control}
								label='Поиск'
								name='search'
								placeholder='Поиск по коду или названию'
								size='medium'
							/>
						</div>

						<div className={styles.filter}>
							<SelectField<MiniAppsFiltersForm, RealmMiniAppStatus | 'ALL'>
								control={control}
								label='Статус'
								name='status'
								options={statusOptions}
								placeholder='Статус'
								size='medium'
							/>
						</div>

						<div className={styles.filter}>
							<SelectField<MiniAppsFiltersForm, AccessType | 'ALL'>
								control={control}
								label='Доступ'
								name='accessType'
								options={accessTypeOptions}
								placeholder='Доступ'
								size='medium'
							/>
						</div>
					</div>
				</div>

				{miniApps.length === 0 ? (
					<Empty
						className={styles.empty}
						description='В этом Realm пока нет MiniApps.'
					>
						{permissions.canCreate && (
							<ButtonField
								onClick={() =>
									navigate(buildRealmMiniappCreateRoute(realm.code))
								}
								type='primary'
							>
								Создать MiniApp
							</ButtonField>
						)}
					</Empty>
				) : (
					<Table<RealmMiniApp>
						className={styles.table}
						columns={columns}
						dataSource={filteredMiniApps}
						locale={{
							emptyText: (
								<Empty description='MiniApps по текущим фильтрам не найдены.' />
							),
						}}
						onRow={miniApp => ({
							onClick: () =>
								navigate(buildRealmMiniappRoute(realm.code, miniApp.code)),
							style: { cursor: 'pointer' },
						})}
						pagination={{
							pageSize: 10,
							position: ['bottomRight'],
						}}
						rowKey='id'
						scroll={{ x: 1120 }}
					/>
				)}
			</Card>
		</div>
	)
}
