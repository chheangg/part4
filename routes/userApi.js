const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

Router.get('/', async (request, response) => {
  const users = await User.find({}, { passwordHash: 0 }).populate('blogs')
  response.json(users)
})

Router.post('/', async (request, response) => {
  const body = request.body

  const existingUser = await User.findOne({ username: body.username })

  if (body.password.length < 3) {
    response.status(400).json({
      error: 'Password is too short, password must be longer than 3 length'
    })
  }
  if (existingUser) {
    response.status(400).json({
      error: 'Username must be unique'
    })
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = Router