import { z } from 'zod'

export const createRealmSchema = z.object({
	code: z
		.string()
		.min(1, 'Это обязательное поле')
		.regex(
			/^[a-z0-9-]+$/,
			'Код для Realm может содержать только lowercase latin letters, numbers и hyphen',
		),
	description: z.string().optional(),
	name: z.string().min(1, 'Это обязательное поле'),
})

export type CreateRealmFormValues = z.infer<typeof createRealmSchema>
