const config = require('./utilities/config');
const express = require('express')
const app = express();
require('express-async-errors');
const cors = require('cors')
const mongoose = require('mongoose')
const blogApi = require('./routes/blogApi')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogApi);

app.use((err, request, response, next) => {
  if (err.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(err);
})

app.listen(config.PORT, () => {
  process.env.NODE_ENV === 'test' ? null : console.log(`Server running on port ${config.PORT}`);
})

module.exports = app;