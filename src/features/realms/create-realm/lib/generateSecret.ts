export const generateSecret = () => {
	const values = new Uint8Array(24)
	crypto.getRandomValues(values)

	return Array.from(values)
		.map(value => value.toString(16).padStart(2, '0'))
		.join('')
}
