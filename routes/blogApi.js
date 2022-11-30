const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user')

router.get('/', async (request, response) => {
  const blogLists = await Blog.find({}).populate('user', { blogs: 0 });
  response.json(blogLists);
});

router.post('/', async (request, response) => {
  const body = request.body;
  const tokenUser = request.user

  console.log(tokenUser)


  if (!tokenUser.id) {
    response.status(400).json({
      error: 'token missing or invalid'
    })
  }

  const firstUser = await User.findById(tokenUser.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: firstUser.id,
  })

  const result = await blog.save();

  firstUser.blogs = firstUser.blogs.concat(blog)
  await firstUser.save()

  response.status(201).json(result);
});

router.put('/:id', async (request, response) => {
  const newBlog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  console.log(updatedBlog)
  if (updatedBlog === null) {
    console.log('hey');
    return response.status(404).end()
  }
  response.status(200).json(updatedBlog);
})

router.delete('/:id', async (request, response) => {
  const targetBlog = await Blog.findById(request.params.id)
  const tokenUser = request.user

  if (!targetBlog) {
    response.status(404).json({
      error: 'Blog not found'
    })
  }

  if (!tokenUser.id) {
    response.status(404).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(tokenUser.id)

  if (targetBlog.user.toString() !== user.id.toString()) {
    response.status(400).json({
      error: `Not enough permission to delete blog ${targetBlog.id}`
    })
  }

  await targetBlog.delete()

  user.blogs = user.blogs.filter(blog => blog._id.toString() !== targetBlog._id.toString())
  await user.save()

  response.status(200).json(targetBlog)
})

router.get('/:id', async (request, response, next) => {
  const result = await Blog.findById(request.params.id).populate('user');
  if (result === null) {
    return response.status(404).end();
  }
  response.status(200).send(result);
})

module.exports = router;