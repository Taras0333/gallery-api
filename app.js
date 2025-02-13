require('dotenv').config()
require('express-async-errors')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const limiter = require('express-rate-limit')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const morgan = require('morgan')

const endpointsDoc = YAML.load('./swagger.yaml')

const picturesRoute = require('./routes/pictures')

const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

const server = express()

//middleware
server.use(express.json())
server.use(morgan('tiny'))

// security
server.use(helmet())
server.use(cors())
server.use(xss())
server.use(
  limiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  })
)

// routes
server.use('/api/v1/pictures', picturesRoute)
server.use('/swagger', swaggerUI.serve, swaggerUI.setup(endpointsDoc))

// errors handle
server.use(notFound)
server.use(errorHandler)

const port = process.env.PORT || 5001

server.listen(port, () => {
  console.log(`The server is listening to port: ${port}`)
})
