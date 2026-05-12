import { buildRealmRolesRoute } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useNavigate } from 'react-router-dom'

interface CreateRoleButtonProps {
	realmCode: string
}

export const CreateRoleButton = ({ realmCode }: CreateRoleButtonProps) => {
	const navigate = useNavigate()

	return (
		<ButtonField
			onClick={() => {
				navigate(`${buildRealmRolesRoute(realmCode)}?create=1`)
			}}
		>
			Создать роль
		</ButtonField>
	)
}
