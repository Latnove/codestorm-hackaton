import { realmKeys, rotateRealmClientSecret } from '@/entities/realm'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
	const queryClient = useQueryClient()
	const [modal, contextHolder] = Modal.useModal()
	const [secret, setSecret] = useState<string | null>(null)
	const rotateSecretMutation = useMutation({
		mutationFn: () => {
			if (!clientId) {
				throw new Error('clientId is required')
			}

			return rotateRealmClientSecret(realmCode, clientId)
		},
		onSuccess: response => {
			setSecret(response.clientSecret)
			void queryClient.invalidateQueries({
				queryKey: realmKeys.clients(realmCode),
			})
			message.success('clientSecret обновлён')
		},
		onError: () => {
			message.error('Не удалось обновить clientSecret')
		},
	})

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
				await rotateSecretMutation.mutateAsync()
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
