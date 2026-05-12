import { mockRealmMiniapps } from '@/entities/miniapp'
import { Alert, Card, Result, Space, Steps, Typography } from 'antd'
import { useParams } from 'react-router-dom'

const { Title } = Typography

export const LaunchPage = () => {
  const { miniappId = '' } = useParams()
  const miniapp = mockRealmMiniapps.find((item) => item.code === miniappId && item.status !== 'DELETED')

  if (!miniapp) {
    return <div className="container"><Result status="404" title="MiniApp не найден" /></div>
  }

  if (miniapp.status !== 'PUBLISHED') {
    return <div className="container"><Result status="warning" title="MiniApp не опубликован" /></div>
  }

  return (
    <Space className="container" direction="vertical" size={20} style={{ width: '100%' }}>
      <Title level={1}>{miniapp.name}</Title>
      <Card>
        <Steps
          current={4}
          items={[
            { title: 'Загрузка MiniApp' },
            { title: 'Проверка статуса' },
            { title: 'Проверка статуса MiniApp' },
            { title: 'Подготовка WebView' },
            { title: 'Открытие MiniApp' },
          ]}
        />
      </Card>
      <Alert message={`openMiniapp({ realmCode: "${miniapp.realmCode}", miniAppCode: "${miniapp.code}" })`} type="info" />
      <iframe
        src={miniapp.entryUrl}
        style={{ background: '#fff', border: '1px solid #dfe7f5', borderRadius: 16, minHeight: 620, width: '100%' }}
        title={miniapp.name}
      />
    </Space>
  )
}
