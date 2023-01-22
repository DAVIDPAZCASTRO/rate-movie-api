const notFound = (request, response, next) => {
  response.status(404).send({ error: 'Not found' })
}

module.exports = notFound
