import { apiClient, unwrapData } from '@/shared/api'

import type {
	AdminCopilotChatRequest,
	AdminCopilotChatResponse,
	AdminCopilotMediaUploadResponse,
} from '../model/types'

export const uploadAdminCopilotMedia = (file: File) => {
	const formData = new FormData()
	formData.append('file', file)

	return unwrapData(
		apiClient.post<AdminCopilotMediaUploadResponse>(
			'/api/admin/copilot/media',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		),
	)
}

export const sendAdminCopilotChat = (request: AdminCopilotChatRequest) =>
	unwrapData(
		apiClient.post<AdminCopilotChatResponse>(
			'/api/admin/copilot/chat',
			request,
		),
	)
