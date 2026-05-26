const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});