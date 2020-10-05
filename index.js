// const http = require('http')
const express = require('express')
const app = express()
app.use(express.json())
const  cors = require('cors')
app.use(cors())
app.use(express.static('build'))

//middlewar functions demo
const reqLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:', req.path);
  console.log('Body:', req.body)
  console.log('---');
  next()
}
app.use(reqLogger) 

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

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

app.get('/', (req, res) => {
  res.send('<h1>Hello Konay</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()  //not found
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)

  res.status(204).end() // no content response
})

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)
  if(!note) return res.status(404).end()
  notes = notes.filter(note => note.id !== id)
  const body = req.body
  if (!body) return res.status(404).json({error : 'missing note'})
  notes = notes.concat(body)
  res.json(body)
})

//post
app.post('/api/notes', (req, res) => {

  const body = req.body
  if (!body) return res.status(404).json({error: 'content missing'})

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId()
  }
  
  notes = notes.concat(note)
  res.json(note)
})



const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(note => note.id))
    : 0
  return maxId +1
}

app.use(unknownEndpoint) // call after res

const PORT = process.env.PORT ||3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
console.log('hello world')