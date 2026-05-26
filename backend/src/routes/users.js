const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: '无权修改此用户信息' });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/:id/follow', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id === userId) {
      return res.status(400).json({ message: '不能关注自己' });
    }

    const user = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (user.followers.includes(req.user.id)) {
      return res.status(400).json({ message: '已关注此用户' });
    }

    user.followers.push(req.user.id);
    currentUser.following.push(userId);

    await user.save();
    await currentUser.save();

    res.json({ message: '关注成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id === userId) {
      return res.status(400).json({ message: '不能取消关注自己' });
    }

    const user = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (!user.followers.includes(req.user.id)) {
      return res.status(400).json({ message: '未关注此用户' });
    }

    user.followers = user.followers.filter(id => id.toString() !== req.user.id);
    currentUser.following = currentUser.following.filter(id => id.toString() !== userId);

    await user.save();
    await currentUser.save();

    res.json({ message: '取消关注成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;