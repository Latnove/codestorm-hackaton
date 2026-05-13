import {
	getRealmMiniApp,
	realmMiniAppKeys,
	updateRealmMiniApp,
	type RealmMiniAppFormValues,
} from '@/entities/miniapp'
import { getRealmMiniAppPermissions, useUserStore } from '@/entities/user'
import {
	getAdminRealm,
	getRealmRoles,
	realmKeys,
	realmRoleKeys,
} from '@/entities/realm'
import {
	buildRealmMiniappRoute,
	buildRealmMiniappsRoute,
	buildRealmOverviewRoute,
	ROUTES,
} from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, message, Space, Typography } from 'antd'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
	buildRealmMiniAppFormValues,
	RealmMiniAppForm,
} from '../../shared/ui/RealmMiniAppForm'
import styles from '../../shared/ui/RealmMiniAppsPage.module.css'

const { Text, Title } = Typography

export const EditMiniappPage = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { miniAppCode = '', realmCode = '' } = useParams()
	const user = useUserStore(state => state.user)
	const { data: realm, isLoading: isRealmLoading } = useQuery({
		enabled: Boolean(realmCode),
		queryFn: () => getAdminRealm(realmCode),
		queryKey: realmKeys.detail(realmCode),
	})
	const { data: miniApp, isLoading: isMiniAppLoading } = useQuery({
		enabled: Boolean(realmCode && miniAppCode),
		queryFn: () => getRealmMiniApp(realmCode, miniAppCode),
		queryKey: realmMiniAppKeys.detail(realmCode, miniAppCode),
	})
	const { data: realmRoles = [] } = useQuery({
		enabled: Boolean(realmCode),
		queryFn: () => getRealmRoles(realmCode),
		queryKey: realmRoleKeys.list(realmCode),
	})
	const updateMiniAppMutation = useMutation({
		mutationFn: (values: RealmMiniAppFormValues) =>
			updateRealmMiniApp(realmCode, miniAppCode, values),
		onSuccess: updatedMiniApp => {
			void queryClient.invalidateQueries({
				queryKey: realmMiniAppKeys.lists(realmCode),
			})
			void queryClient.invalidateQueries({
				queryKey: realmMiniAppKeys.detail(realmCode, miniAppCode),
			})
			message.success(`MiniApp ${updatedMiniApp.code} обновлён`)
			navigate(buildRealmMiniappRoute(realmCode, updatedMiniApp.code))
		},
		onError: () => {
			message.error('Не удалось обновить MiniApp')
		},
	})
	const permissions = getRealmMiniAppPermissions(user, realmCode)

	if (isRealmLoading || isMiniAppLoading) {
		return null
	}

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	if (!permissions.canEditMiniApp && !permissions.canEditAccess) {
		return <Navigate to={ROUTES.FORBIDDEN} />
	}

	if (!miniApp) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	const handleFinish = (values: RealmMiniAppFormValues) => {
		updateMiniAppMutation.mutate(values)
	}

	return (
		<div className={`container ${styles.wrapper} ${styles.formWrapper}`}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Realm / {realm.name}</Text>
					<Title className={styles.mainTitle} level={1}>
						Редактировать MiniApp
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

			<Card className={`${styles.card} ${styles.formCard}`}>
				<RealmMiniAppForm
					initialValues={buildRealmMiniAppFormValues(miniApp)}
					mode='edit'
					onCancel={() =>
						navigate(buildRealmMiniappRoute(realm.code, miniApp.code))
					}
					onFinish={handleFinish}
					permissions={permissions}
					realmCode={realm.code}
					realmRoles={realmRoles}
					submitLabel='Сохранить'
				/>
			</Card>
		</div>
	)
}
