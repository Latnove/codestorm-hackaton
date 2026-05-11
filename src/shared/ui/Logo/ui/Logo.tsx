import Text from 'antd/es/typography/Text'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './Logo.module.css'

interface ILogo {
	className?: string
	onClick?: () => void
}

export const Logo: FC<ILogo> = ({ className, onClick }) => {
	return (
		<button
			className={clsx(styles.brand, className)}
			onClick={onClick}
			type='button'
		>
			<span className={styles.brandMark}>MP</span>
			<span>
				<Text className={styles.brandText}>Codestorm</Text>
				<Text className={styles.brandSub}>MiniApp Platform</Text>
			</span>
		</button>
	)
}
