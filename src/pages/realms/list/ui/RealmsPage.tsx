import { Roles, useUserStore } from '@/entities/user'
import { getAdminRealms, realmKeys } from '@/entities/realm'
import {
	RealmsFilters,
	RealmsList,
	useRealmsFiltersState,
	useRealmsStore,
} from '@/features/realms'
import { buildRealmOverviewRoute, ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { RealmManageActions } from '@/widgets/realm-manage-actions'
import { Card, Space } from 'antd'
import { useQuery } from '@tanstack/react-query'
import Title from 'antd/es/typography/Title'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './RealmsPage.module.css'

export const RealmsPage = () => {
	const navigate = useNavigate()
	const user = useUserStore(state => state.user)

	const filters = useRealmsStore(useShallow(useRealmsFiltersState))
	const { data: realmsPage, isLoading } = useQuery({
		queryFn: () => getAdminRealms(filters),
		queryKey: realmKeys.list(filters),
	})
	const realms = realmsPage?.items ?? []
	const isRoot = user?.role === Roles.ROOT

	const openRealm = (realmCode: string) => {
		navigate(buildRealmOverviewRoute(realmCode))
	}

	return (
		<div className={clsx('container', styles.wrapper)}>
			<Space
				align='center'
				style={{ justifyContent: 'space-between', width: '100%' }}
			>
				<div>
					<Title level={1}>Realms</Title>
				</div>

				{isRoot && (
					<ButtonField
						className={styles.createButton}
						onClick={() => navigate(ROUTES.REALM_CREATE)}
					>
						<span className={styles.createButtonIcon}>+</span>
						Создать Realm
					</ButtonField>
				)}
			</Space>

			<Card>
				<Space
					direction='vertical'
					size={20}
					style={{ width: '100%' }}
					className={styles.cardSpace}
				>
					<RealmsFilters />

					<RealmsList
						data={realms}
						loading={isLoading}
						onOpen={openRealm}
						renderActions={
							isRoot
								? realm => <RealmManageActions realm={realm} showOpen />
								: undefined
						}
					/>
				</Space>
			</Card>
		</div>
	)
}
