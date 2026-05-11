import { roleLabels, Roles, type Role } from '@/entities/user'
import { useRealmsStore } from '@/features/realms'
import {
	buildPlatformUser,
	createUserSchema,
	type CreateUserFormValues,
} from '@/features/users/create-user'
import { useUsersStore } from '@/features/users'
import { buildUserRoute, ROUTES } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { InputField } from '@/shared/ui/InputField'
import { SelectField } from '@/shared/ui/SelectField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, Typography, message } from 'antd'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styles from './CreateUserPage.module.css'

const { Text, Title } = Typography

const roleOptions = [Roles.ROOT, Roles.ADMIN, Roles.READONLY].map(role => ({
	label: roleLabels[role],
	value: role,
}))

const statusOptions = [
	{ label: 'Active', value: 'active' },
	{ label: 'Blocked', value: 'blocked' },
]

export const CreateUserPage = () => {
	const navigate = useNavigate()
	const realms = useRealmsStore(state => state.realms)
	const createUser = useUsersStore(state => state.createUser)

	const realmOptions = realms.map(realm => ({
		label: `${realm.name} (${realm.code})`,
		value: realm.code,
	}))

	const {
		control,
		formState: { isSubmitting },
		handleSubmit,
	} = useForm<CreateUserFormValues>({
		defaultValues: {
			confirmPassword: '',
			email: '',
			globalRoles: [Roles.ADMIN],
			password: '',
			realmCode: realmOptions[0]?.value ?? '',
			realmRoles: [Roles.ADMIN],
			status: 'active',
			username: '',
		},
		mode: 'onBlur',
		resolver: zodResolver(createUserSchema),
	})

	const handleCreate = (values: CreateUserFormValues) => {
		const user = buildPlatformUser(values)

		createUser(user)
		message.success(`Пользователь ${user.username} создан`)
		navigate(buildUserRoute(user.id))
	}

	return (
		<div className={styles.wrapper}>
			<Card className={styles.card}>
				<div className={styles.header}>
					<Text type='secondary'>Platform users</Text>
					<Title level={1}>Создать пользователя</Title>
				</div>

				<form className={styles.form} onSubmit={handleSubmit(handleCreate)}>
					<InputField
						control={control}
						label='Username'
						name='username'
						placeholder='ivan.petrov'
					/>
					<InputField
						control={control}
						label='Email'
						name='email'
						placeholder='ivan.petrov@example.com'
					/>
					<InputField
						control={control}
						label='Password'
						name='password'
						placeholder='Минимум 6 символов'
						type='password'
					/>
					<InputField
						control={control}
						label='Confirm password'
						name='confirmPassword'
						placeholder='Повторите пароль'
						type='password'
					/>
					<SelectField<CreateUserFormValues, Role[]>
						control={control}
						label='Global roles'
						mode='multiple'
						name='globalRoles'
						options={roleOptions}
						placeholder='Выберите роли'
					/>
					<SelectField<CreateUserFormValues, CreateUserFormValues['status']>
						control={control}
						label='Status'
						name='status'
						options={statusOptions}
						placeholder='Status'
					/>
					<div className={styles.wide}>
						<SelectField<CreateUserFormValues, string>
							control={control}
							label='Realm'
							name='realmCode'
							options={realmOptions}
							placeholder='Выберите Realm'
						/>
					</div>
					<div className={styles.wide}>
						<SelectField<CreateUserFormValues, Role[]>
							control={control}
							label='Roles in Realm'
							mode='multiple'
							name='realmRoles'
							options={roleOptions}
							placeholder='Выберите роли'
						/>
					</div>

					<div className={styles.submitRow}>
						<ButtonField htmlType='submit' loading={isSubmitting} type='primary'>
							Создать
						</ButtonField>
						<ButtonField onClick={() => navigate(ROUTES.USERS)}>
							Отмена
						</ButtonField>
					</div>
				</form>
			</Card>
		</div>
	)
}
