const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const projects = await Project.find()
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments();

    res.json({ projects, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, techStack, githubUrl, coverImage } = req.body;

    const project = new Project({
      name,
      description,
      techStack: techStack || [],
      githubUrl,
      coverImage,
      creator: req.user.id
    });

    await project.save();
    await project.populate('creator', 'username avatar');

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'username avatar');

    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权修改此项目' });
    }

    const updates = req.body;
    updates.updatedAt = Date.now;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('creator', 'username avatar');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权删除此项目' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;