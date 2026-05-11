import { Layout } from 'antd'
import styles from './AppFooter.module.css'
import clsx from 'clsx'

const { Footer } = Layout

export const AppFooter = () => {
	return (
		<Footer className={styles.footer}>
			<div className={clsx('container', styles.inner)}>
				<span>Codestorm</span>
				<span>MiniApp Platform MVP</span>
			</div>
		</Footer>
	)
}
