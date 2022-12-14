const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    next()
    return
  }
  response.token = null
  next()
}

const userExtractor = (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.decode(request.token, process.env.SECRET)
    request.user = decodedToken
    next()
    return
  }

  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}