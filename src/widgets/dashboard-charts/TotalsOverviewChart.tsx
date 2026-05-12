import type { DashboardMetricPoint } from '@/entities/dashboard'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { ChartCard } from './ui/ChartCard'

interface TotalsOverviewChartProps {
	latest: DashboardMetricPoint
}

export const TotalsOverviewChart = ({ latest }: TotalsOverviewChartProps) => {
	const data = [
		{
			fill: '#60a5fa',
			name: 'Успешные запуски',
			value: latest.launchSuccessTotal,
		},
		{
			fill: '#f87171',
			name: 'Отклоненные запуски',
			value: latest.launchDeniedTotal,
		},
		{
			fill: '#34d399',
			name: 'Успешные SSO',
			value: latest.ssoSuccessTotal,
		},
		{
			fill: '#fbbf24',
			name: 'Ошибки SSO',
			value: latest.ssoFailedTotal,
		},
		{
			fill: '#a78bfa',
			name: 'Host-токены',
			value: latest.hostTokensIssuedTotal,
		},
	]

	return (
		<ChartCard title='Итоговые значения платформы'>
			<ResponsiveContainer height={320} width='100%'>
				<BarChart
					barCategoryGap={10}
					data={data}
					layout='vertical'
					margin={{
						top: 12,
						right: 8,
						left: 12,
						bottom: 4,
					}}
				>
					<CartesianGrid
						stroke='#edf2fb'
						strokeDasharray='4 4'
						vertical={false}
					/>

					<XAxis
						allowDecimals={false}
						axisLine={false}
						type='number'
						tick={{
							fontSize: 12,
							fill: '#94a3b8',
						}}
						tickLine={false}
					/>

					<YAxis
						axisLine={false}
						dataKey='name'
						tick={{
							fontSize: 12,
							fill: '#64748b',
						}}
						tickLine={false}
						type='category'
						width={148}
					/>

					<Tooltip
						contentStyle={{
							border: '1px solid #e2e8f0',
							borderRadius: 14,
							boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
						}}
						cursor={{
							fill: 'rgba(148,163,184,0.08)',
						}}
					/>

					<Bar dataKey='value' name='Всего' radius={[0, 12, 12, 0]}>
						{data.map(item => (
							<Cell fill={item.fill} key={item.name} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	)
}
