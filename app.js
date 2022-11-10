const http = require('http')
const config = require('./utilities/config');
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogApi = require('./routes/blogApi')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/blog', blogApi);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})