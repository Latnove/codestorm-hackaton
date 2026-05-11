import { mockMiniapps, type Miniapp } from '@/entities/miniapp'
import { buildLaunchRoute, buildMiniappEditRoute, ROUTES } from '@/shared/config'
import { Button, Card, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const { Title } = Typography

export const MiniappsPage = () => {
  const [miniapps, setMiniapps] = useState<Miniapp[]>(mockMiniapps)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>()

  const filteredMiniapps = useMemo(() => {
    return miniapps.filter((miniapp) => {
      const matchesSearch = miniapp.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status ? miniapp.status === status : true
      return matchesSearch && matchesStatus
    })
  }, [miniapps, search, status])

  const updateStatus = (miniappId: string, nextStatus: Miniapp['status']) => {
    const nextMiniapps = miniapps.map((miniapp) =>
      miniapp.id === miniappId
        ? { ...miniapp, status: nextStatus, updatedAt: new Date().toISOString() }
        : miniapp,
    )
    setMiniapps(nextMiniapps)
  }

  const deleteMiniapp = (miniappId: string) => {
    const nextMiniapps = miniapps.filter((miniapp) => miniapp.id !== miniappId)
    setMiniapps(nextMiniapps)
  }

  const columns: ColumnsType<Miniapp> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'Launch URL', dataIndex: 'launchUrl' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: Miniapp['status']) => <Tag color={value === 'published' ? 'green' : value === 'disabled' ? 'red' : 'blue'}>{value}</Tag>,
    },
    { title: 'Roles', dataIndex: 'allowedRoles', render: (roles: string[]) => roles.join(', ') },
    { title: 'Version', dataIndex: 'version' },
    { title: 'Created', dataIndex: 'createdAt', render: (value: string) => new Date(value).toLocaleDateString() },
    {
      title: 'Actions',
      render: (_, miniapp) => (
        <Space wrap>
          <Link to={buildMiniappEditRoute(miniapp.id)}>Edit</Link>
          <Button onClick={() => updateStatus(miniapp.id, 'published')} size="small">Publish</Button>
          <Button onClick={() => updateStatus(miniapp.id, 'disabled')} size="small">Disable</Button>
          <Button danger onClick={() => deleteMiniapp(miniapp.id)} size="small">Delete</Button>
          <Link to={buildLaunchRoute(miniapp.id)}>Open Launch</Link>
        </Space>
      ),
    },
  ]

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
        <Title level={1}>Miniapps</Title>
        <Link to={ROUTES.MINIAPP_CREATE}><Button type="primary">Create</Button></Link>
      </Space>
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search allowClear onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
          <Select
            allowClear
            onChange={setStatus}
            options={[
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' },
              { label: 'Disabled', value: 'disabled' },
            ]}
            placeholder="Status"
            style={{ width: 180 }}
          />
        </Space>
        <Table columns={columns} dataSource={filteredMiniapps} rowKey="id" scroll={{ x: 1180 }} />
      </Card>
    </Space>
  )
}
