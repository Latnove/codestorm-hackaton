import {
	RealmRolesList,
	selectRealmRolesByRealmCode,
	useRealmRolesStore,
	useRealmsStore,
} from '@/features/realms'
import { RealmRoleFormButton } from '@/features/realms/create-role'
import {
	buildRealmOverviewRoute,
	buildRealmRoleMappingRoute,
	buildRealmRolesRoute,
	ROUTES,
} from '@/shared/config'
import { pluralize } from '@/shared/lib/pluralize'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Card, Space } from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './RealmRolesPage.module.css'

export const RealmRolesPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { realmCode = '' } = useParams()
	const realm = useRealmsStore(state =>
		state.realms.find(item => item.code === realmCode),
	)
	const roles = useRealmRolesStore(
		useShallow(selectRealmRolesByRealmCode(realmCode)),
	)
	const roleCodes = useMemo(() => roles.map(role => role.code), [roles])
	const rolesCountLabel = pluralize(roles.length, ['роль', 'роли', 'ролей'])
	const openCreateOnMount = location.pathname.endsWith('/roles/create')

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	return (
		<div className={`container ${styles.wrapper}`}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Realm / {realm.name}</Text>
					<Title className={styles.mainTitle} level={1}>
						Realm Roles
					</Title>
				</div>

				<Space wrap>
					<ButtonField
						onClick={() => navigate(buildRealmOverviewRoute(realm.code))}
					>
						В Realm
					</ButtonField>
					<ButtonField
						onClick={() => navigate(buildRealmRoleMappingRoute(realm.code))}
					>
						К Mapping
					</ButtonField>
					<RealmRoleFormButton
						existingRoleCodes={roleCodes}
						onDone={
							openCreateOnMount
								? () =>
										navigate(buildRealmRolesRoute(realm.code), {
											replace: true,
										})
								: undefined
						}
						openOnMount={openCreateOnMount}
						openOnCreateParam
						realmCode={realm.code}
						triggerProps={{ type: 'primary' }}
					>
						Создать роль
					</RealmRoleFormButton>
				</Space>
			</div>

			<Card className={styles.card}>
				<div className={styles.cardHeader}>
					<div>
						<Title className={styles.sectionTitle} level={3}>
							Роли конечных пользователей
						</Title>
						<Text type='secondary'>
							{roles.length} {rolesCountLabel} в текущем Realm
						</Text>
					</div>
				</div>

				<RealmRolesList realmCode={realm.code} roles={roles} />
			</Card>
		</div>
	)
}
