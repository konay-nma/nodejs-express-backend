const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    const noteObj = helper.initialNote.map(note => new Note(note))
    const promiseArray = noteObj.map(note => note.save())
    await Promise.all(promiseArray) //resolve promosied array to single one
    //good solution
    // for (let note of helper.initialNote) {
    //   let noteObject = new Note(note)
    //   await noteObject.save()
    //   console.log('saved')
    // }

  //bad solution
  // console.log('cleared')
  // helper.initialNote.forEach(async (note) => {
  //   let noteObj = new Note(note)
  //   await noteObj.save()
  //   console.log('saved')
  // })
  // console.log('done')
  })

  test('notes are return as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(helper.initialNote.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(note => note.content)
    expect(contents).toContain('Browser can execute only javascript')
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDB()

      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
      expect(resultNote.body).toEqual(processedNoteToView)
    })

    test('fails with status codew 404 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of new note', () => {
    test('succeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true
      }
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const notesAtEnd = await helper.notesInDB()
      expect(notesAtEnd).toHaveLength(helper.initialNote.length + 1)
      const contents = notesAtEnd.map(note => note.content)
      expect(contents).toContain('async/await simplifies making async calls')
    })

    test('fails with status code 400 if invalid data', async () => {
      const newNote = { important: true }
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)
      const notesAtEnd = await helper.notesInDB()
      expect(notesAtEnd).toHaveLength(helper.initialNote.length)
    })
  })

  describe('deletion of note', () => {
    test('succeeds with status code 204 if is in valid', async () => {
      const notesAtStart = await helper.notesInDB()
      const noteToDelete = notesAtStart[0]
      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDB()
      expect(notesAtEnd).toHaveLength(helper.initialNote.length - 1)
      const contents = notesAtEnd.map(note => note.content)
      expect(contents).not.toContain(noteToDelete.content)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})