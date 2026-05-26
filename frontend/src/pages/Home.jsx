import { useState, useEffect } from 'react';
import { Card, Tag, Button, Avatar, Input, Space, Spin, Pagination } from 'antd';
import { HeartOutlined, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { postAPI, tagAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
    loadTags();
  }, [page, selectedTag]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (selectedTag) params.tag = selectedTag;
      const res = await postAPI.getAll(params);
      setPosts(res.data.posts);
      setTotal(res.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const res = await tagAPI.getAll();
      setTags(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <Input
            placeholder="搜索帖子..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        <Spin spinning={loading}>
          {posts.map(post => (
            <Card 
              key={post._id} 
              hoverable
              style={{ marginBottom: '16px', cursor: 'pointer' }}
              onClick={() => handlePostClick(post._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ marginBottom: '8px' }}>{post.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#666', fontSize: '14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Avatar size="small" src={post.author?.avatar} />
                      {post.author?.username}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ClockCircleOutlined size="14" />
                      {formatDate(post.createdAt)}
                    </span>
                    {post.type === 'question' && (
                      <Tag color="orange">问答</Tag>
                    )}
                    {post.isResolved && (
                      <Tag color="green">已解决</Tag>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#666' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <HeartOutlined />
                    {post.likes?.length || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageOutlined />
                    {post.comments?.length || 0}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
                {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
              </div>
              <div style={{ marginTop: '12px' }}>
                {post.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </Card>
          ))}
        </Spin>
        <Pagination 
          current={page} 
          total={total} 
          pageSize={10}
          onChange={(page) => setPage(page)}
          style={{ marginTop: '24px', textAlign: 'center' }}
        />
      </div>
      <div style={{ width: 280 }}>
        <Card title="热门标签" style={{ marginBottom: '16px' }}>
          <Space wrap>
            {tags.map(tag => (
              <Tag 
                key={tag.name} 
                color={selectedTag === tag.name ? 'blue' : undefined}
                onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                style={{ cursor: 'pointer' }}
              >
                {tag.name} ({tag.count})
              </Tag>
            ))}
          </Space>
        </Card>
        <Card title="活跃用户">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Avatar size="small" icon="user" />
            <div>
              <div style={{ fontWeight: 'bold' }}>用户1</div>
              <div style={{ fontSize: '12px', color: '#666' }}>发布了 10 篇帖子</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Avatar size="small" icon="user" />
            <div>
              <div style={{ fontWeight: 'bold' }}>用户2</div>
              <div style={{ fontSize: '12px', color: '#666' }}>发布了 8 篇帖子</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar size="small" icon="user" />
            <div>
              <div style={{ fontWeight: 'bold' }}>用户3</div>
              <div style={{ fontSize: '12px', color: '#666' }}>发布了 6 篇帖子</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}