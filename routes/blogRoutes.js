const express = require('express');
const Blog = require('../models/blog');
const auth = require('../middleware/auth');
const router = new express.Router();

const calculateReadingTime = (body) => {
  const words = body.split(' ').length;
  const readingTime = Math.ceil(words / 200);
  return readingTime;
};

router.post('/blogs', auth, async (req, res) => {
  const blog = new Blog({
    ...req.body,
    author: req.user._id,
    reading_time: calculateReadingTime(req.body.body)
  });
  try {
    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/blogs/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'body', 'state', 'tags'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });

    if (!blog) {
      return res.status(404).send();
    }

    updates.forEach((update) => (blog[update] = req.body[update]));
    blog.reading_time = calculateReadingTime(blog.body);
    await blog.save();
    res.send(blog);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/blogs/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });

    if (!blog) {
      res.status(404).send();
    }

    res.send(blog);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/blogs', async (req, res) => {
  const { page = 1, limit = 20, author, title, tags, sortBy } = req.query;
  const query = { state: 'published' };

  if (author) query.author = author;
  if (title) query.title = new RegExp(title, 'i');
  if (tags) query.tags = { $in: tags.split(',') };

  try {
    const blogs = await Blog.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .populate('author', 'first_name last_name email');
    res.send(blogs);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');
    if (!blog || blog.state !== 'published') {
      return res.status(404).send();
    }
    blog.read_count += 1;
    await blog.save();
    res.send(blog);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
