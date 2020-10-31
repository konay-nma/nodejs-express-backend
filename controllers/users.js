const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', async(req,res) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 }) //content and date data only
  res.json(users)
})

usersRouter.post('/', async(req,res) => {
  const body = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  console.log(passwordHash)
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

module.exports = usersRouter