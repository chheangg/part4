const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user')

const getToken = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

router.get('/', async (request, response) => {
  const blogLists = await Blog.find({}).populate('user');
  response.json(blogLists);
});

router.post('/', async (request, response) => {
  const body = request.body;
  const token = getToken(request);
  const decodedToken = jwt.decode(token, process.env.SECRET);

  if (!decodedToken.id) {
    response.status(400).json({
      error: 'token missing or invalid'
    })
  }

  const firstUser = await User.findById(decodedToken.id);

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

router.get('/:id', async (request, response, next) => {
  const result = await Blog.findById(request.params.id).populate('user');
  if (result === null) {
    return response.status(404).end();
  }
  response.status(200).send(result);
})

module.exports = router;