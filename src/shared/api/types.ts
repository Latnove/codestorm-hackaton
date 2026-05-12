export type PageResponse<T> = {
	items: T[]
	page: number
	size: number
	total: number
}

export type ErrorDto = {
	error: string
	message: string
	path: string
	status: number
	timestamp: string
	validationErrors?: Array<{
		field: string
		message: string
	}>
}

export type ApiListParams = {
	page?: number
	search?: string
	size?: number
	sort?: string
}
