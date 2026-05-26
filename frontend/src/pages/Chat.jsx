import { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Avatar, List, message } from 'antd';
import { SendOutlined, MessageCircleOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const { TextArea } = Input;

const mockContacts = [
  { id: '1', name: '用户A', avatar: '', lastMessage: '你好！', unread: 2 },
  { id: '2', name: '用户B', avatar: '', lastMessage: '代码写好了吗？', unread: 0 },
  { id: '3', name: '用户C', avatar: '', lastMessage: '这个问题我来看看', unread: 1 },
];

export default function Chat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState(mockContacts);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      if (user) {
        newSocket.emit('login', user._id);
      }
    });

    newSocket.on('newMessage', (data) => {
      if (selectedContact && data.from === selectedContact.id) {
        setMessages(prev => [...prev, {
          from: 'other',
          content: data.message,
          timestamp: new Date(data.timestamp)
        }]);
      }
      setContacts(prev => prev.map(c => 
        c.id === data.from 
          ? { ...c, lastMessage: data.message, unread: c.unread + 1 }
          : c
      ));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setMessages([
      { from: 'other', content: '你好！有什么可以帮你的？', timestamp: new Date() },
      { from: 'me', content: '你好！我想请教一个问题', timestamp: new Date() },
    ]);
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, unread: 0 } : c
    ));
  };

  const handleSend = () => {
    if (!inputValue.trim() || !selectedContact) return;

    const newMessage = {
      from: 'me',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    if (socket && selectedContact) {
      socket.emit('sendMessage', { to: selectedContact.id, message: inputValue });
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 150px)' }}>
      <div style={{ width: 300 }}>
        <Card title="联系人">
          <List
            dataSource={contacts}
            renderItem={(item) => (
              <List.Item 
                onClick={() => handleSelectContact(item)}
                style={{ cursor: 'pointer', padding: '12px', borderRadius: '8px' }}
                className={selectedContact?.id === item.id ? 'ant-list-item-active' : ''}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<MessageCircleOutlined />} />}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name}</span>
                      {item.unread > 0 && (
                        <span style={{ 
                          background: '#ff4d4f', 
                          color: '#fff', 
                          borderRadius: '50%', 
                          width: '20px', 
                          height: '20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}>
                          {item.unread}
                        </span>
                      )}
                    </div>
                  }
                  description={item.lastMessage}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
      <div style={{ flex: 1 }}>
        {selectedContact ? (
          <Card 
            title={selectedContact.name} 
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  style={{ 
                    display: 'flex', 
                    justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
                    marginBottom: '16px'
                  }}
                >
                  <div 
                    style={{ 
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: msg.from === 'me' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                      background: msg.from === 'me' ? '#1890ff' : '#f0f0f0',
                      color: msg.from === 'me' ? '#fff' : '#333'
                    }}
                  >
                    <p>{msg.content}</p>
                    <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.6 }}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <TextArea
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                placeholder="输入消息..."
                style={{ flex: 1 }}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
                发送
              </Button>
            </div>
          </Card>
        ) : (
          <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#666' }}>
              <MessageCircleOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <p>选择一个联系人开始聊天</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}