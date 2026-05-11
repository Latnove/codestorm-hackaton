import { ButtonField } from '@/shared/ui/ButtonField'
import { DeleteConfirm } from '@/shared/ui/DeleteConfirm'
import { Dropdown } from 'antd'
import { useState, type ReactNode } from 'react'
import styles from './ActionsDropdown.module.css'

export type ActionsDropdownItem = {
	key: string
	label: ReactNode
	onClick: () => void
	danger?: boolean
	confirm?: {
		description?: ReactNode
		okText?: string
		title?: ReactNode
	}
}

type ActionsDropdownControls = {
	close: () => void
}

interface ActionsDropdownProps {
	children?: ReactNode | ((controls: ActionsDropdownControls) => ReactNode)
	items?: ActionsDropdownItem[]
	label?: ReactNode
}

export const ActionsDropdown = ({
	children,
	items,
	label = 'Actions',
}: ActionsDropdownProps) => {
	const [open, setOpen] = useState(false)

	const handleActionClick = (onClick: () => void) => {
		onClick()
		setOpen(false)
	}

	const close = () => {
		setOpen(false)
	}

	return (
		<Dropdown
			menu={{
				items: items?.map(item => ({
					key: item.key,
					label: item.label,
					danger: item.danger,
				})) ?? [],
			}}
			onOpenChange={setOpen}
			open={open}
			popupRender={() => (
				<div className={styles.menu}>
					{children
						? typeof children === 'function'
							? children({ close })
							: children
						: items?.map(item => {
								const button = (
									<ButtonField
										className={
											item.danger ? styles.menuItemDanger : styles.menuItem
										}
										danger={item.danger}
										onClick={
											item.confirm
												? undefined
												: () => handleActionClick(item.onClick)
										}
										type='text'
									>
										{item.label}
									</ButtonField>
								)

								if (item.confirm) {
									return (
										<DeleteConfirm
											description={item.confirm.description}
											key={item.key}
											okText={item.confirm.okText}
											onConfirm={() => handleActionClick(item.onClick)}
											title={item.confirm.title}
										>
											{button}
										</DeleteConfirm>
									)
								}

								return <div key={item.key}>{button}</div>
							})}
				</div>
			)}
			trigger={['click']}
		>
			<span>
				<ButtonField className={styles.trigger} size='small'>
					<span>{label}</span>
					<span className={styles.chevron} aria-hidden='true' />
				</ButtonField>
			</span>
		</Dropdown>
	)
}
