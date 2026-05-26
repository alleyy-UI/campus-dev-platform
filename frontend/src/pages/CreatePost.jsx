import { useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { postAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const tagOptions = [
  'JavaScript', 'Python', 'Java', 'React', 'Vue', 'Node.js', 
  'TypeScript', 'Go', 'Rust', 'Docker', 'Kubernetes', 'MongoDB',
  'MySQL', 'PostgreSQL', 'Git', 'GitHub', '算法', '数据结构',
  '前端', '后端', '全栈', '人工智能', '机器学习'
];

export default function CreatePost() {
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await postAPI.create({
        title: values.title,
        content: values.content,
        type: values.type,
        tags: selectedTags
      });
      message.success('发布成功');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || '发布失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags([...selectedTags, customTag]);
      setCustomTag('');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card title="发布帖子">
        <Form
          name="create-post"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="type"
            label="类型"
            initialValue="post"
          >
            <Select>
              <Select.Option value="post">文章</Select.Option>
              <Select.Option value="question">问答</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea 
              rows={12} 
              placeholder="支持 Markdown 格式，代码块使用 ``` 包裹"
            />
          </Form.Item>
          <Form.Item label="标签">
            <div style={{ marginBottom: '12px' }}>
              {selectedTags.map(tag => (
                <TagOutlined 
                  key={tag} 
                  style={{ 
                    display: 'inline-block', 
                    background: '#1890ff', 
                    color: '#fff', 
                    padding: '4px 12px', 
                    borderRadius: '4px',
                    marginRight: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </TagOutlined>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <Input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="自定义标签"
                onPressEnter={handleAddCustomTag}
                style={{ width: 200 }}
              />
              <Button onClick={handleAddCustomTag}>添加</Button>
            </div>
            <div>
              {tagOptions.map(tag => (
                <TagOutlined
                  key={tag}
                  style={{
                    display: 'inline-block',
                    background: '#f0f0f0',
                    color: '#666',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    marginRight: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </TagOutlined>
              ))}
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              发布
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}