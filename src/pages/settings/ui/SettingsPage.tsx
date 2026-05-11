import { mockSettings } from '@/entities/settings'
import { Card, Descriptions, Typography } from 'antd'

const { Title } = Typography

export const SettingsPage = () => {
  return (
    <Card>
      <Title level={1}>Settings</Title>
      <Descriptions
        bordered
        column={1}
        items={[
          { key: 'serviceName', label: 'serviceName', children: mockSettings.serviceName },
          { key: 'apiBaseUrl', label: 'apiBaseUrl', children: mockSettings.apiBaseUrl },
          { key: 'authMode', label: 'authMode', children: mockSettings.authMode },
          { key: 'tokenTTL', label: 'tokenTTL', children: mockSettings.tokenTTL },
          {
            key: 'allowedOrigins',
            label: 'allowedOrigins',
            children: mockSettings.allowedOrigins.join(', '),
          },
          {
            key: 'defaultRoles',
            label: 'defaultRoles',
            children: mockSettings.defaultRoles.join(', '),
          },
        ]}
      />
    </Card>
  )
}
