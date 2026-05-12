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
		id,
		realmCode: values.realmCode,
		role: values.role,
		status: values.status,
		updatedAt: now,
		username: values.username.trim(),
	}
}
