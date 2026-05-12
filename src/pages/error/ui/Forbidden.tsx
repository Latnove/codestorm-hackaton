import { Result } from 'antd'

export const Forbidden = () => {
  return <div className="container"><Result status="403" title="Forbidden" /></div>
}
