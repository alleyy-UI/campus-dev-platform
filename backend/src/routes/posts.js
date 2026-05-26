const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, type } = req.query;
    let query = {};

    if (tag) {
      query.tags = tag;
    }
    if (type) {
      query.type = type;
    }

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({ posts, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, type, tags } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user.id,
      type: type || 'post',
      tags: tags || []
    });

    await post.save();
    await post.populate('author', 'username avatar');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar');

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权修改此帖子' });
    }

    const updates = req.body;
    updates.updatedAt = Date.now;

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true
    }).populate('author', 'username avatar');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权删除此帖子' });
    }

    await Comment.deleteMany({ post: req.params.id });
    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    await post.populate('author', 'username avatar');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;