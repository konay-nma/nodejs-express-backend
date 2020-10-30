const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (_document, returnedNote) => {
    returnedNote.id = returnedNote._id.toString()
    delete returnedNote._id
    delete returnedNote.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)