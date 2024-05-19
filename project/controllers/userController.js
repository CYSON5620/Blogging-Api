const Blog = require('../models/Blog');

async function getUserBlogs(req, res) {
  try {
    const { page = 1, limit = 20, state } = req.query;
    const query = { author: req.user._id };
    if (state) query.state = state;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
    const blogs = await Blog.paginate(query, options);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Implement other user controller functions

module.exports = { getUserBlogs };
