import { mockAuditLogs, type AuditLog } from '@/entities/audit-log'
import { Card, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

export const AuditLogsPage = () => {
  const columns: ColumnsType<AuditLog> = [
    { title: 'Date', dataIndex: 'date' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Action', dataIndex: 'action' },
    { title: 'Entity type', dataIndex: 'entityType' },
    { title: 'Entity name', dataIndex: 'entityName' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: AuditLog['status']) => (
        <Tag color={value === 'success' ? 'green' : 'red'}>{value}</Tag>
      ),
    },
    { title: 'Details', dataIndex: 'details' },
  ]

  return (
    <Card>
      <Title level={1}>Audit logs</Title>
      <Table<AuditLog>
        columns={columns}
        dataSource={mockAuditLogs}
        rowKey="id"
        scroll={{ x: 960 }}
      />
    </Card>
  )
}
