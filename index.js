require('dotenv').config()

// const { request } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')
const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

// let phonebook = [
//     { 
//         "id": 1,
//         "name": "Arto Hellas", 
//         "number": "040-123456"
//       },
//       { 
//         "id": 2,
//         "name": "Ada Lovelace", 
//         "number": "39-44-5323523"
//       },
//       { 
//         "id": 3,
//         "name": "Dan Abramov", 
//         "number": "12-43-234345"
//       },
//       { 
//         "id": 4,
//         "name": "Mary Poppendieck", 
//         "number": "39-23-6423122"
//       }
// ]

morgan.token('content', (request) => 
    request.method === 'POST' && request.body.name
        ? JSON.stringify(request.body) 
        : null 
)

// const generateId = () => (
//     Math.random().toString().slice(2, 15) + Math.random().toString().slice(2, 15)
// )

// app.get('/', (request, response) => {
//     response.send(
//         `<h1>
//             Go to the proper 
//             <a href="/api/persons">page</a>
//             or check 
//             <a href="/info">info</a>.
//         </h1>`
//     )
// })

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        })
    // old version
    // response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
    })
    // old version
    // const id = Number(request.params.id)
    // const person = phonebook.find(person => person.id === id)
    
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
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
    // } else if (phonebook.find(entrie => entrie.name === person.name)) {
    } else if (Person.find({ name: newPerson.name })) {
        return response.status(400).json({
            error: 'Name must be unique'
          })
    }

    const contact = new Person ({
        name: newPerson.name,
        number: newPerson.number,
        // id: generateId(),
    })

    // phonebook = phonebook.concat(contact)
    contact.save().then(savedContact => {
        response.json(savedContact)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
    
    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
