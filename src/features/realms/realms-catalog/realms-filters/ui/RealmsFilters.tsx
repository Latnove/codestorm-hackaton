import { realmStatusLabels, type RealmStatus } from '@/entities/realm'
import {
	useRealmsActions,
	useRealmsFiltersState,
	useRealmsStore,
} from '@/features/realms/realms-catalog/model'
import { SelectField } from '@/shared/ui/SelectField'
import { useEffect, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { useShallow } from 'zustand/react/shallow'

import { SearchField } from '@/shared/ui/SearchField'
import clsx from 'clsx'
import styles from './RealmsFilters.module.css'

type RealmsFiltersForm = {
	search: string
	status: RealmStatus | 'ALL'
}

interface IRealmsFilters {
	className?: string
}

const statusOptions: {
	label: string
	value: RealmStatus | 'ALL'
}[] = [
	{ label: 'Все статусы', value: 'ALL' },
	{ label: realmStatusLabels.ACTIVE, value: 'ACTIVE' },
	{ label: realmStatusLabels.DISABLED, value: 'DISABLED' },
]

export const RealmsFilters: FC<IRealmsFilters> = ({ className }) => {
	const { search, status } = useRealmsStore(useShallow(useRealmsFiltersState))

	const { setSearch, setStatus } = useRealmsStore(useShallow(useRealmsActions))

	const { control, watch } = useForm<RealmsFiltersForm>({
		defaultValues: {
			search,
			status,
		},
	})

	useEffect(() => {
		const subscription = watch(value => {
			setSearch(value.search ?? '')
			setStatus(value.status ?? 'ALL')
		})

		return () => subscription.unsubscribe()
	}, [watch, setSearch, setStatus])

	return (
		<div className={clsx(styles.filters, className)}>
			<div className={styles.search}>
				<SearchField
					control={control}
					label='Поиск'
					name='search'
					placeholder='Search by code/name'
					size='medium'
				/>
			</div>

			<div className={styles.status}>
				<SelectField<RealmsFiltersForm, RealmStatus | 'ALL'>
					control={control}
					label='Статус'
					name='status'
					options={statusOptions}
					placeholder='Статус'
					size='medium'
				/>
			</div>
		</div>
	)
}
