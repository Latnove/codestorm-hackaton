import { ButtonField } from '@/shared/ui/ButtonField'
import { message } from 'antd'

interface CreateRoleButtonProps {
	realmCode: string
}

export const CreateRoleButton = ({ realmCode }: CreateRoleButtonProps) => {
	return (
		<ButtonField
			onClick={() => {
				message.info(
					`Create Role для ${realmCode} будет добавлен следующим шагом`,
				)
			}}
		>
			Создать роль
		</ButtonField>
	)
}
