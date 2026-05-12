import { Layout } from 'antd'
import { AdminCopilotWidget } from '@/features/admin-copilot'
import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'
import { AppFooter } from './footer/AppFooter'
import { AppHeader } from './header/AppHeader'

const { Content } = Layout

export const AppLayout = () => {
	return (
		<Layout className={styles.layout}>
			<AppHeader />
			<Content className={styles.main}>
				<Outlet />
			</Content>
			<AppFooter />
			<AdminCopilotWidget />
		</Layout>
	)
}
