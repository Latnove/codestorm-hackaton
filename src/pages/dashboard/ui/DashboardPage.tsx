import { mockAnalyticsEvents } from '@/entities/analytics'
import { mockAuditLogs } from '@/entities/audit-log'
import { mockMiniapps } from '@/entities/miniapp'
import { ROUTES } from '@/shared/config'
import { Button, Card, Col, List, Row, Space, Statistic, Typography } from 'antd'
import { Link } from 'react-router-dom'

const { Text, Title } = Typography

export const DashboardPage = () => {
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Row align="middle" justify="space-between" gutter={[16, 16]}>
        <Col>
          <Text type="secondary">Overview</Text>
          <Title level={1}>Dashboard</Title>
        </Col>
        <Col>
          <Link to={ROUTES.MINIAPP_CREATE}>
            <Button type="primary">Create miniapp</Button>
          </Link>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col lg={4} sm={12} xs={24}><Card><Statistic title="Total miniapps" value={mockMiniapps.length} /></Card></Col>
        <Col lg={4} sm={12} xs={24}><Card><Statistic title="Published" value={mockMiniapps.filter((item) => item.status === 'published').length} /></Card></Col>
        <Col lg={4} sm={12} xs={24}><Card><Statistic title="Draft" value={mockMiniapps.filter((item) => item.status === 'draft').length} /></Card></Col>
        <Col lg={4} sm={12} xs={24}><Card><Statistic title="Disabled" value={mockMiniapps.filter((item) => item.status === 'disabled').length} /></Card></Col>
        <Col lg={4} sm={12} xs={24}><Card><Statistic title="Launches today" value={mockAnalyticsEvents.length} /></Card></Col>
        <Col lg={4} sm={12} xs={24}><Card><Statistic title="Errors" value={mockAnalyticsEvents.filter((event) => event.event === 'error').length} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col lg={8} xs={24}>
          <Card title="Последние miniapp">
            <List dataSource={mockMiniapps.slice(0, 5)} renderItem={(item) => <List.Item>{item.name}</List.Item>} />
          </Card>
        </Col>
        <Col lg={8} xs={24}>
          <Card title="Последние действия">
            <List dataSource={mockAuditLogs.slice(0, 5)} renderItem={(item) => <List.Item>{item.action} · {item.entityName}</List.Item>} />
          </Card>
        </Col>
        <Col lg={8} xs={24}>
          <Card title="Топ miniapp">
            <List dataSource={mockMiniapps.slice(0, 5)} renderItem={(item) => <List.Item>{item.name}</List.Item>} />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
