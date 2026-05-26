const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, school, major, skills } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: '用户已存在' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: '用户名已被使用' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
      school,
      major,
      skills: skills || []
    });

    await user.save();

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '邮箱或密码错误' });
    }

    if (!user.password) {
      return res.status(400).json({ message: '此账号使用GitHub登录' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '邮箱或密码错误' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;