import { ButtonField } from '@/shared/ui/ButtonField'
import styles from './RoleMappingList.module.css'

interface RoleMappingEditActionsProps {
	onCancel: () => void
	onSave: () => void
}

export const RoleMappingEditActions = ({
	onCancel,
	onSave,
}: RoleMappingEditActionsProps) => {
	return (
		<div className={styles.editActions}>
			<ButtonField onClick={onSave} size='small' type='primary'>
				Сохранить
			</ButtonField>
			<ButtonField onClick={onCancel} size='small'>
				Отмена
			</ButtonField>
		</div>
	)
}
