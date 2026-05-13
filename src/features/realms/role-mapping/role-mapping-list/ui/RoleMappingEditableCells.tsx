import type { RoleMappingFormValues } from '@/entities/realm'
import { Input, Select, Tag, Typography } from 'antd'
import type { RoleMappingRow } from '../lib/roleMappingList'
import styles from './RoleMappingList.module.css'

const { Text } = Typography

interface RoleMappingEditableCellProps {
	editingId: string | null
	realmRoleOptions: Array<{ label: string; value: string }>
	row: RoleMappingRow
	updateValue: <TKey extends keyof RoleMappingFormValues>(
		key: TKey,
		value: RoleMappingFormValues[TKey],
	) => void
	values: RoleMappingFormValues
}

export const RoleMappingExternalRoleCell = ({
	editingId,
	row,
	updateValue,
	values,
}: RoleMappingEditableCellProps) => {
	if (row.id !== editingId || !row.isDraft) {
		return <Text className={styles.externalRole}>{row.externalRole}</Text>
	}

	return (
		<Input
			className={styles.control}
			onChange={event => updateValue('externalRole', event.target.value)}
			placeholder='MB_PREMIUM'
			value={values.externalRole}
		/>
	)
}

export const RoleMappingRealmRoleCell = ({
	editingId,
	realmRoleOptions,
	row,
	updateValue,
	values,
}: RoleMappingEditableCellProps) => {
	if (row.id !== editingId) {
		return <Tag color='geekblue'>{row.realmRoleCode}</Tag>
	}

	return (
		<Select<string>
			className={styles.control}
			onChange={value => updateValue('realmRoleCode', value)}
			options={realmRoleOptions}
			placeholder='Выберите Realm Role'
			value={values.realmRoleCode}
		/>
	)
}
