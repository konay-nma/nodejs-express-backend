const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to ', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })

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
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedNote) => {
        returnedNote.id = returnedNote._id.toString()
        delete returnedNote._id
        delete returnedNote.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)