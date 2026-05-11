import {
	Roles,
	roleLabels,
	type PlatformUserStatus,
	type Role,
} from '@/entities/user'
import {
	useUsersActions,
	useUsersFiltersState,
	useUsersStore,
} from '@/features/users/users-catalog/model'
import { SearchField } from '@/shared/ui/SearchField'
import { SelectField } from '@/shared/ui/SelectField'
import clsx from 'clsx'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useShallow } from 'zustand/react/shallow'
import styles from './UsersFilters.module.css'

type UsersFiltersForm = {
	globalRole: Role | 'ALL'
	search: string
	status: PlatformUserStatus | 'ALL'
}

interface UsersFiltersProps {
	className?: string
}

const statusOptions: {
	label: string
	value: PlatformUserStatus | 'ALL'
}[] = [
	{ label: 'All statuses', value: 'ALL' },
	{ label: 'Active', value: 'active' },
	{ label: 'Blocked', value: 'blocked' },
]

const roleOptions: {
	label: string
	value: Role | 'ALL'
}[] = [
	{ label: 'All roles', value: 'ALL' },
	{ label: roleLabels[Roles.ROOT], value: Roles.ROOT },
	{ label: roleLabels[Roles.ADMIN], value: Roles.ADMIN },
	{ label: roleLabels[Roles.READONLY], value: Roles.READONLY },
]

export const UsersFilters = ({ className }: UsersFiltersProps) => {
	const { globalRole, search, status } = useUsersStore(
		useShallow(useUsersFiltersState),
	)
	const { setGlobalRole, setSearch, setStatus } = useUsersStore(
		useShallow(useUsersActions),
	)

	const { control, watch } = useForm<UsersFiltersForm>({
		defaultValues: {
			globalRole,
			search,
			status,
		},
	})

	useEffect(() => {
		const subscription = watch(value => {
			setSearch(value.search ?? '')
			setStatus(value.status ?? 'ALL')
			setGlobalRole(value.globalRole ?? 'ALL')
		})

		return () => subscription.unsubscribe()
	}, [setGlobalRole, setSearch, setStatus, watch])

	return (
		<div className={clsx(styles.filters, className)}>
			<div className={styles.search}>
				<SearchField
					control={control}
					label='Search'
					name='search'
					placeholder='Search by username/email'
				/>
			</div>

			<div className={styles.filter}>
				<SelectField<UsersFiltersForm, PlatformUserStatus | 'ALL'>
					control={control}
					label='Статус'
					name='status'
					options={statusOptions}
					placeholder='Status'
				/>
			</div>

			<div className={styles.filter}>
				<SelectField<UsersFiltersForm, Role | 'ALL'>
					control={control}
					label='Global role'
					name='globalRole'
					options={roleOptions}
					placeholder='Global role'
				/>
			</div>
		</div>
	)
}
