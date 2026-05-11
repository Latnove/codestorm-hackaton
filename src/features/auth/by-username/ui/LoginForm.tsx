import { Roles, useUserActions, useUserStore } from '@/entities/user'
import { loginByUsername } from '@/features/auth/by-username/model/login'
import {
	loginSchema,
	type LoginFormValues,
} from '@/features/auth/by-username/model/validation'
import { ROUTES } from '@/shared/config'
import { InputField } from '@/shared/ui/InputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Divider, Typography, message } from 'antd'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import styles from './LoginForm.module.css'

const { Text } = Typography

export const LoginForm = () => {
	const navigate = useNavigate()
	const [messageApi, contextHolder] = message.useMessage()
	const { setAuth } = useUserStore(useShallow(useUserActions))
	const {
		control,
		formState: { isSubmitting },
		handleSubmit,
	} = useForm<LoginFormValues>({
		defaultValues: {
			password: 'admin',
			username: 'admin',
		},
		mode: 'onBlur',
		resolver: zodResolver(loginSchema),
	})

	const handleFinish = (values: LoginFormValues) => {
		const authPayload = loginByUsername(values)
		setAuth(authPayload)
		messageApi.success('Вы успешно авторизовались')
		navigate(
			authPayload.user.role === Roles.ROOT ? ROUTES.REALMS : ROUTES.DASHBOARD,
		)
	}

	return (
		<>
			{contextHolder}
			<form className={styles.form} onSubmit={handleSubmit(handleFinish)}>
				<div className={styles.fields}>
					<InputField
						autoComplete='username'
						control={control}
						hint='Введите ваш логин'
						label='Username'
						name='username'
						placeholder='admin'
					/>
					<InputField
						autoComplete='current-password'
						control={control}
						hint='Введите ваш пароль'
						label='Password'
						name='password'
						placeholder='admin'
						type='password'
					/>
				</div>

				<Button
					block
					className={styles.submit}
					htmlType='submit'
					loading={isSubmitting}
					size='large'
					type='primary'
				>
					Авторизоваться
				</Button>

				<Divider className={styles.divider} />

				<div className={styles.demo}>
					<Text className={styles.demoLabel}>
						После авторизации вам откроется доступ
					</Text>
				</div>
			</form>
		</>
	)
}
