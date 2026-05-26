import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Avatar, Tag, Tabs, Spin, message } from 'antd';
import { UserOutlined, HeartOutlined, BookOpenOutlined, BriefcaseOutlined, EditOutlined } from '@ant-design/icons';
import { userAPI, postAPI, projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { TabPane } = Tabs;

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
    loadPosts();
    loadProjects();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getById(id);
      setProfile(res.data);
      if (user) {
        setIsFollowing(res.data.followers.includes(user._id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await postAPI.getAll({ author: id });
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await projectAPI.getAll({ creator: id });
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userAPI.unfollow(id);
        setIsFollowing(false);
        profile.followers = profile.followers.filter(f => f !== user._id);
      } else {
        await userAPI.follow(id);
        setIsFollowing(true);
        profile.followers.push(user._id);
      }
      setProfile({ ...profile });
    } catch (error) {
      message.error('操作失败');
    }
  };

  if (loading) {
    return <Spin />;
  }

  if (!profile) {
    return <div>用户不存在</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Avatar 
            size={120} 
            src={profile.avatar} 
            icon={<UserOutlined />}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>{profile.username}</h1>
            <p style={{ color: '#666', marginBottom: '16px' }}>{profile.bio || '暂无简介'}</p>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', color: '#666' }}>
              <span>
                <BookOpenOutlined style={{ marginRight: '4px' }} />
                {profile.school || '未知学校'}
              </span>
              <span>
                <BriefcaseOutlined style={{ marginRight: '4px' }} />
                {profile.major || '未知专业'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
              <span>
                <span style={{ fontWeight: 'bold', marginRight: '4px' }}>{profile.followers.length}</span>
                粉丝
              </span>
              <span>
                <span style={{ fontWeight: 'bold', marginRight: '4px' }}>{profile.following.length}</span>
                关注
              </span>
            </div>
            {user && user._id !== id && (
              <Button 
                type={isFollowing ? 'default' : 'primary'} 
                onClick={handleFollow}
              >
                {isFollowing ? '取消关注' : '关注'}
              </Button>
            )}
          </div>
        </div>
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>技能标签</div>
            {profile.skills.map(skill => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        )}
      </Card>
      <Tabs style={{ marginTop: '16px' }}>
        <TabPane tab={`我的帖子 (${posts.length})`} key="posts">
          <div style={{ marginTop: '16px' }}>
            {posts.map(post => (
              <Card key={post._id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3>{post.title}</h3>
                    <p style={{ color: '#666', marginTop: '8px' }}>
                      {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: '#666' }}>
                    <span><HeartOutlined /> {post.likes?.length || 0}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabPane>
        <TabPane tab={`我的项目 (${projects.length})`} key="projects">
          <div style={{ marginTop: '16px' }}>
            {projects.map(project => (
              <Card key={project._id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3>{project.name}</h3>
                    <p style={{ color: '#666', marginTop: '8px' }}>{project.description}</p>
                    {project.techStack && (
                      <div style={{ marginTop: '8px' }}>
                        {project.techStack.map(tech => (
                          <Tag key={tech}>{tech}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}