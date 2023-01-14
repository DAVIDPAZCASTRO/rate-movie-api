const express = require('express')
const logger = require('./loggerMiddleware')

const app = express()

app.use(express.json())
app.use(logger)

let movies = [
  {
    id: 0,
    title: 'The Godfather',
    description: 'The Godfather'
  },
  {
    id: 1,
    title: 'Titanic',
    description: 'Titanic'
  },
  {
    id: 2,
    title: 'Toy story',
    description: 'Toy story'
  }
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type": "application/json" });
//   response.end(JSON.stringify(movies));
// });

app.get('/', (request, response) => {
  response.send('<h1>LISTA DE PELÍCULAS</h1>')
})

app.get('/api/movies', (request, response) => {
  response.json(movies)
})

app.get('/api/movies/:id', (request, response) => {
  const id = Number(request.params.id)
  const movie = movies.find((movie) => movie.id === id)
  if (movie) {
    response.json(movie)
  } else {
    response.status(404).end()
  }
})

app.post('/api/movies', (request, response) => {
  const movie = request.body

  if (!movie?.title) {
    return response.status(400).json({
      error: 'movie.title is missing'
    })
  }

  const ids = movies.map((movie) => movie.id)
  const maxId = Math.max(...ids)
  const newMovie = {
    id: maxId + 1,
    title: movie.title,
    description: movie.description
  }
  movies = [...movies, newMovie]
  response.status(201).json(newMovie)
})

app.delete('/api/movies/:id', (request, response) => {
  const id = Number(request.params.id)
  movies = movies.filter((movie) => movie.id !== id)
  response.status(204).end()
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
