import {
	createAdminRealm,
	realmKeys,
	type CreateRealmFormValues,
	type RealmCredentials,
} from '@/entities/realm'
import { buildRealmOverviewRoute } from '@/shared/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CreateRealmForm.module.css'
import { RealmCreateFormFields } from './RealmCreateFormFields'
import { RealmCredentialsPanel } from './RealmCredentialsPanel'

interface ICreateRealmForm {
	onCreate?: () => void
}

export const CreateRealmForm: FC<ICreateRealmForm> = ({ onCreate }) => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [messageApi, contextHolder] = message.useMessage()
	const [credentials, setCredentials] = useState<RealmCredentials | null>(null)
	const createRealmMutation = useMutation({
		mutationFn: createAdminRealm,
		onSuccess: result => {
			setCredentials(result.credentials)
			onCreate?.()
			void queryClient.invalidateQueries({ queryKey: realmKeys.lists() })
			void queryClient.invalidateQueries({
				queryKey: realmKeys.detail(result.realm.code),
			})
			messageApi.success('Realm создан')
		},
		onError: () => {
			messageApi.error('Не удалось создать Realm')
		},
	})

	const copyValue = async (label: string, value: string) => {
		try {
			await navigator.clipboard.writeText(value)
			messageApi.success(`${label} copied`)
		} catch {
			messageApi.error(`Не удалось скопировать ${label}`)
		}
	}

	const handleCreate = (values: CreateRealmFormValues) => {
		createRealmMutation.mutate(values)
	}

	return (
		<>
			{contextHolder}

			<div className={credentials ? styles.layoutCreated : styles.layout}>
				<RealmCreateFormFields
					disabled={Boolean(credentials)}
					onCancel={() => navigate(-1)}
					onCreate={handleCreate}
				/>

				{credentials && (
					<RealmCredentialsPanel
						credentials={credentials}
						onCopy={copyValue}
						onOpen={() =>
							navigate(buildRealmOverviewRoute(credentials.realmCode))
						}
					/>
				)}
			</div>
		</>
	)
}
