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

export const realmRoleSchema = z.object({
	code: z
		.string()
		.trim()
		.min(1, 'Это обязательное поле')
		.regex(
			/^[A-Z0-9_]+$/,
			'Код может содержать только заглавные латинские буквы, цифры и underscore',
		),
	description: z.string().trim().optional(),
	name: z.string().trim().min(1, 'Это обязательное поле'),
})

export type RealmRoleFormValues = z.infer<typeof realmRoleSchema>

export const roleMappingSchema = z.object({
	externalRole: z.string().trim().min(1, 'Это обязательное поле'),
	realmRoleCode: z.string().trim().min(1, 'Выберите Realm Role'),
})

export type RoleMappingFormValues = z.infer<typeof roleMappingSchema>
