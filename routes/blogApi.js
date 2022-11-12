const express = require('express');
const router = express.Router();

const Blog = require('../models/Blog');

router.get('/', async (request, response) => {
  const blogLists = await Blog.find({});
  response.json(blogLists);
});

router.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = router;