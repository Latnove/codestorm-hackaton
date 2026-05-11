import { ButtonField } from '@/shared/ui/ButtonField'
import { message } from 'antd'

interface ViewStatisticsButtonProps {
	realmCode: string
}

export const ViewStatisticsButton = ({
	realmCode,
}: ViewStatisticsButtonProps) => {
	return (
		<ButtonField
			onClick={() => {
				message.info(
					`View Statistics для ${realmCode} будет добавлен следующим шагом`,
				)
			}}
		>
			Посмотреть статистику
		</ButtonField>
	)
}
