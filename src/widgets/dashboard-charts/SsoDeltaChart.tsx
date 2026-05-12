import type { DashboardMetricChartPoint } from '@/entities/dashboard'
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { ChartCard } from './ui/ChartCard'

interface SsoDeltaChartProps {
	data: DashboardMetricChartPoint[]
}

export const SsoDeltaChart = ({ data }: SsoDeltaChartProps) => (
	<ChartCard title='SSO-обмены за 10 секунд'>
		<ResponsiveContainer height={300} width='100%'>
			<AreaChart data={data}>
				<CartesianGrid stroke='#edf2fb' vertical={false} />

				<XAxis dataKey='timeLabel' tick={{ fontSize: 12 }} />

				<YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={42} />

				<Tooltip formatter={(value, name) => [`${value} / 10 сек`, name]} />

				<Legend />

				<Area
					activeDot={{ r: 5 }}
					dataKey='ssoSuccessDelta'
					dot={false}
					fill='var(--color-success)'
					fillOpacity={0.14}
					name='Успешные SSO'
					stroke='var(--color-success)'
					strokeWidth={3}
					type='monotone'
				/>

				<Area
					activeDot={{ r: 5 }}
					dataKey='ssoFailedDelta'
					dot={false}
					fill='var(--color-error)'
					fillOpacity={0.12}
					name='Ошибки SSO'
					stroke='var(--color-error)'
					strokeWidth={3}
					type='monotone'
				/>
			</AreaChart>
		</ResponsiveContainer>
	</ChartCard>
)
