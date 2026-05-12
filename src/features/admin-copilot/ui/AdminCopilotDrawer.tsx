import { ClearOutlined } from '@ant-design/icons'
import { Button, Drawer, Typography } from 'antd'

import { useAdminCopilotStore } from '../model/useAdminCopilotStore'
import styles from './AdminCopilot.module.css'
import { AdminCopilotMessages } from './AdminCopilotMessages'
import { AdminCopilotInput } from './AdminCopilotInput'

const { Text, Title } = Typography

interface AdminCopilotDrawerProps {
	open: boolean
}

export const AdminCopilotDrawer = ({ open }: AdminCopilotDrawerProps) => {
	const close = useAdminCopilotStore(state => state.close)
	const clear = useAdminCopilotStore(state => state.clear)

	return (
		<Drawer
			className={styles.drawer}
			open={open}
			onClose={close}
			placement='right'
			width={430}
			title={null}
		>
			<div className={styles.layout}>
				<header className={styles.header}>
					<div>
						<Title level={4} className={styles.title}>
							Admin Copilot
						</Title>
						<Text type='secondary'>AI-помощник для админки</Text>
					</div>

					<Button icon={<ClearOutlined />} onClick={clear} type='text' />
				</header>

				<AdminCopilotMessages />

				<AdminCopilotInput />
			</div>
		</Drawer>
	)
}
