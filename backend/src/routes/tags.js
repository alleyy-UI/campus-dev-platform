const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({}, 'tags');
    const tagCount = {};

    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const tags = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;