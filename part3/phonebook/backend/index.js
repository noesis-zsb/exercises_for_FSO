let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// register express and morgan
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.static('dist')) // Express to analyse /dist for rendering frontend
app.use(express.json())     // open express.json() firstly

morgan.token('body', (req, res) => {
    // when post
    if(req.method === "POST"){
        return JSON.stringify(req.body)
    }else{
        return ''
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// create pages
// list
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// enquiry
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    // use find() to replace filter(), if filter() return [] === true
    person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    }else{
        // if not found a person
        response.status(404).end()
    }
})

// show phone info
app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()

    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>    
    `)
})

// delete one person by id
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

// add one person
app.post('/api/persons/', (request, response) => {
    const body = request.body
    
    // check if the name/number miss
    if(!body || !body.name || !body.number){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    // check if the name exists
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
})

// running web app
const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})