import { ButtonField } from '@/shared/ui/ButtonField'
import { message } from 'antd'

interface ConnectMiniAppButtonProps {
	realmCode: string
}

export const ConnectMiniAppButton = ({
	realmCode,
}: ConnectMiniAppButtonProps) => {
	return (
		<ButtonField
			onClick={() => {
				message.info(
					`Connect MiniApp для ${realmCode} будет добавлен следующим шагом`,
				)
			}}
		>
			Перейти в MiniApps
		</ButtonField>
	)
}
