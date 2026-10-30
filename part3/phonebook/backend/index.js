// firstly
require('dotenv').config()

// register express and morgan
const express = require('express')
const morgan = require('morgan')

const app = express()
// import module Person
const Person = require('./models/person')

// load app.use()
app.use(express.static('dist')) // Express to analyse /dist for rendering frontend
app.use(express.json())     // open express.json() firstly

// define requestLogger
const requestLogger = (request, _response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)      // register requestLogger

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return ''
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// create pages
// list
app.get('/api/persons', (_request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

// enquiry
app.get('/api/persons/:id', (request, response, next) => {
  //const id = request.params.id
  // use find() to replace filter(), if filter() return [] === true
  /* old code without mongoose
  person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  }else{
    // if not found a person
    response.status(404).end()
  }
      **/

  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }else{
        // we don't find this one by id
        response.status(404).end()
      }
    })
    .catch(error => next(error))      // return 400 if don't find id
})

// show phone info
app.get('/info', (_request, response, next) => {
  // new code using mongoose
  Person.countDocuments({}).then(count => {
    const date = new Date()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>    
    `)
  })
    .catch(error => next(error))
})

// update
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if(updatedPerson) {
        response.json(updatedPerson)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// delete one person by id
app.delete('/api/persons/:id', (request, response, next) => {
  /* old code without mongoose
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
  */

  // new code using mongoose
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// add one person
app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  // check if the name/number miss
  if(!body || !body.name || !body.number){
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }
  // check if the name exists
  /*
  const nameExist = persons.some(
      p => p.name.toLowerCase() === body.name.trim().toLowerCase()
  )
  if (nameExist){
      return response.status(400).json({
          error: 'name must be unique'
      })
  }

  const newId = String(Math.floor(Math.random() * 10000000))
  const p = {
      id: newId,
      name: body.name.trim(),
      number: body.number.trim()
  }

  // concat
  persons = persons.concat(p)
  response.status(201).json(persons)
  */
  // new version: add records
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // save person to MongoDB
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})


// return 404 if don't find the proper url
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// processing error (**need to be loaded finally**)
const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// running web app
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})