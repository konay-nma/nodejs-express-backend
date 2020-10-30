const moongose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new moongose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    //the password hash should not be revlaed
    delete returnedObj.passwordHash
  }
})

const User = moongose.model('User', userSchema)

module.exports = User
