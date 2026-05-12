import { Button, Drawer } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import {
	sendAdminCopilotChat,
	uploadAdminCopilotMedia,
} from '../api/adminCopilotApi'
import { useAdminCopilotStore } from '../model/adminCopilotStore'
import type {
	AdminCopilotAttachment,
	AdminCopilotMessage,
} from '../model/types'
import styles from './AdminCopilot.module.css'
import { AdminCopilotInput } from './AdminCopilotInput'
import { AdminCopilotMessages } from './AdminCopilotMessages'

type SendCopilotPayload = {
	assistantMessageId: string
	files: File[]
	sessionId: string
	text: string
	userMessageId: string
}

const buildMessageId = () => crypto.randomUUID()

const buildLocalAttachments = (files: File[]): AdminCopilotAttachment[] =>
	files.map(file => ({
		fileName: file.name,
		fileType: file.type.startsWith('image/') ? 'image' : 'file',
		mimeType: file.type || 'application/octet-stream',
		objectKey: `local-${crypto.randomUUID()}`,
		url: '',
	}))

export const AdminCopilotDrawer = () => {
	const {
		addMessage,
		clear,
		close,
		isOpen,
		messages,
		sessionId,
		setSessionId,
		updateMessage,
	} = useAdminCopilotStore(
		useShallow(state => ({
			addMessage: state.addMessage,
			clear: state.clear,
			close: state.close,
			isOpen: state.isOpen,
			messages: state.messages,
			sessionId: state.sessionId,
			setSessionId: state.setSessionId,
			updateMessage: state.updateMessage,
		})),
	)

	const sendMessageMutation = useMutation({
		mutationFn: async ({
			files,
			sessionId: currentSessionId,
			text,
			userMessageId,
		}: SendCopilotPayload) => {
			const attachments =
				files.length > 0
					? await Promise.all(files.map(file => uploadAdminCopilotMedia(file)))
					: []

			if (attachments.length > 0) {
				updateMessage(userMessageId, { attachments })
			}

			return sendAdminCopilotChat({
				attachments: attachments.length > 0 ? attachments : undefined,
				sessionId: currentSessionId,
				text,
			})
		},
		onError: (_, payload) => {
			updateMessage(payload.assistantMessageId, {
				status: 'error',
				text: 'AI assistant unavailable',
			})
		},
		onSuccess: (response, payload) => {
			setSessionId(response.sessionId)
			updateMessage(payload.assistantMessageId, {
				status: 'sent',
				text: response.text,
			})
		},
	})

	const handleSend = (text: string, files: File[]) => {
		const createdAt = new Date().toISOString()
		const userMessageId = buildMessageId()
		const assistantMessageId = buildMessageId()
		const userMessage: AdminCopilotMessage = {
			attachments: buildLocalAttachments(files),
			createdAt,
			id: userMessageId,
			role: 'user',
			status: 'sent',
			text: text.trim(),
		}
		const assistantMessage: AdminCopilotMessage = {
			createdAt: new Date().toISOString(),
			id: assistantMessageId,
			role: 'assistant',
			status: 'sending',
			text: '',
		}

		addMessage(userMessage)
		addMessage(assistantMessage)
		sendMessageMutation.mutate({
			assistantMessageId,
			files,
			sessionId,
			text: text.trim(),
			userMessageId,
		})
	}

	return (
		<Drawer
			className={styles.drawer}
			extra={
				<Button disabled={messages.length === 0} onClick={clear}>
					Очистить
				</Button>
			}
			onClose={close}
			open={isOpen}
			title='Admin Copilot'
			width={420}
		>
			<div className={styles.drawerBody}>
				<AdminCopilotMessages messages={messages} />
				<AdminCopilotInput
					disabled={sendMessageMutation.isPending}
					onSend={handleSend}
				/>
			</div>
		</Drawer>
	)
}
