import { getMockMiniappById, type Miniapp } from '@/entities/miniapp'
import { buildLaunchRoute, ROUTES } from '@/shared/config'
import { Button, Card, Descriptions, Form, Input, Select, Space, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'

const { Title } = Typography

type MiniappForm = Pick<Miniapp, 'name' | 'description' | 'launchUrl' | 'version' | 'status'> & {
  allowedRoles: string
}

export const EditMiniappPage = () => {
  const navigate = useNavigate()
  const { miniappId = '' } = useParams()
  const miniapp = getMockMiniappById(miniappId)

  if (!miniapp) {
    return <Card><Title level={2}>Miniapp not found</Title></Card>
  }

  const handleFinish = () => {
    navigate(ROUTES.MINIAPPS)
  }

  const updateStatus = () => {
    navigate(ROUTES.MINIAPPS)
  }

  return (
    <Space direction="vertical" size={20} style={{ maxWidth: 840, width: '100%' }}>
      <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
        <Title level={1}>Edit miniapp</Title>
        <Link to={buildLaunchRoute(miniapp.id)}><Button>Preview Launch</Button></Link>
      </Space>
      <Card>
        <Descriptions
          bordered
          column={1}
          items={[
            { key: 'id', label: 'ID', children: miniapp.id },
            { key: 'createdAt', label: 'Created', children: miniapp.createdAt },
            { key: 'updatedAt', label: 'Updated', children: miniapp.updatedAt },
          ]}
        />
      </Card>
      <Card>
        <Form<MiniappForm>
          initialValues={{ ...miniapp, allowedRoles: miniapp.allowedRoles.join(', ') }}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Launch URL" name="launchUrl" rules={[{ required: true, type: 'url' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Version" name="version">
            <Input />
          </Form.Item>
          <Form.Item label="Allowed roles" name="allowedRoles" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Disabled', value: 'disabled' },
              ]}
            />
          </Form.Item>
          <Space wrap>
            <Button htmlType="submit" type="primary">Save</Button>
            <Button onClick={updateStatus}>Publish</Button>
            <Button onClick={updateStatus} danger>Disable</Button>
          </Space>
        </Form>
      </Card>
    </Space>
  )
}
