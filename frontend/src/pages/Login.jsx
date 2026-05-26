import { useState } from 'react';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('登录成功！');
      navigate('/home');
    } catch (error) {
      message.error(error.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>校园开发者平台</h2>
          <p style={{ color: '#666', marginTop: 8 }}>欢迎回来！</p>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效邮箱' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <Divider plain>或</Divider>
        <Button icon={<GithubOutlined />} style={{ width: '100%' }}>
          GitHub登录
        </Button>
        <p style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
          还没有账号？<a href="/register" style={{ color: '#1890ff' }}>立即注册</a>
        </p>
      </Card>
    </div>
  );
}
