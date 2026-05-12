export type AdminCopilotAttachment = {
	objectKey: string
	url: string
	fileName: string
	mimeType: string
	fileType: string
}

export type AdminCopilotAttachmentRequest = AdminCopilotAttachment

export type AdminCopilotChatRequest = {
	sessionId: string
	text: string
	attachments?: AdminCopilotAttachmentRequest[]
}

export type AdminCopilotChatResponse = {
	sessionId: string
	text: string
}

export type AdminCopilotMediaUploadResponse = AdminCopilotAttachment

export type AdminCopilotMessage = {
	id: string
	role: 'assistant' | 'user'
	text: string
	attachments?: AdminCopilotAttachment[]
	createdAt: string
	status?: 'error' | 'sending' | 'sent'
}
