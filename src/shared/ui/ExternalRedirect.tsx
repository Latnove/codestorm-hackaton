import { Result, Typography } from 'antd'
import { useEffect } from 'react'

const { Link } = Typography

interface ExternalRedirectProps {
	to: string
	title: string
}

export const ExternalRedirect = ({ title, to }: ExternalRedirectProps) => {
	useEffect(() => {
		window.location.assign(to)
	}, [to])

	return (
		<Result
			status='info'
			subTitle={<Link href={to}>Открыть вручную</Link>}
			title={title}
		/>
	)
}
