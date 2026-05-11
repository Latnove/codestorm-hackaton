import { Roles, type PlatformUserStatus, type Role } from '@/entities/user'
import { z } from 'zod'

export const createUserSchema = z
	.object({
		confirmPassword: z.string().min(1, 'Подтвердите пароль'),
		email: z.string().email('Введите корректный email'),
		globalRoles: z.array(z.nativeEnum(Roles)).min(1, 'Выберите роль'),
		password: z.string().min(6, 'Минимум 6 символов'),
		realmCode: z.string().min(1, 'Выберите Realm'),
		realmRoles: z.array(z.nativeEnum(Roles)).min(1, 'Выберите роли для Realm'),
		status: z.enum(['active', 'blocked']),
		username: z.string().min(1, 'Это обязательное поле'),
	})
	.refine(values => values.password === values.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'],
	})

export type CreateUserFormValues = {
	confirmPassword: string
	email: string
	globalRoles: Role[]
	password: string
	realmCode: string
	realmRoles: Role[]
	status: PlatformUserStatus
	username: string
}
