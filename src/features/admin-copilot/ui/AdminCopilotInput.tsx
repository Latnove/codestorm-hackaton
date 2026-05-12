import {
	CloseOutlined,
	PaperClipOutlined,
	SendOutlined,
} from '@ant-design/icons'
import { Button, Input, Tag, Tooltip } from 'antd'
import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'

import styles from './AdminCopilot.module.css'

interface AdminCopilotInputProps {
	disabled?: boolean
	onSend: (text: string, files: File[]) => void
}

const { TextArea } = Input

export const AdminCopilotInput = ({
	disabled = false,
	onSend,
}: AdminCopilotInputProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [text, setText] = useState('')
	const [files, setFiles] = useState<File[]>([])
	const canSend = Boolean(text.trim() || files.length > 0) && !disabled

	const handleAttach = () => {
		fileInputRef.current?.click()
	}

	const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextFiles = Array.from(event.target.files ?? [])

		if (nextFiles.length > 0) {
			setFiles(current => [...current, ...nextFiles])
		}

		event.target.value = ''
	}

	const removeFile = (index: number) => {
		setFiles(current => current.filter((_, fileIndex) => fileIndex !== index))
	}

	const handleSend = () => {
		if (!canSend) {
			return
		}

		onSend(text, files)
		setText('')
		setFiles([])
	}

	return (
		<div className={styles.inputPanel}>
			<TextArea
				autoSize={{ maxRows: 5, minRows: 3 }}
				className={styles.textarea}
				disabled={disabled}
				onChange={event => setText(event.target.value)}
				onPressEnter={event => {
					if (!event.shiftKey) {
						event.preventDefault()
						handleSend()
					}
				}}
				placeholder='Напишите сообщение'
				value={text}
			/>

			{files.length > 0 ? (
				<div className={styles.selectedFiles}>
					{files.map((file, index) => (
						<Tag
							className={styles.fileChip}
							closeIcon={<CloseOutlined />}
							key={`${file.name}-${file.lastModified}-${index}`}
							onClose={event => {
								event.preventDefault()
								removeFile(index)
							}}
						>
							{file.name}
						</Tag>
					))}
				</div>
			) : null}

			<div className={styles.inputActions}>
				<input
					className={styles.hiddenInput}
					multiple
					onChange={handleFilesChange}
					ref={fileInputRef}
					type='file'
				/>

				<Tooltip title='Прикрепить файлы'>
					<Button
						disabled={disabled}
						icon={<PaperClipOutlined />}
						onClick={handleAttach}
					/>
				</Tooltip>

				<div className={styles.inputActionsRight}>
					<Button
						disabled={!canSend}
						icon={<SendOutlined />}
						loading={disabled}
						onClick={handleSend}
						type='primary'
					>
						Send
					</Button>
				</div>
			</div>
		</div>
	)
}
