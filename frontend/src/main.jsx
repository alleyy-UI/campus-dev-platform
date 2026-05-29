import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'

// 登录页面
function LoginPage() {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', textAlign: 'center', marginBottom: '16px' }}>
          校园开发者平台
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
          欢迎回来！
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>邮箱</label>
          <input 
            type="email" 
            placeholder="请输入邮箱"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>密码</label>
          <input 
            type="password" 
            placeholder="请输入密码"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#1890ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
          登录（演示）
        </button>
        <div style={{ marginTop: '24px', textAlign: 'center', color: '#666' }}>
          还没有账号？<span 
            onClick={() => navigate('/register')} 
            style={{ color: '#1890ff', cursor: 'pointer' }}>
            立即注册
          </span>
        </div>
      </div>
    </div>
  );
}

// 注册页面
function RegisterPage() {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', textAlign: 'center', marginBottom: '16px' }}>
          校园开发者平台
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
          创建账号
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>用户名</label>
          <input 
            type="text" 
            placeholder="请输入用户名"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>邮箱</label>
          <input 
            type="email" 
            placeholder="请输入邮箱"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>学校</label>
          <input 
            type="text" 
            placeholder="请输入学校"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>密码</label>
          <input 
            type="password" 
            placeholder="请输入密码"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#52c41a', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
          注册（演示）
        </button>
        <div style={{ marginTop: '24px', textAlign: 'center', color: '#666' }}>
          已有账号？<span 
            onClick={() => navigate('/login')} 
            style={{ color: '#1890ff', cursor: 'pointer' }}>
            立即登录
          </span>
        </div>
      </div>
    </div>
  );
}

// 首页
function HomePage() {
  const navigate = useNavigate();
  
  const menuItems = [
    { name: '首页', path: '/home' },
    { name: '发布', path: '/create' },
    { name: '代码运行', path: '/code' },
    { name: '个人中心', path: '/profile/1' },
    { name: '聊天', path: '/chat' },
  ];
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <div style={{ width: '240px', background: '#001529', padding: '24px 0' }}>
        <h2 style={{ color: 'white', padding: '0 24px', marginBottom: '32px' }}>校园开发者平台</h2>
        {menuItems.map(item => (
          <div 
            key={item.name}
            onClick={() => navigate(item.path)}
            style={{ 
              padding: '12px 24px', 
              color: 'white', 
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#1890ff'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            {item.name}
          </div>
        ))}
      </div>
      
      {/* 主内容 */}
      <div style={{ flex: 1, padding: '24px', background: '#f0f2f5' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>首页</h1>
        
        {/* 热门标签 */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>热门标签</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['JavaScript', 'Python', 'React', 'Node.js', 'Java', '算法'].map(tag => (
              <span 
                key={tag} 
                style={{ 
                  background: '#e6f7ff', 
                  color: '#1890ff', 
                  padding: '4px 12px', 
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* 帖子列表 */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '16px' }}>帖子列表</h3>
          <p style={{ color: '#666' }}>还没有帖子，去发布一个吧！</p>
          <button 
            onClick={() => navigate('/create')}
            style={{ 
              marginTop: '16px',
              padding: '8px 16px', 
              background: '#1890ff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            发布帖子
          </button>
        </div>
      </div>
    </div>
  );
}

// 其他页面模板
function TemplatePage({ title }) {
  const navigate = useNavigate();
  
  const menuItems = [
    { name: '首页', path: '/home' },
    { name: '发布', path: '/create' },
    { name: '代码运行', path: '/code' },
    { name: '个人中心', path: '/profile/1' },
    { name: '聊天', path: '/chat' },
  ];
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '240px', background: '#001529', padding: '24px 0' }}>
        <h2 style={{ color: 'white', padding: '0 24px', marginBottom: '32px' }}>校园开发者平台</h2>
        {menuItems.map(item => (
          <div 
            key={item.name}
            onClick={() => navigate(item.path)}
            style={{ 
              padding: '12px 24px', 
              color: 'white', 
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#1890ff'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            {item.name}
          </div>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '24px', background: '#f0f2f5' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>{title}</h1>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
          <p style={{ color: '#666' }}>这个页面正在开发中...</p>
        </div>
      </div>
    </div>
  );
}

// 主应用
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create" element={<TemplatePage title="发布帖子" />} />
      <Route path="/code" element={<TemplatePage title="代码运行" />} />
      <Route path="/profile/:id" element={<TemplatePage title="个人中心" />} />
      <Route path="/chat" element={<TemplatePage title="聊天" />} />
      <Route path="/post/:id" element={<TemplatePage title="帖子详情" />} />
    </Routes>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
