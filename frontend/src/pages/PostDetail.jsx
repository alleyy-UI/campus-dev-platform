import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Avatar, Input, Spin, message } from 'antd';
import { HeartOutlined, MessageOutlined, ClockCircleOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { TextArea } = Input;

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  useEffect(() => {
    if (post && user) {
      setIsLiked(post.likes?.includes(user._id));
    }
  }, [post, user]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const res = await postAPI.getById(id);
      setPost(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await commentAPI.getAll(id);
      setComments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await postAPI.like(id);
      setPost(res.data);
      setIsLiked(!isLiked);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    try {
      await commentAPI.create(id, { content: commentContent });
      setCommentContent('');
      loadComments();
      message.success('评论成功');
    } catch (error) {
      message.error('评论失败');
    }
  };

  const handleSetBestAnswer = async (commentId) => {
    try {
      await commentAPI.setBestAnswer(commentId);
      loadComments();
      loadPost();
      message.success('已设为最佳答案');
    } catch (error) {
      message.error('操作失败');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  if (loading) {
    return <Spin />;
  }

  if (!post) {
    return <div>帖子不存在</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginBottom: '16px' }}>
        返回首页
      </Button>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>{post.title}</h1>
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
        <div style={{ marginBottom: '16px' }}>
          {post.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div style={{ marginBottom: '24px', lineHeight: '1.8' }}>
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        <div style={{ display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
          <Button 
            icon={<HeartOutlined />} 
            onClick={handleLike}
            style={{ color: isLiked ? '#ff4d4f' : undefined }}
          >
            {post.likes?.length || 0} 点赞
          </Button>
          <Button icon={<MessageOutlined />}>
            {post.comments?.length || 0} 评论
          </Button>
        </div>
      </Card>
      <Card title={`评论 (${comments.length})`} style={{ marginTop: '16px' }}>
        <TextArea
          rows={3}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="写下你的评论..."
          onPressEnter={handleSubmitComment}
          style={{ marginBottom: '12px' }}
        />
        <Button type="primary" onClick={handleSubmitComment}>
          发表评论
        </Button>
        <div style={{ marginTop: '24px' }}>
          {comments.map(comment => (
            <div key={comment._id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar size="small" src={comment.author?.avatar} />
                  <span style={{ fontWeight: 'bold' }}>{comment.author?.username}</span>
                  <span style={{ color: '#666', fontSize: '12px' }}>{formatDate(comment.createdAt)}</span>
                </span>
                {post.author?._id === user?._id && !post.isResolved && !comment.isBestAnswer && (
                  <Button size="small" onClick={() => handleSetBestAnswer(comment._id)}>
                    设为最佳答案
                  </Button>
                )}
              </div>
              {comment.isBestAnswer && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <span style={{ color: '#52c41a', fontSize: '12px', fontWeight: 'bold' }}>最佳答案</span>
                </div>
              )}
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}