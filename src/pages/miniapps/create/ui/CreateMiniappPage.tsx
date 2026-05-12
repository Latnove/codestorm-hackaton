import {
	connectRealmMiniApp,
	getRealmMiniApps,
	realmMiniAppKeys,
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
	ROUTES,
} from '@/shared/config'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, message, Typography } from 'antd'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { RealmMiniAppForm } from '../../shared/ui/RealmMiniAppForm'
import styles from '../../shared/ui/RealmMiniAppsPage.module.css'

const { Text, Title } = Typography

const initialValues: RealmMiniAppFormValues = {
	accessType: 'PUBLIC_IN_REALM',
	backendUrl: '',
	code: '',
	description: '',
	entryUrl: '',
	iconUrl: '',
	name: '',
	requiredRoles: [],
	roleMatchMode: 'ANY',
	settings: '',
}

export const CreateMiniappPage = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { realmCode = '' } = useParams()
	const user = useUserStore(state => state.user)
	const { data: realm, isLoading: isRealmLoading } = useQuery({
		enabled: Boolean(realmCode),
		queryFn: () => getAdminRealm(realmCode),
		queryKey: realmKeys.detail(realmCode),
	})
	const { data: realmRoles = [] } = useQuery({
		enabled: Boolean(realmCode),
		queryFn: () => getRealmRoles(realmCode),
		queryKey: realmRoleKeys.list(realmCode),
	})
	const { data: miniAppsPage } = useQuery({
		enabled: Boolean(realmCode),
		queryFn: () => getRealmMiniApps(realmCode),
		queryKey: realmMiniAppKeys.list(realmCode),
	})
	const createMiniAppMutation = useMutation({
		mutationFn: (values: RealmMiniAppFormValues) =>
			connectRealmMiniApp(realmCode, values),
		onSuccess: miniApp => {
			void queryClient.invalidateQueries({
				queryKey: realmMiniAppKeys.lists(realmCode),
			})
			void queryClient.invalidateQueries({
				queryKey: realmMiniAppKeys.detail(realmCode, miniApp.code),
			})
			void queryClient.invalidateQueries({ queryKey: realmKeys.lists() })
			void queryClient.invalidateQueries({
				queryKey: realmKeys.detail(realmCode),
			})
			message.success(`MiniApp ${miniApp.code} создан`)
			navigate(buildRealmMiniappRoute(realmCode, miniApp.code))
		},
		onError: () => {
			message.error('Не удалось создать MiniApp')
		},
	})
	const permissions = getRealmMiniAppPermissions(user, realmCode)

	if (isRealmLoading) {
		return null
	}

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	if (!permissions.canCreate) {
		return <Navigate to={ROUTES.FORBIDDEN} />
	}

	const handleFinish = (values: RealmMiniAppFormValues) => {
		createMiniAppMutation.mutate(values)
	}

	const existingCodes = (miniAppsPage?.items ?? [])
		.filter(
			miniApp =>
				miniApp.realmCode === realm.code && miniApp.status !== 'DELETED',
		)
		.map(miniApp => miniApp.code)

	return (
		<div className={`container ${styles.wrapper} ${styles.formWrapper}`}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Realm / {realm.name}</Text>
					<Title className={styles.mainTitle} level={1}>
						Создать MiniApp
					</Title>
				</div>
			</div>

			<Card className={`${styles.card} ${styles.formCard}`}>
				<RealmMiniAppForm
					existingCodes={existingCodes}
					initialValues={initialValues}
					mode='create'
					onCancel={() => navigate(buildRealmMiniappsRoute(realm.code))}
					onFinish={handleFinish}
					permissions={permissions}
					realmCode={realm.code}
					realmRoles={realmRoles}
					submitLabel='Создать MiniApp'
				/>
			</Card>
		</div>
	)
}
