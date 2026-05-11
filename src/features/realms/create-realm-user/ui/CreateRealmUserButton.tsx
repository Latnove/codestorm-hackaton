import { ButtonField } from '@/shared/ui/ButtonField'
import { message } from 'antd'
import styles from './CreateRealmUserButton.module.css'

interface CreateRealmUserButtonProps {
	realmCode: string
}

export const CreateRealmUserButton = ({
	realmCode,
}: CreateRealmUserButtonProps) => {
	return (
		<ButtonField
			className={styles.button}
			onClick={() => {
				message.info(`Create user для ${realmCode} будет добавлен следующим шагом`)
			}}
		>
			Create user
		</ButtonField>
	)
}
