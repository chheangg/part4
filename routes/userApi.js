const express = require('express')
const Router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

Router.get('/', async (request, response) => {
  const users = await User.find({}, { passwordHash: 0 }).populate('blogs', { user: 0})
  response.json(users)
})

Router.post('/register', async (request, response) => {
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

Router.post('/login', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })

  if (!user) {
    response.status(400).status({
      error: "Username doesn't exist"
    })
  }

  const correctPassword = user === null ? False : await bcrypt.compare(body.password, user.passwordHash)
  
  if (!correctPassword) {
    response.status(400).status({
      error: "Password is incorrect"
    })
  }

  const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)


  response.status(200).send({ token, username: user.username, name: user.name})
})

module.exports = Router