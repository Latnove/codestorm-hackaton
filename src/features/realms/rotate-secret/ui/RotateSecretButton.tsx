import { generateSecret } from '@/features/realms/create-realm/lib'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Alert, Input, message, Modal, Typography } from 'antd'
import { useState } from 'react'
import styles from './RotateSecretButton.module.css'

const { Text } = Typography

interface RotateSecretButtonProps {
	clientId?: string
	realmCode: string
}

export const RotateSecretButton = ({
	clientId,
	realmCode,
}: RotateSecretButtonProps) => {
	const [modal, contextHolder] = Modal.useModal()
	const [secret, setSecret] = useState<string | null>(null)

	const handleCopy = async () => {
		if (!secret) {
			return
		}

		await navigator.clipboard.writeText(secret)
		message.success('clientSecret скопирован')
	}

	const handleRotate = () => {
		modal.confirm({
			cancelText: 'Отмена',
			centered: true,
			content:
				'После ротации старый clientSecret перестанет работать. Его нужно будет обновить в backend-сервисе host-приложения.',
			okText: 'Обновить Secret',
			onOk: async () => {
				await Promise.resolve()
				setSecret(generateSecret())
				message.success('clientSecret обновлён')
			},
			title: 'Обновить clientSecret?',
		})
	}

	return (
		<>
			{contextHolder}
			<ButtonField onClick={handleRotate} type='text'>
				Обновить clientSecret
			</ButtonField>

			<Modal
				centered
				className={styles.secretModal}
				destroyOnClose
				okText='Понятно'
				onCancel={() => setSecret(null)}
				onOk={() => setSecret(null)}
				open={Boolean(secret)}
				title='Новый clientSecret'
				width={620}
			>
				<div className={styles.content}>
					<Alert
						message='Сохраните secret сейчас. Старый clientSecret больше не работает, а новый будет показан только один раз.'
						showIcon
						type='warning'
					/>

					<Text type='secondary'>
						Realm: {realmCode}
						{clientId ? ` · Client: ${clientId}` : ''}
					</Text>

					<div className={styles.secretRow}>
						<Input
							className={styles.secretInput}
							readOnly
							value={secret ?? ''}
						/>
						<ButtonField className={styles.copyButton} onClick={handleCopy}>
							Скопировать
						</ButtonField>
					</div>
				</div>
			</Modal>
		</>
	)
}
