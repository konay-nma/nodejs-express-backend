// const http = require('http')
require('dotenv').config() // using dotenv lib, declare the global env variable 
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())

app.use(cors())
app.use(express.static('build'))

const Note = require('./models/note')
const { update } = require('./models/note')

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

//middlewar functions demo
const reqLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:', req.path);
  console.log('Body:', req.body)
  console.log('---');
  next()
}

app.get('/', (req, res) => {
  res.send('<h1>Hello Konay</h1>')
})

app.get('/api/notes', (req, res) => {
  // res.json(notes)
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body
  const note = {
    content: body.content,
    important: body.important
  }
  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => {
      next(error)
    })
})

app.use(reqLogger) // request.body is undefined!
//post
app.post('/api/notes', (req, res, next) => {
  const body = req.body
  if (body.content === undefined) return res.status(400).json({ error: 'content missing' })

  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false
  })

  note.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => {
      next(error)
    })
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(note => note.id))
    : 0
  return maxId + 1
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// handle of req with unkonwn endpint
app.use(unknownEndpoint) // call after res

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformated id' })
  }else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }
  next(error)
}

//handelr of req with results to error 
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
console.log('hello world')