import { ButtonField } from '@/shared/ui/ButtonField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { Button, Upload, message } from 'antd'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
	sendAdminCopilotChat,
	uploadAdminCopilotMedia,
} from '../api/adminCopilotApi'
import type { AdminCopilotAttachment } from '../model/types'
import { useAdminCopilotStore } from '../model/useAdminCopilotStore'
import styles from './AdminCopilot.module.css'

type AdminCopilotInputForm = {
	text: string
}

export const AdminCopilotInput = () => {
	const sessionId = useAdminCopilotStore(state => state.sessionId)
	const addMessage = useAdminCopilotStore(state => state.addMessage)
	const updateMessage = useAdminCopilotStore(state => state.updateMessage)

	const [files, setFiles] = useState<UploadFile[]>([])
	const [isSending, setIsSending] = useState(false)

	const { control, handleSubmit, reset, watch } =
		useForm<AdminCopilotInputForm>({
			defaultValues: {
				text: '',
			},
		})

	const text = watch('text')
	const canSend = Boolean(text.trim()) || files.length > 0

	const onSubmit = handleSubmit(async values => {
		if (!canSend || isSending) {
			return
		}

		setIsSending(true)

		const currentText = values.text.trim()
		const currentFiles = files

		reset()
		setFiles([])

		try {
			const attachments: AdminCopilotAttachment[] = await Promise.all(
				currentFiles
					.map(file => file.originFileObj)
					.filter(Boolean)
					.map(file => uploadAdminCopilotMedia(file as File)),
			)

			addMessage({
				id: crypto.randomUUID(),
				role: 'user',
				text: currentText,
				attachments,
				createdAt: new Date().toISOString(),
				status: 'sent',
			})

			const assistantId = crypto.randomUUID()

			addMessage({
				id: assistantId,
				role: 'assistant',
				text: '',
				createdAt: new Date().toISOString(),
				status: 'sending',
			})

			const response = await sendAdminCopilotChat({
				sessionId,
				text: currentText,
				attachments,
			})

			updateMessage(assistantId, {
				text: response.text,
				status: 'sent',
			})
		} catch {
			message.error('Admin Copilot unavailable')
		} finally {
			setIsSending(false)
		}
	})

	return (
		<form className={styles.inputPanel} onSubmit={onSubmit}>
			<Upload
				beforeUpload={() => false}
				fileList={files}
				multiple
				onChange={({ fileList }) => setFiles(fileList)}
			>
				<Button icon={<PaperClipOutlined />} />
			</Upload>

			<TextAreaField
				autoSize={{ minRows: 1, maxRows: 4 }}
				className={styles.textarea}
				control={control}
				label=''
				name='text'
				onPressEnter={event => {
					if (!event.shiftKey) {
						event.preventDefault()
						onSubmit()
					}
				}}
				placeholder='Спросить Copilot...'
			/>

			<ButtonField
				disabled={!canSend}
				htmlType='submit'
				icon={<SendOutlined />}
				loading={isSending}
				type='primary'
			/>
		</form>
	)
}
