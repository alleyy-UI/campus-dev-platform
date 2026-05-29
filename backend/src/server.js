const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '请求过于频繁，请稍后再试'
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const codeRoutes = require('./routes/code');
const projectRoutes = require('./routes/projects');
const tagRoutes = require('./routes/tags');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tags', tagRoutes);

app.get('/', (req, res) => {
  res.send('校园开发者交流平台 API');
});

const users = {};

io.on('connection', (socket) => {
  socket.on('login', (userId) => {
    users[userId] = socket.id;
    socket.userId = userId;
  });

  socket.on('sendMessage', (data) => {
    const { to, message } = data;
    const receiverSocket = users[to];
    
    if (receiverSocket) {
      io.to(receiverSocket).emit('newMessage', {
        from: socket.userId,
        message,
        timestamp: Date.now()
      });
    }
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendRoomMessage', (data) => {
    const { roomId, message } = data;
    socket.to(roomId).emit('newRoomMessage', {
      from: socket.userId,
      message,
      timestamp: Date.now()
    });
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      delete users[socket.userId];
    }
  });
});

const PORT = process.env.PORT || 5000;

const User = require('./models/User');
const Post = require('./models/Post');

const sampleUsers = [
  {
    username: '张三',
    email: 'zhangsan@example.com',
    password: '$2a$10$EixZaYbB.rK4fl8x2q7Meu6Q6D2V5fF5Q5Q5Q5Q5Q5Q5Q5Q5Q',
    school: '北京大学',
    bio: '热爱编程的大学生',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan'
  },
  {
    username: '李四',
    email: 'lisi@example.com',
    password: '$2a$10$EixZaYbB.rK4fl8x2q7Meu6Q6D2V5fF5Q5Q5Q5Q5Q5Q5Q5Q5Q',
    school: '清华大学',
    bio: '全栈开发者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi'
  },
  {
    username: '王五',
    email: 'wangwu@example.com',
    password: '$2a$10$EixZaYbB.rK4fl8x2q7Meu6Q6D2V5fF5Q5Q5Q5Q5Q5Q5Q5Q5Q',
    school: '复旦大学',
    bio: '算法爱好者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu'
  }
];

const samplePosts = [
  {
    title: 'React 学习心得',
    content: '最近学习了 React 的 Hooks，感觉 useState 和 useEffect 真的很强大！分享一下我的学习笔记：\n\n1. useState 用于管理组件状态\n2. useEffect 处理副作用\n3. useContext 实现跨组件通信\n\n希望对大家有帮助！',
    tags: ['React', '前端', 'JavaScript'],
    type: 'article',
    likes: [],
    comments: []
  },
  {
    title: '如何学好数据结构？',
    content: '作为一名计算机专业的学生，数据结构总是学不好，有没有大佬给点建议？\n\n我觉得难点在于：\n1. 理解各种算法的时间复杂度\n2. 递归思维的培养\n3. 如何将算法应用到实际问题中\n\n欢迎大家一起讨论！',
    tags: ['算法', '数据结构', '学习'],
    type: 'question',
    isResolved: false,
    likes: [],
    comments: []
  },
  {
    title: 'Node.js 性能优化技巧',
    content: '在开发 Node.js 项目时，遇到了性能瓶颈，总结了一些优化技巧分享给大家：\n\n1. 使用缓存减少重复计算\n2. 合理使用异步编程\n3. 使用 Stream 处理大文件\n4. 定期清理内存泄漏\n\n希望对大家有帮助！',
    tags: ['Node.js', '后端', '性能优化'],
    type: 'article',
    likes: [],
    comments: []
  },
  {
    title: 'Python 爬虫入门教程',
    content: '刚学 Python 爬虫，分享一个简单的入门案例，爬取豆瓣电影Top250：\n\n使用 requests 库发送请求，BeautifulSoup 解析HTML。\n\n代码示例：\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = "https://movie.douban.com/top250"\nresponse = requests.get(url)\nsoup = BeautifulSoup(response.text, "html.parser")\n```\n\n完整教程可以看我的博客！',
    tags: ['Python', '爬虫', '教程'],
    type: 'article',
    likes: [],
    comments: []
  },
  {
    title: 'Git 常用命令总结',
    content: '整理了一些日常开发中常用的 Git 命令，分享给刚入门的小伙伴：\n\n- git init: 初始化仓库\n- git add .: 添加所有文件\n- git commit -m "message": 提交\n- git push origin main: 推送到远程\n- git pull origin main: 拉取更新\n\n建议大家多练习！',
    tags: ['Git', '工具', '开发'],
    type: 'article',
    likes: [],
    comments: []
  },
  {
    title: 'VS Code 必备插件推荐',
    content: '分享一些我常用的 VS Code 插件：\n\n1. ESLint - 代码检查\n2. Prettier - 代码格式化\n3. GitLens - Git 可视化\n4. Live Server - 实时预览\n5. Bracket Pair Colorizer - 括号着色\n\n这些插件大大提升了我的开发效率！',
    tags: ['VS Code', '工具', '开发'],
    type: 'article',
    likes: [],
    comments: []
  }
];

async function addSampleData() {
  try {
    await connectDB();
    
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log('Adding sample users...');
      const users = await User.insertMany(sampleUsers);
      
      console.log('Adding sample posts...');
      samplePosts.forEach(post => {
        post.author = users[Math.floor(Math.random() * users.length)]._id;
      });
      await Post.insertMany(samplePosts);
      
      console.log('Sample data added successfully!');
    }
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error adding sample data:', error);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

addSampleData();