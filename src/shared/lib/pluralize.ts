export const pluralize = (
	count: number,
	forms: [one: string, few: string, many: string],
) => {
	const absCount = Math.abs(count)
	const lastTwoDigits = absCount % 100
	const lastDigit = absCount % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return forms[2]
	}

	if (lastDigit === 1) {
		return forms[0]
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return forms[1]
	}

	return forms[2]
}
