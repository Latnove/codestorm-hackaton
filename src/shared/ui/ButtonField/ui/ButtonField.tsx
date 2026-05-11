import { Button } from 'antd'
import type { ButtonProps } from 'antd'
import clsx from 'clsx'
import styles from './ButtonField.module.css'

export type ButtonFieldProps = ButtonProps

export const ButtonField = ({ className, ...props }: ButtonFieldProps) => {
	return <Button className={clsx(styles.button, className)} {...props} />
}
