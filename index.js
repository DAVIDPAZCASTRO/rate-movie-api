require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Movie = require('./models/Movie')
const logger = require('./middleware/logger')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

app.use(logger)

app.get('/', (request, response) => {
  response.send('<h1>LISTA DE PELÍCULAS</h1>')
})

app.get('/api/movies', (request, response) => {
  Movie.find({}).then(movies => {
    response.json(movies)
  })
})

app.get('/api/movies/:id', (request, response, next) => {
  const id = request.params.id
  Movie.findById(id)
    .then(movie => {
      if (movie) {
        response.json(movie)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/movies', (request, response) => {
  const movie = request.body

  if (!movie?.title) {
    return response.status(400).json({
      error: 'movie.title is missing'
    })
  }
  const newMovie = new Movie({
    title: movie.title,
    description: movie.description
  })

  newMovie.save()
    .then((savedMovie) => {
      response.status(201).json(savedMovie)
    })
})

app.put('/api/movies/:id', (request, response, next) => {
  const id = request.params.id
  const movieInfo = request.body

  const newMovieInfo = {
    title: movieInfo.title,
    description: movieInfo.description
  }
  Movie.findByIdAndUpdate(id, newMovieInfo, { new: true })
    .then(movie => {
      response.json(movie)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/movies/:id', (request, response, next) => {
  const id = request.params.id
  Movie.findByIdAndDelete(id)
    .then(movie => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
