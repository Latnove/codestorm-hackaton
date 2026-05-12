import { buildRealmMiniappsRoute } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useNavigate } from 'react-router-dom'

interface ConnectMiniAppButtonProps {
	realmCode: string
}

export const ConnectMiniAppButton = ({
	realmCode,
}: ConnectMiniAppButtonProps) => {
	const navigate = useNavigate()

	return (
		<ButtonField
			onClick={() => {
				navigate(buildRealmMiniappsRoute(realmCode))
			}}
		>
			Перейти в MiniApps
		</ButtonField>
	)
}
