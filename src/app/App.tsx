import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import 'normalize.css'
import { AppRouter } from './providers'
import './styles/index.css'
import './styles/variables.css'

function App() {
	return (
		<ConfigProvider
			locale={ruRU}
			theme={{
				token: {
					colorPrimary: '#5d7cf5',
					colorInfo: '#5d7cf5',
					colorBgBase: '#f7f9ff',
					colorTextBase: '#1f2937',
					borderRadius: 10,
					fontFamily: 'Montserrat, "Segoe UI", sans-serif',
				},
				components: {
					Button: {
						borderRadius: 10,
						controlHeight: 42,
						fontWeight: 700,
					},
					Card: {
						borderRadiusLG: 18,
					},
					Input: {
						borderRadius: 10,
						controlHeight: 44,
					},
				},
			}}
		>
			<AppRouter />
		</ConfigProvider>
	)
}

export default App
