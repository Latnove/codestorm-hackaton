import { type CreateRealmFormValues } from '@/entities/realm'
import {
	buildRealm,
	generateSecret,
	type RealmCredentials,
} from '@/features/realms/create-realm/lib'
import { useRealmsStore } from '@/features/realms/realms-catalog/model'
import { buildRealmOverviewRoute } from '@/shared/config'
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
	const [messageApi, contextHolder] = message.useMessage()
	const createRealm = useRealmsStore(state => state.createRealm)
	const realms = useRealmsStore(state => state.realms)
	const [credentials, setCredentials] = useState<RealmCredentials | null>(null)

	const copyValue = async (label: string, value: string) => {
		try {
			await navigator.clipboard.writeText(value)
			messageApi.success(`${label} copied`)
		} catch {
			messageApi.error(`Не удалось скопировать ${label}`)
		}
	}

	const handleCreate = (values: CreateRealmFormValues) => {
		const codeExists = realms.some(realm => realm.code === values.code)

		if (codeExists) {
			messageApi.error('Realm с таким code уже существует')
			return
		}

		const realm = buildRealm(values)
		const createdCredentials = {
			clientId: realm.metadata.clientId,
			clientSecret: generateSecret(),
			realmCode: realm.code,
		}

		createRealm(realm)
		setCredentials(createdCredentials)
		onCreate?.()
		messageApi.success('Realm создан')
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
