import { getMockMiniappById } from '@/entities/miniapp'
import { Alert, Card, Result, Space, Steps, Typography } from 'antd'
import { useParams } from 'react-router-dom'

const { Title } = Typography

export const LaunchPage = () => {
  const { miniappId = '' } = useParams()
  const miniapp = getMockMiniappById(miniappId)

  if (!miniapp) {
    return <Result status="404" title="Not found" />
  }

  if (miniapp.status === 'disabled') {
    return <Result status="warning" title="Miniapp disabled" />
  }

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Title level={1}>{miniapp.name}</Title>
      <Card>
        <Steps
          current={4}
          items={[
            { title: 'Loading miniapp' },
            { title: 'Checking status' },
            { title: 'Checking miniapp status' },
            { title: 'Preparing WebView' },
            { title: 'Opening miniapp' },
          ]}
        />
      </Card>
      <Alert message={`openMiniapp({ miniappId: "${miniapp.id}" })`} type="info" />
      <iframe
        src={miniapp.launchUrl}
        style={{ background: '#fff', border: '1px solid #dfe7f5', borderRadius: 16, minHeight: 620, width: '100%' }}
        title={miniapp.name}
      />
    </Space>
  )
}
