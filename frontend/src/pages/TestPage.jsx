export default function TestPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
      }}>
        <h1 style={{ color: '#1890ff', textAlign: 'center' }}>校园开发者平台</h1>
        <p style={{ textAlign: 'center', color: '#666', marginTop: '16px' }}>测试页面正常显示！</p>
        <a href="/login" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: '#1890ff' }}>
          返回登录页面
        </a>
      </div>
    </div>
  );
}