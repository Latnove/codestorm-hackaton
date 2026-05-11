import { Roles, useUserStore } from '@/entities/user'
import { useRealmsStore } from '@/features/realms/realms-catalog/model'
import { ROUTES } from '@/shared/config'
import { RealmManageActions } from '@/widgets/realm-manage-actions'
import { RealmOverview } from '@/widgets/realm-overview'
import { RealmUsersList } from '@/widgets/realm-users-list'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { Navigate, useParams } from 'react-router-dom'
import styles from './RealmDetailsPage.module.css'

export const RealmDetailsPage = () => {
	const { realmCode = '' } = useParams()
	const user = useUserStore(state => state.user)
	const realm = useRealmsStore(state =>
		state.realms.find(item => item.code === realmCode),
	)

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	const isRoot = user?.role === Roles.ROOT
	const canEditUsers = user?.role === Roles.ROOT || user?.role === Roles.ADMIN

	return (
		<div className={'container'}>
			<div className={styles.header}>
				<div>
					<Text type='secondary'>Обзор Realm</Text>
					<Title level={1} className={styles.mainTitle}>
						{realm.name}
					</Title>
				</div>
			</div>

			<div className={styles.content}>
				<RealmOverview
					manageActions={
						isRoot ? (
							<RealmManageActions
								afterDeletePath={ROUTES.REALMS}
								realm={realm}
								variant='inline'
							/>
						) : null
					}
					realm={realm}
				/>

				<RealmUsersList
					canCreateUser={isRoot}
					canEditUsers={canEditUsers}
					realmCode={realm.code}
				/>
			</div>
		</div>
	)
}
