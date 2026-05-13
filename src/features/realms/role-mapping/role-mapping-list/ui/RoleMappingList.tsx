import type { ExternalRoleMapping, RealmRole } from '@/entities/realm'
import { pluralize } from '@/shared/lib/pluralize'
import { ButtonField } from '@/shared/ui/ButtonField'
import { Table, Tooltip, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import { useMemo } from 'react'
import type { RoleMappingRow } from '../lib/roleMappingList'
import { useRoleMappingEditor } from '../lib/useRoleMappingEditor'
import { getRoleMappingColumns } from './getRoleMappingColumns'
import styles from './RoleMappingList.module.css'

const { Text } = Typography

interface RoleMappingListProps {
	mappings: ExternalRoleMapping[]
	realmCode: string
	realmRoles: RealmRole[]
}

export const RoleMappingList = ({
	mappings,
	realmCode,
	realmRoles,
}: RoleMappingListProps) => {
	const {
		cancelEdit,
		canCreate,
		dataSource,
		editingId,
		realmRoleOptions,
		saveRow,
		saving,
		startCreate,
		startEdit,
		updateValue,
		values,
	} = useRoleMappingEditor({ mappings, realmCode, realmRoles })
	const mappingLabel = pluralize(mappings.length, [
		'связь',
		'связи',
		'связей',
	])
	const createDisabledReason =
		realmRoles.length === 0
			? 'Сначала создайте Realm Role'
			: 'Завершите редактирование текущей строки'

	const columns = useMemo(
		() =>
			getRoleMappingColumns({
				cancelEdit,
				editingId,
				realmRoleOptions,
				saveRow,
				saving,
				startEdit,
				updateValue,
				values,
			}),
		[
			cancelEdit,
			editingId,
			realmRoleOptions,
			saveRow,
			saving,
			startEdit,
			updateValue,
			values,
		],
	)

	return (
		<div className={styles.wrapper}>
			<div className={styles.toolbar}>
				<div>
					<Title className={styles.sectionTitle} level={3}>
						Связь external roles с Realm Roles
					</Title>
					<Text type='secondary'>
						{mappings.length} {mappingLabel} в текущем Realm
					</Text>
				</div>
				<Tooltip title={!canCreate ? createDisabledReason : undefined}>
					<span className={styles.createButtonWrap}>
						<ButtonField
							disabled={!canCreate}
							onClick={startCreate}
							type='primary'
						>
							Добавить mapping
						</ButtonField>
					</span>
				</Tooltip>
			</div>

			<Table<RoleMappingRow>
				className={styles.table}
				columns={columns}
				dataSource={dataSource}
				locale={{ emptyText: 'Mapping не найден' }}
				pagination={false}
				rowKey='id'
				tableLayout='fixed'
				scroll={{ x: 920 }}
			/>
		</div>
	)
}
