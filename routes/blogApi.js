const express = require('express');
const router = express.Router();

const Blog = require('../models/blog');

router.get('/', async (request, response) => {
  const blogLists = await Blog.find({});
  response.json(blogLists);
});

router.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save();
  response.status(201).json(result);
});

router.put('/:id', async (request, response) => {
  const newBlog = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  console.log(updatedBlog)
  if (updatedBlog === null) {
    console.log('hey');
    return response.status(404).end()
  }
  response.status(200).json(updatedBlog);
}) 

router.get('/:id', async (request, response, next) => {
  const result = await Blog.findById(request.params.id);
  if (result === null) {
    return response.status(404).end();
  }
  response.status(200).send(result);
})

module.exports = router;