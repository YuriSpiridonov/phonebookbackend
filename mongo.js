const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the arguments as: node mongo.js <password> or node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
// const personName = process.argv[3]
// const number = process.argv[4]

const url =
  `mongodb+srv://phonebook:${password}@cluster0.gpp3t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  personName: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length > 4) {
// if (personName && number) {
  //add entries to the phonebook DB
  const person = new Person({
    // personName: personName,
    // number: number,
    personName: process.argv[3],
    number: process.argv[4],
  })

  person.save()
    .then(result => {
      console.log(`added ${person.personName} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(error => 
      console.log(`Error: ${error}`)
    )
} else {
  // list all( of the existing entries in the phonebook DB
  console.log('phonebook:')
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person.personName, person.number)
    })
    mongoose.connection.close()
  })
}
