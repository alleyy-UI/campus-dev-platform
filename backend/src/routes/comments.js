const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/posts/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/posts/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      post: req.params.postId
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    post.comments.push(comment.id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权修改此评论' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    ).populate('author', 'username avatar');

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权删除此评论' });
    }

    await Post.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: req.params.id } }
    );

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id/best-answer', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const post = await Post.findById(comment.post);

    if (!comment || !post) {
      return res.status(404).json({ message: '评论或帖子不存在' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权设置最佳答案' });
    }

    comment.isBestAnswer = true;
    post.isResolved = true;

    await comment.save();
    await post.save();
    await comment.populate('author', 'username avatar');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;