import { FileOutlined, LoadingOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import type { AdminCopilotAttachment } from '../model/types'
import { useAdminCopilotStore } from '../model/useAdminCopilotStore'
import styles from './AdminCopilot.module.css'

const AttachmentPreview = ({
	attachment,
}: {
	attachment: AdminCopilotAttachment
}) => {
	if (attachment.fileType === 'image' && attachment.url) {
		return (
			<div className={styles.attachment}>
				<img
					alt={attachment.fileName}
					className={styles.attachmentImage}
					src={attachment.url}
				/>
				<span className={styles.attachmentName}>{attachment.fileName}</span>
			</div>
		)
	}

	return (
		<div className={clsx(styles.attachment, styles.fileAttachment)}>
			<span className={styles.fileIcon}>
				<FileOutlined />
			</span>
			<span className={styles.attachmentName}>{attachment.fileName}</span>
		</div>
	)
}

export const AdminCopilotMessages = () => {
	const messages = useAdminCopilotStore(state => state.messages)

	const bottomRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	if (messages.length === 0) {
		return (
			<div className={styles.messages}>
				<div className={styles.empty}>Admin Copilot готов к диалогу</div>
			</div>
		)
	}

	return (
		<div className={styles.messages}>
			{messages.map(message => {
				const isUser = message.role === 'user'
				const isError = message.status === 'error'
				const isSending = message.status === 'sending'

				return (
					<div
						className={clsx(
							styles.messageRow,
							isUser ? styles.messageRowUser : styles.messageRowAssistant,
						)}
						key={message.id}
					>
						<div
							className={clsx(
								styles.bubble,
								isUser ? styles.bubbleUser : styles.bubbleAssistant,
								isError && styles.bubbleError,
							)}
						>
							{isSending ? (
								<span className={styles.sending}>
									<LoadingOutlined />
									Thinking
								</span>
							) : (
								<p className={styles.messageText}>{message.text}</p>
							)}

							{message.attachments?.length ? (
								<div className={styles.attachments}>
									{message.attachments.map(attachment => (
										<AttachmentPreview
											attachment={attachment}
											key={attachment.objectKey}
										/>
									))}
								</div>
							) : null}
						</div>
					</div>
				)
			})}
			<div ref={bottomRef} />
		</div>
	)
}
