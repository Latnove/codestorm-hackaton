import { ButtonField } from '@/shared/ui/ButtonField'
import styles from './RoleMappingList.module.css'

interface RoleMappingEditActionsProps {
	loading?: boolean
	onCancel: () => void
	onSave: () => void
}

export const RoleMappingEditActions = ({
	loading = false,
	onCancel,
	onSave,
}: RoleMappingEditActionsProps) => {
	return (
		<div className={styles.editActions}>
			<ButtonField
				loading={loading}
				onClick={onSave}
				size='small'
				type='primary'
			>
				Сохранить
			</ButtonField>
			<ButtonField onClick={onCancel} size='small'>
				Отмена
			</ButtonField>
		</div>
	)
}
