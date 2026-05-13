import { getAdminRealm, realmKeys } from '@/entities/realm'
import { Roles, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { RealmOverview } from '@/widgets/realm-overview'
import { RealmUsersList } from '@/widgets/realm-users-list'
import { useQuery } from '@tanstack/react-query'
import { Card, Skeleton } from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { Navigate, useParams } from 'react-router-dom'
import styles from './RealmDetailsPage.module.css'

export const RealmDetailsPage = () => {
	const { realmCode = '' } = useParams()
	const user = useUserStore(state => state.user)
	const { data: realm, isLoading } = useQuery({
		enabled: Boolean(realmCode),
		queryFn: () => getAdminRealm(realmCode),
		queryKey: realmKeys.detail(realmCode),
	})

	if (isLoading) {
		return (
			<div className='container'>
				<Card>
					<Skeleton active paragraph={{ rows: 8 }} />
				</Card>
			</div>
		)
	}

	if (!realm) {
		return <Navigate to={ROUTES.NOT_FOUND} />
	}

	const isRoot = user?.role === Roles.ROOT

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
				<RealmOverview realm={realm} isRoot={isRoot} />

				{isRoot && <RealmUsersList realmCode={realm.code} />}
			</div>
		</div>
	)
}
