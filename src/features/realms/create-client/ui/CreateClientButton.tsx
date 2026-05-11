import { ButtonField } from '@/shared/ui/ButtonField'
import { message } from 'antd'

interface CreateClientButtonProps {
	realmCode: string
}

export const CreateClientButton = ({ realmCode }: CreateClientButtonProps) => {
	return (
		<ButtonField
			onClick={() => {
				message.info(
					`Create Client для ${realmCode} будет добавлен следующим шагом`,
				)
			}}
		>
			Создать клиента
		</ButtonField>
	)
}
