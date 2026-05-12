import type { DashboardMetricChartPoint } from '@/entities/dashboard'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { ChartCard } from './ui/ChartCard'

interface HostTokensDeltaChartProps {
	data: DashboardMetricChartPoint[]
}

export const HostTokensDeltaChart = ({ data }: HostTokensDeltaChartProps) => {
	const latest = data[data.length - 1]

	const chartData = [
		{
			name: 'Выдано',
			value: latest?.hostTokensIssuedDelta ?? 0,
			color: '#224bd5',
		},
		{
			name: 'Остаток',
			value: Math.max(100 - (latest?.hostTokensIssuedDelta ?? 0), 0),
			color: '#9dacdc',
		},
	]

	return (
		<ChartCard title='Host-токены за 10 секунд'>
			<ResponsiveContainer height={300} width='100%'>
				<PieChart>
					<Tooltip
						formatter={value => [`${value} токенов / 10 сек`, 'Выдано']}
					/>

					<Pie
						cx='50%'
						cy='50%'
						data={chartData}
						dataKey='value'
						endAngle={-270}
						innerRadius={90}
						outerRadius={118}
						paddingAngle={2}
						startAngle={90}
						stroke='none'
					>
						{chartData.map(entry => (
							<Cell fill={entry.color} key={entry.name} />
						))}
					</Pie>

					<text
						x='50%'
						y='48%'
						textAnchor='middle'
						dominantBaseline='middle'
						style={{
							fontSize: 36,
							fontWeight: 800,
							fill: '#312e81',
						}}
					>
						{latest?.hostTokensIssuedDelta ?? 0}
					</text>

					<text
						x='50%'
						y='60%'
						textAnchor='middle'
						dominantBaseline='middle'
						style={{
							fontSize: 13,
							fontWeight: 500,
							fill: '#64748b',
						}}
					>
						токенов / 10 сек
					</text>
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	)
}
