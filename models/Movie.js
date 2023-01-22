const { model, Schema } = require('mongoose')

const movieSchema = new Schema({
  title: String,
  description: String
})

movieSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Movie = model('Movie', movieSchema)

module.exports = Movie
