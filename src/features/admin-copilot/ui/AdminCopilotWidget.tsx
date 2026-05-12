import { MessageOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd'

import { useAdminCopilotStore } from '../model/useAdminCopilotStore'
import { AdminCopilotDrawer } from './AdminCopilotDrawer'

import styles from './AdminCopilot.module.css'

export const AdminCopilotWidget = () => {
	const isOpen = useAdminCopilotStore(state => state.isOpen)
	const open = useAdminCopilotStore(state => state.open)

	return (
		<>
			<FloatButton
				icon={<MessageOutlined />}
				onClick={open}
				type='primary'
				className={styles.floatingButton}
			/>

			<AdminCopilotDrawer open={isOpen} />
		</>
	)
}
