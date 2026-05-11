import { buildRealmOverviewRoute } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useNavigate } from 'react-router-dom'

interface OpenRealmButtonProps {
	onDone?: () => void
	realmCode: string
	variant?: 'button' | 'menu-item'
}

export const OpenRealmButton = ({
	onDone,
	realmCode,
	variant = 'button',
}: OpenRealmButtonProps) => {
	const navigate = useNavigate()

	const handleOpen = () => {
		navigate(buildRealmOverviewRoute(realmCode))
		onDone?.()
	}

	return (
		<ButtonField
			onClick={handleOpen}
			type={variant === 'menu-item' ? 'text' : 'default'}
		>
			Открыть
		</ButtonField>
	)
}
