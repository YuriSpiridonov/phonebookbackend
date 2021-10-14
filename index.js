const express = require('express')
const app = express()

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

app.get('/', (request, response) => {
    response.send('<h1>Go to the proper <a href="http://localhost:3001/api/persons">page</a></h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toString()
    
    response.send(
        `<div>
            <p>Phonebook has info for ${phonebook.length} people</p>
        </div>
        <div>
        <p>${currentDate}</p>
        </div>
        `
    )
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
