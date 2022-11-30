const config = require('./utilities/config');
require('express-async-errors')
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')

const blogApi = require('./routes/blogApi')
const userApi = require('./routes/userApi')

const middleware = require('./utilities/middleware')
const logger = require('./utilities/logger')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())


app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogApi);
app.use('/api/users', userApi)

app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  process.env.NODE_ENV === 'test' ? null : logger.info(`Server running on port ${config.PORT}`);
})

module.exports = app;