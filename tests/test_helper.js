const Note = require('../models/note')
const User = require('../models/user')

const initialNote = [
  {
    content: 'HTML is easy',
    date: new Date(),
    impotant: false
  },
  {
    content: 'Browser can execute only javascript',
    date: new Date(),
    impotant: true
  }
]

const nonExistingID = async () => {
  const note = new Note({ content: 'willremoveissoon', date: new Date() })
  await note.save()
  await note.remove()
  return note._id.toString()
}

const notesInDB = async() => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async() => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialNote, nonExistingID, notesInDB, usersInDb }