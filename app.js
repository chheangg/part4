const config = require('./utilities/config');
require('express-async-errors')
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')

const blogApi = require('./routes/blogApi')
const userApi = require('./routes/userApi')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogApi);
app.use('/api/users', userApi)

app.use((error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
})

app.listen(config.PORT, () => {
  process.env.NODE_ENV === 'test' ? null : console.log(`Server running on port ${config.PORT}`);
})

module.exports = app;