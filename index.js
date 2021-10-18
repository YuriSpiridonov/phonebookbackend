const { request } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.json())
app.use(cors())

let phonebook = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

morgan.token('content', (request) => 
    request.method === 'POST' && request.body.name
        ? JSON.stringify(request.body) 
        : null 
)

const generateId = () => (
    Math.random().toString().slice(2, 15) + Math.random().toString().slice(2, 15)
)

app.get('/', (request, response) => {
    response.send(
        `<h1>
            Go to the proper 
            <a href="http://localhost:3001/api/persons">page</a>
            or check 
            <a href="http://localhost:3001/info">info</a>.
        </h1>`)
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toString()
    
    response.send(
        `<div>
            <p>Phonebook has info for ${phonebook.length} people</p>
        </div>
        <div>
            <p>${currentDate}</p>
        </div>`
    )
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
          })
    } else if (phonebook.find(entrie => entrie.name === person.name)) {
        return response.status(400).json({
            error: 'Name must be unique'
          })
    }

    const contact = {
        name: person.name,
        number: person.number,
        id: generateId(),
    }

    phonebook = phonebook.concat(contact)

    response.json(contact)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
    
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
