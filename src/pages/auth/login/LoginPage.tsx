import { LoginForm } from '@/features/auth/by-username'
import { Logo } from '@/shared/ui/Logo'
import { Badge, Card, Typography } from 'antd'
import clsx from 'clsx'
import styles from './LoginPage.module.css'

const { Paragraph, Title } = Typography

export const LoginPage = () => {
	return (
		<section className={styles.page}>
			<div className={styles.backgroundGrid} />
			<div className={clsx('container', styles.wrap)}>
				<div className={styles.content}>
					<div className={styles.hero}>
						<Badge
							className={styles.badge}
							color='#5d7cf5'
							text='Mini-App Control Center'
						/>
						<Title className={styles.title}>
							Единое место для управления внутренними приложениями
						</Title>
						<Paragraph className={styles.lead}>
							Управляй каталогом miniapp, проверяй доступы и смотри аналитику
							без лишнего шума.
						</Paragraph>
					</div>
				</div>

				<Card className={styles.loginCard} bordered={false}>
					<Logo className={styles.logo} />

					<LoginForm />
				</Card>
			</div>
		</section>
	)
}
