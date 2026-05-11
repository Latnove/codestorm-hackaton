import { CreateRealmForm } from '@/features/realms/create-realm'
import Title from 'antd/es/typography/Title'
import clsx from 'clsx'
import { useState } from 'react'
import styles from './CreateRealmPage.module.css'

export const CreateRealmPage = () => {
	const [isCreated, setIsCreated] = useState<boolean>(false)

	return (
		<div className='container'>
			<div className={styles.header}>
				<Title
					className={clsx(styles.title, isCreated && styles.leftedTitle)}
					level={1}
				>
					{!isCreated ? 'Форма для создания Realm' : 'Вы успешно создали Realm'}
				</Title>
			</div>

			<CreateRealmForm onCreate={() => setIsCreated(true)} />
		</div>
	)
}
