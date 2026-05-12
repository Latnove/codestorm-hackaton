import type { RealmMiniAppFormValues } from '@/entities/miniapp'
import { getRealmMiniAppPermissions, useUserStore } from '@/entities/user'
import { useRealmMiniAppsStore } from '@/features/miniapps'
import {
	selectRealmRolesByRealmCode,
	useRealmRolesStore,
	useRealmsStore,
} from '@/features/realms'
import {
	buildRealmMiniappRoute,
	buildRealmMiniappsRoute,
	ROUTES,
} from '@/shared/config'
import { Card, message, Typography } from 'antd'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
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
	const { realmCode = '' } = useParams()
	const user = useUserStore(state => state.user)
	const realm = useRealmsStore(state =>
		state.realms.find(item => item.code === realmCode),
	)
	const realmRoles = useRealmRolesStore(
		useShallow(selectRealmRolesByRealmCode(realmCode)),
	)
	const miniApps = useRealmMiniAppsStore(state => state.miniApps)
	const createRealmMiniApp = useRealmMiniAppsStore(
		state => state.createRealmMiniApp,
	)
	const permissions = getRealmMiniAppPermissions(user, realmCode)

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	if (!permissions.canCreate) {
		return <Navigate to={ROUTES.FORBIDDEN} />
	}

	const handleFinish = (values: RealmMiniAppFormValues) => {
		const miniApp = createRealmMiniApp(realm.code, values)
		message.success(`MiniApp ${miniApp.code} создан`)
		navigate(buildRealmMiniappRoute(realm.code, miniApp.code))
	}

	const existingCodes = miniApps
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
