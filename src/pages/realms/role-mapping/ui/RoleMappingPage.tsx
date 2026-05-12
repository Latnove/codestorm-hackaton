import {
	getAdminRealm,
	getRealmRoles,
	getRoleMappings,
	realmKeys,
	realmRoleKeys,
	roleMappingKeys,
} from '@/entities/realm'
import { RoleMappingList } from '@/features/realms'
import {
	buildRealmOverviewRoute,
	buildRealmRolesRoute,
	ROUTES,
} from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useQuery } from '@tanstack/react-query'
import { Alert, Card, Space } from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import styles from './RoleMappingPage.module.css'

export const RoleMappingPage = () => {
	const navigate = useNavigate()
	const { realmCode = '' } = useParams()
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
	const { data: mappings = [] } = useQuery({
		enabled: Boolean(realmCode),
		queryFn: () => getRoleMappings(realmCode),
		queryKey: roleMappingKeys.list(realmCode),
	})

	if (isRealmLoading) {
		return null
	}

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
