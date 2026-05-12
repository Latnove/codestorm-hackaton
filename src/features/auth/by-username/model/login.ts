import { loginAdmin, type AuthPayload } from '@/entities/user'

export interface LoginPayload {
	username: string
	password: string
}

export const loginByUsername = ({
	password,
	username,
}: LoginPayload): Promise<AuthPayload> =>
	loginAdmin({
		password,
		username: username.trim(),
	})
