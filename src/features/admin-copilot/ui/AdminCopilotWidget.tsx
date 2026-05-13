import { MessageOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'

import { useUserStore } from '@/entities/user'

import { useAdminCopilotStore } from '../model/adminCopilotStore'
import styles from './AdminCopilot.module.css'
import { AdminCopilotDrawer } from './AdminCopilotDrawer'

export const AdminCopilotWidget = () => {
	const user = useUserStore(state => state.user)
	const accessToken = useUserStore(state => state.accessToken)
	const open = useAdminCopilotStore(state => state.open)

	if (!user || !accessToken) {
		return null
	}

	return (
		<>
			<Tooltip title='Admin Copilot'>
				<Button
					aria-label='Open Admin Copilot'
					className={styles.floatingButton}
					icon={<MessageOutlined />}
					onClick={open}
					shape='circle'
					type='primary'
				/>
			</Tooltip>
			<AdminCopilotDrawer />
		</>
	)
}
