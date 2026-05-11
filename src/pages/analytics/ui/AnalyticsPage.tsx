import { mockAnalyticsEvents } from '@/entities/analytics'
import { Card, Col, Row, Space, Statistic, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

type AnalyticsRow = {
  miniappName: string
  launches: number
  errors: number
}

export const AnalyticsPage = () => {
  const uniqueUsers = new Set(mockAnalyticsEvents.map((event) => event.username)).size
  const rows = Object.values(
    mockAnalyticsEvents.reduce<Record<string, AnalyticsRow>>((acc, event) => {
      acc[event.miniappId] ??= {
        miniappName: event.miniappName,
        launches: 0,
        errors: 0,
      }
      if (event.event === 'launch') {
        acc[event.miniappId].launches += 1
      }
      if (event.event === 'error') {
        acc[event.miniappId].errors += 1
      }
      return acc
    }, {}),
  )

  const columns: ColumnsType<AnalyticsRow> = [
    { title: 'Miniapp', dataIndex: 'miniappName' },
    { title: 'Launches', dataIndex: 'launches' },
    { title: 'Errors', dataIndex: 'errors' },
  ]

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Title level={1}>Analytics</Title>
      <Row gutter={[16, 16]}>
        <Col lg={6} sm={12} xs={24}>
          <Card><Statistic title="Total launches" value={mockAnalyticsEvents.length} /></Card>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Card><Statistic title="Launches today" value={mockAnalyticsEvents.length} /></Card>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Card><Statistic title="Unique users" value={uniqueUsers} /></Card>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Card><Statistic title="Errors" value={mockAnalyticsEvents.filter((event) => event.event === 'error').length} /></Card>
        </Col>
      </Row>
      <Card title="Top miniapps">
        <Table<AnalyticsRow>
          columns={columns}
          dataSource={rows}
          pagination={false}
          rowKey="miniappName"
        />
      </Card>
    </Space>
  )
}
