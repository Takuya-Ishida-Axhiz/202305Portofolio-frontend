import { Layout, Menu } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useNavigate, Route, Routes, useParams, useLocation, Link } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import LiveEdit from './pages/LiveEdit'
// import LiveNew from './pages/LiveNew'
import LivesList from './pages/LivesList'

import styled from 'styled-components'
import LiveNew from './pages/LiveNew'

const menuItems = [
  {
    label: 'TOP',
    key: '/',
  },
  {
    label: '新規追加',
    key: '/live/new',
  },
]

const App: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <RecoilRoot>
      <Layout style={{ minHeight: '100vh' }}>
        <Header>
          <TitleDiv to={'/'}>20230305Portfolio</TitleDiv>
          <Menu
            items={menuItems}
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={(event: { key: any }) => {
              navigate(event.key)
            }}
          />
        </Header>
        <Routes>
          <Route index element={<LivesList />} />
          <Route path="live/edit/:liveId" element={<LiveEdit />} />
          <Route path="live/new" element={<LiveNew />} />
        </Routes>
      </Layout>
    </RecoilRoot>
  )
}

export default App

const TitleDiv = styled(Link)`
  float: left;
  width: 200px;
  color: white;
  text-align: center;
  margin-right: 50px;
`
