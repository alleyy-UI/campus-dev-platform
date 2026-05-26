import { Layout as AntLayout, Menu, Button, Avatar } from 'antd';
import { 
  HomeOutlined, 
  CodeOutlined, 
  MessageOutlined, 
  UserOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  BookOpenOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = AntLayout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/create', icon: <PlusCircleOutlined />, label: '发布' },
  { key: '/code', icon: <CodeOutlined />, label: '代码运行' },
  { key: '/chat', icon: <MessageOutlined />, label: '聊天' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <BookOpenOutlined style={{ fontSize: '24px', color: '#fff' }} />
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>校园开发者平台</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar 
              src={user?.avatar} 
              icon={<UserOutlined />}
              onClick={() => navigate(`/profile/${user._id}`)}
              style={{ cursor: 'pointer' }}
            />
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: '#fff' }}>
              退出
            </Button>
          </div>
        </div>
      </Header>
      <AntLayout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Content style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}