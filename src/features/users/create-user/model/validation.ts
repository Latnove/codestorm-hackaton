import { Roles, type PlatformUserStatus, type Role } from '@/entities/user'
import { z } from 'zod'

export const createUserSchema = z
	.object({
		confirmPassword: z.string().min(1, 'Подтвердите пароль'),
		email: z.string().email('Введите корректный email'),
		password: z.string().min(6, 'Минимум 6 символов'),
		realmCode: z.string().min(1, 'Выберите Realm'),
		role: z.nativeEnum(Roles),
		status: z.enum(['active', 'disable']),
		username: z.string().min(1, 'Это обязательное поле'),
	})
	.refine(values => values.password === values.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'],
	})

export type CreateUserFormValues = {
	confirmPassword: string
	email: string
	password: string
	realmCode: string
	role: Role
	status: PlatformUserStatus
	username: string
}
