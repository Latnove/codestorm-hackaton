import { z } from 'zod'

export const loginSchema = z.object({
	username: z
		.string()
		.trim()
		.min(1, 'Введите username')
		.min(3, 'Минимум 3 символа'),
	password: z
		.string()
		.min(1, 'Введите пароль')
		.min(4, 'Минимум 4 символа'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
