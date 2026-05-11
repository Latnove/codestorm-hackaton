import { ButtonField } from '@/shared/ui/ButtonField'
import { message } from 'antd'

interface EditRealmUserButtonProps {
	username: string
}

export const EditRealmUserButton = ({ username }: EditRealmUserButtonProps) => {
	return (
		<ButtonField
			onClick={() => {
				message.info(`Edit ${username} будет добавлен следующим шагом`)
			}}
			size='small'
		>
			Edit
		</ButtonField>
	)
}
