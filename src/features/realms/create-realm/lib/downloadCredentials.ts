import type { RealmCredentials } from '../model/types'

export const downloadCredentials = (credentials: RealmCredentials) => {
	const blob = new Blob([JSON.stringify(credentials, null, 2)], {
		type: 'application/json',
	})
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')

	link.href = url
	link.download = `${credentials.realmCode}-credentials.json`
	link.click()
	URL.revokeObjectURL(url)
}
