import type { Miniapp } from '@/entities/miniapp'
import { ROUTES } from '@/shared/config'
import { Button, Card, Form, Input, Select, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

type MiniappForm = Pick<
  Miniapp,
  'name' | 'description' | 'iconUrl' | 'launchUrl' | 'version' | 'status'
> & {
  allowedRoles: string
}

export const CreateMiniappPage = () => {
  const navigate = useNavigate()

  const handleFinish = () => {
    navigate(ROUTES.MINIAPPS)
  }

  return (
    <Space direction="vertical" size={20} style={{ maxWidth: 760, width: '100%' }}>
      <Title level={1}>Create miniapp</Title>
      <Card>
        <Form<MiniappForm>
          initialValues={{ allowedRoles: 'admin, user', status: 'draft' }}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Icon URL" name="iconUrl">
            <Input />
          </Form.Item>
          <Form.Item label="Launch URL" name="launchUrl" rules={[{ required: true, type: 'url' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Version" name="version">
            <Input placeholder="1.0.0" />
          </Form.Item>
          <Form.Item label="Allowed roles" name="allowedRoles" rules={[{ required: true }]}>
            <Input placeholder="admin, user" />
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
          <Button htmlType="submit" type="primary">Create miniapp</Button>
        </Form>
      </Card>
    </Space>
  )
}
