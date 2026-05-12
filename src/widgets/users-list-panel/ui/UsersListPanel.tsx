import type { PlatformUser } from '@/entities/user'
import { UsersFilters, UsersList } from '@/features/users'
import { buildUserRoute, ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { UserManageActions } from '@/widgets/user-manage-actions'
import { Card, Empty, Space } from 'antd'
import Text from 'antd/es/typography/Text'
import Title from 'antd/es/typography/Title'
import { useNavigate } from 'react-router-dom'

import styles from './UsersListPanel.module.css'

interface UsersListPanelProps {
	description?: string
	showFilters?: boolean
	title?: string
	users: PlatformUser[]
}

export const UsersListPanel = ({
	description,
	showFilters = false,
	title,
	users,
}: UsersListPanelProps) => {
	const navigate = useNavigate()

	return (
		<Card className={styles.card}>
			{title ? (
				<div className={styles.header}>
					<div>
						<Title className={styles.title} level={3}>
							{title}
						</Title>

						{description ? <Text type='secondary'>{description}</Text> : null}
					</div>

					<ButtonField
						className={styles.createButton}
						onClick={() => navigate(ROUTES.USER_CREATE)}
						type='default'
					>
						Создать пользователя
					</ButtonField>
				</div>
			) : null}

			<Space
				className={styles.content}
				direction='vertical'
				size={20}
				style={{ width: '100%' }}
			>
				{showFilters ? <UsersFilters /> : null}

				{users.length > 0 ? (
					<UsersList
						data={users}
						onOpen={userId => navigate(buildUserRoute(userId))}
						renderActions={user => <UserManageActions user={user} />}
					/>
				) : (
					<Empty className={styles.empty} description='Users not found' />
				)}
			</Space>
		</Card>
	)
}
