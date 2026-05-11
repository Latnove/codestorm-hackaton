import { Popconfirm } from 'antd'
import type { ReactNode } from 'react'

interface DeleteConfirmProps {
	children: ReactNode
	description?: ReactNode
	okText?: string
	onConfirm: () => void
	title?: ReactNode
}

export const DeleteConfirm = ({
	children,
	description = 'Это действие нельзя отменить.',
	okText = 'Удалить',
	onConfirm,
	title = 'Удалить?',
}: DeleteConfirmProps) => {
	return (
		<Popconfirm
			description={description}
			okText={okText}
			onConfirm={onConfirm}
			title={title}
		>
			<span
				onClick={event => {
					event.preventDefault()
					event.stopPropagation()
				}}
			>
				{children}
			</span>
		</Popconfirm>
	)
}
