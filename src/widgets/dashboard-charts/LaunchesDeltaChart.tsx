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

interface LaunchesDeltaChartProps {
	data: DashboardMetricChartPoint[]
}

export const LaunchesDeltaChart = ({ data }: LaunchesDeltaChartProps) => (
	<ChartCard title='Запуски за 10 секунд'>
		<ResponsiveContainer height={300} width='100%'>
			<AreaChart data={data}>
				<CartesianGrid stroke='#edf2fb' vertical={false} />
				<XAxis dataKey='timeLabel' tick={{ fontSize: 12 }} />
				<YAxis
					allowDecimals={false}
					tick={{ fontSize: 12 }}
					width={42}
					label={{
						value: 'за 10 сек',
						angle: -90,
						position: 'insideLeft',
						style: { fontSize: 12 },
					}}
				/>
				<Tooltip
					formatter={(value, name) => [`${value} запусков / 10 сек`, name]}
				/>
				<Legend />

				<Area
					activeDot={{ r: 5 }}
					dataKey='launchSuccessDelta'
					fill='var(--color-success)'
					fillOpacity={0.14}
					name='Успешные'
					stroke='var(--color-success)'
					strokeWidth={3}
					type='monotone'
				/>

				<Area
					activeDot={{ r: 5 }}
					dataKey='launchDeniedDelta'
					fill='var(--color-error)'
					fillOpacity={0.12}
					name='Отклоненные'
					stroke='var(--color-error)'
					strokeWidth={3}
					type='monotone'
				/>
			</AreaChart>
		</ResponsiveContainer>
	</ChartCard>
)
