require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')
const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('content', (request) => 
    request.method === 'POST' && request.body.name
        ? JSON.stringify(request.body) 
        : null 
)

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
    })
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toString()
    
    Person.find({}).then(persons => {
        response.send(
            `<div>
                <p>Phonebook has info for ${persons.length} people</p>
            </div>
            <div>
                <p>${currentDate}</p>
            </div>`
        )
    })
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    console.log(newPerson.name)
    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
          })
    }

    const contact = new Person ({
        name: newPerson.name,
        number: newPerson.number,
    })

    contact.save().then(savedContact => {
        response.json(savedContact)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findOneAndDelete({ id: request.params.id })
        .then(() => response.status(204).end())
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
