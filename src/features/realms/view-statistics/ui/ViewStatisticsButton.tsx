import { buildDashboardRoute } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useNavigate } from 'react-router-dom'

interface ViewStatisticsButtonProps {
	realmCode: string
}

export const ViewStatisticsButton = ({
	realmCode,
}: ViewStatisticsButtonProps) => {
	const navigate = useNavigate()

	return (
		<ButtonField
			onClick={() => {
				navigate(buildDashboardRoute({ realmCode }))
			}}
		>
			Посмотреть статистику
		</ButtonField>
	)
}
