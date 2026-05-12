import {
	RoleMappingList,
	selectRealmRolesByRealmCode,
	selectRoleMappingsByRealmCode,
	useRealmRolesStore,
	useRealmsStore,
	useRoleMappingsStore,
} from '@/features/realms'
import {
	buildRealmOverviewRoute,
	buildRealmRolesRoute,
	ROUTES,
} from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Alert, Card, Space } from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './RoleMappingPage.module.css'

export const RoleMappingPage = () => {
	const navigate = useNavigate()
	const { realmCode = '' } = useParams()
	const realm = useRealmsStore(state =>
		state.realms.find(item => item.code === realmCode),
	)
	const realmRoles = useRealmRolesStore(
		useShallow(selectRealmRolesByRealmCode(realmCode)),
	)
	const mappings = useRoleMappingsStore(
		useShallow(selectRoleMappingsByRealmCode(realmCode)),
	)

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	return (
		<div className={`container ${styles.wrapper}`}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Realm / {realm.name}</Text>
					<Title className={styles.mainTitle} level={1}>
						Role Mapping
					</Title>
				</div>

				<Space wrap>
					<ButtonField
						onClick={() => navigate(buildRealmOverviewRoute(realm.code))}
					>
						В Realm
					</ButtonField>
					<ButtonField
						onClick={() => navigate(buildRealmRolesRoute(realm.code))}
					>
						К ролям
					</ButtonField>
				</Space>
			</div>

			<Alert
				className={styles.info}
				description='Host-приложение может присылать свои роли, например MB_PREMIUM. Платформа преобразует их во внутренние Realm Roles. MiniApp использует только Realm Roles для настройки доступа.'
				showIcon
				type='info'
			/>

			<Card className={styles.card}>
				<RoleMappingList
					mappings={mappings}
					realmCode={realm.code}
					realmRoles={realmRoles}
				/>
			</Card>
		</div>
	)
}
