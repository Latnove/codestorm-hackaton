import type {
	AdminCopilotChatRequest,
	AdminCopilotChatResponse,
	AdminCopilotMediaUploadResponse,
} from '../model/types'

const MOCK_DELAY_MS = 650

const sleep = (delay = MOCK_DELAY_MS) =>
	new Promise(resolve => {
		window.setTimeout(resolve, delay)
	})

const isImageFile = (file: File) => file.type.startsWith('image/')

const readImageAsDataUrl = (file: File) =>
	new Promise<string>(resolve => {
		if (!isImageFile(file)) {
			resolve('')
			return
		}

		const reader = new FileReader()

		reader.onload = () => {
			resolve(typeof reader.result === 'string' ? reader.result : '')
		}

		reader.onerror = () => resolve('')

		reader.readAsDataURL(file)
	})

export const uploadAdminCopilotMedia = async (
	file: File,
): Promise<AdminCopilotMediaUploadResponse> => {
	await sleep(220)

	return {
		fileName: file.name,
		fileType: isImageFile(file) ? 'image' : 'file',
		mimeType: file.type || 'application/octet-stream',
		objectKey: `mock/${crypto.randomUUID()}-${file.name}`,
		url: await readImageAsDataUrl(file),
	}
}

export const sendAdminCopilotChat = async ({
	attachments,
	sessionId,
	text,
}: AdminCopilotChatRequest): Promise<AdminCopilotChatResponse> => {
	await sleep()

	const normalizedText = text.trim()

	if (normalizedText.toLowerCase().includes('error')) {
		throw new Error('Mock copilot unavailable')
	}

	const hasAttachments = Boolean(attachments?.length)

	const responseParts = [
		normalizedText
			? `Принял запрос: "${normalizedText}".`
			: 'Принял вложения без текстового комментария.',
	]

	if (hasAttachments) {
		responseParts.push(`Вижу вложений: ${attachments?.length}.`)
	}

	responseParts.push(
		'Сейчас работаю в mock-режиме, но уже сохраняю историю и умею обрабатывать файлы.',
	)

	return {
		sessionId,
		text: responseParts.join(' '),
	}
}
