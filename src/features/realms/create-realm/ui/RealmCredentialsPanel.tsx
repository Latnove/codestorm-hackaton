import type { RealmCredentials } from '@/features/realms/create-realm/lib'
import { downloadCredentials } from '@/features/realms/create-realm/lib'
import { ButtonField } from '@/shared/ui/ButtonField'
import { CopyOutlined } from '@ant-design/icons'
import { Alert, Card, Space, Typography } from 'antd'
import type { FC } from 'react'
import styles from './CreateRealmForm.module.css'

const { Text, Title } = Typography

interface RealmCredentialsPanelProps {
	credentials: RealmCredentials
	onCopy: (label: string, value: string) => void
	onOpen: () => void
}

const credentialsRows = [
	{ key: 'realmCode', label: 'realmCode' },
	{ key: 'clientId', label: 'clientId' },
	{ key: 'clientSecret', label: 'clientSecret' },
] as const

export const RealmCredentialsPanel: FC<RealmCredentialsPanelProps> = ({
	credentials,
	onCopy,
	onOpen,
}) => {
	return (
		<Card className={styles.credentialsCard}>
			<div className={styles.header}>
				<Title level={3}>Credentials</Title>
				<Text type='secondary'>Учетные данные нового Realm</Text>
			</div>

			<Alert
				className={styles.alert}
				description='Сохраните clientSecret сейчас. После закрытия окна он больше не будет доступен.'
				showIcon
				type='warning'
			/>

			<div className={styles.credentialsList}>
				{credentialsRows.map(row => (
					<div className={styles.credentialRow} key={row.key}>
						<Text className={styles.credentialLabel}>{row.label}</Text>
						<Text className={styles.credentialValue}>
							{credentials[row.key]}
						</Text>
						<ButtonField
							className={styles.copyButton}
							onClick={() => onCopy(row.label, credentials[row.key])}
							title={`Copy ${row.label}`}
							type='text'
							icon={<CopyOutlined />}
						/>
					</div>
				))}
			</div>

			<Space className={styles.credentialsActions} wrap>
				<ButtonField
					onClick={() => downloadCredentials(credentials)}
					className={styles.downloadButton}
				>
					Скачать в виде JSON
				</ButtonField>

				<ButtonField
					className={styles.openButton}
					onClick={onOpen}
					type='primary'
				>
					Открыть страницу Realm
				</ButtonField>
			</Space>
		</Card>
	)
}
