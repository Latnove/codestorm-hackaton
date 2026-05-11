import type { PlatformUser } from '@/entities/user'
import type { CreateUserFormValues } from '../model/validation'

export const buildPlatformUser = (
	values: CreateUserFormValues,
): PlatformUser => {
	const now = new Date().toISOString()
	const id = `user-${values.username.trim().toLowerCase().replaceAll('.', '-')}`

	return {
		createdAt: now,
		email: values.email.trim(),
		globalRoles: values.globalRoles,
		id,
		realmRoles: [
			{
				realmCode: values.realmCode,
				roles: values.realmRoles,
			},
		],
		status: values.status,
		updatedAt: now,
		username: values.username.trim(),
	}
}
