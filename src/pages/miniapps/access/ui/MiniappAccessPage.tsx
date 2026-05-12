import type { RealmMiniAppFormValues } from '@/entities/miniapp'
import { getRealmMiniAppPermissions, useUserStore } from '@/entities/user'
import {
	selectRealmMiniApp,
	useRealmMiniAppsStore,
} from '@/features/miniapps'
import {
	selectRealmRolesByRealmCode,
	useRealmRolesStore,
	useRealmsStore,
} from '@/features/realms'
import {
	buildRealmMiniappRoute,
	buildRealmMiniappsRoute,
	buildRealmOverviewRoute,
	ROUTES,
} from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Alert, Card, message, Space, Typography } from 'antd'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import {
	buildRealmMiniAppFormValues,
	RealmMiniAppForm,
} from '../../shared/ui/RealmMiniAppForm'
import styles from '../../shared/ui/RealmMiniAppsPage.module.css'

const { Text, Title } = Typography

export const MiniappAccessPage = () => {
	const navigate = useNavigate()
	const { miniAppCode = '', realmCode = '' } = useParams()
	const user = useUserStore(state => state.user)
	const realm = useRealmsStore(state =>
		state.realms.find(item => item.code === realmCode),
	)
	const miniApp = useRealmMiniAppsStore(
		selectRealmMiniApp(realmCode, miniAppCode),
	)
	const realmRoles = useRealmRolesStore(
		useShallow(selectRealmRolesByRealmCode(realmCode)),
	)
	const updateRealmMiniApp = useRealmMiniAppsStore(
		state => state.updateRealmMiniApp,
	)
	const permissions = getRealmMiniAppPermissions(user, realmCode)

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	if (!permissions.canEditAccess) {
		return <Navigate to={ROUTES.FORBIDDEN} />
	}

	if (!miniApp) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	const handleFinish = (values: RealmMiniAppFormValues) => {
		updateRealmMiniApp(realm.code, miniApp.code, {
			...buildRealmMiniAppFormValues(miniApp),
			accessType: values.accessType,
			requiredRoles: values.requiredRoles,
			roleMatchMode: values.roleMatchMode,
		})
		message.success(`Политика доступа для ${miniApp.code} обновлена`)
		navigate(buildRealmMiniappRoute(realm.code, miniApp.code))
	}

	return (
		<div className={`container ${styles.wrapper} ${styles.formWrapper}`}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Realm / {realm.name}</Text>
					<Title className={styles.mainTitle} level={1}>
						Доступ MiniApp
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

			<Alert
				message='Политика доступа использует только realmRoles. externalRoles напрямую в MiniApp не выбираются.'
				showIcon
				type='info'
			/>

			<Card className={`${styles.card} ${styles.formCard}`}>
				<RealmMiniAppForm
					initialValues={buildRealmMiniAppFormValues(miniApp)}
					mode='access'
					onCancel={() =>
						navigate(buildRealmMiniappRoute(realm.code, miniApp.code))
					}
					onFinish={handleFinish}
					permissions={permissions}
					realmCode={realm.code}
					realmRoles={realmRoles}
					submitLabel='Сохранить доступ'
				/>
			</Card>
		</div>
	)
}
