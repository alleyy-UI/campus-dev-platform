import { useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GraduationCapOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
        school: values.school,
        major: values.major,
        skills: values.skills?.split(',').map(s => s.trim()) || []
      });
      message.success('注册成功');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Card style={{ width: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>创建账号</h2>
          <p style={{ color: '#666', marginTop: 8 }}>加入校园开发者社区</p>
        </div>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效邮箱' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="school"
            label="学校"
            rules={[{ required: true, message: '请输入学校' }]}
          >
            <Input prefix={<GraduationCapOutlined />} placeholder="请输入学校名称" />
          </Form.Item>
          <Form.Item
            name="major"
            label="专业"
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Input placeholder="请输入专业名称" />
          </Form.Item>
          <Form.Item
            name="skills"
            label="技能标签"
          >
            <Input placeholder="多个技能用逗号分隔，如：JavaScript, React, Node.js" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              注册
            </Button>
          </Form.Item>
        </Form>
        <p style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
          已有账号？<a href="/login">立即登录</a>
        </p>
      </Card>
    </div>
  );
}